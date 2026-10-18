// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { formatAreaDisplay } = require('./engines/unitConverter');
const { generateChecklist } = require('./engines/checklistEngine');
const { analyzeDiscrepancies } = require('./engines/discrepancyEngine');

const app = express();
app.use(cors());
app.use(express.json());

// Helper: enrich a single land_record with documents + rule engine outputs
async function buildFullLandDueDiligence(landRecord) {
  const docRes = await pool.query(
    `SELECT * FROM documents WHERE land_id = $1 ORDER BY issue_date ASC, document_id ASC`,
    [landRecord.land_id]
  );

  const documents = docRes.rows.map((doc) => ({
    ...doc,
    formatted_area: formatAreaDisplay(doc.recorded_area, doc.area_unit)
  }));

  const checklist = generateChecklist(landRecord, documents);
  const discrepancyAnalysis = analyzeDiscrepancies(landRecord, documents);
  const masterFormattedArea = formatAreaDisplay(landRecord.land_area, landRecord.area_unit);

  // Determine overall status badge for directory cards
  let overallStatus = 'CLEAN';
  if (
    landRecord.is_khas ||
    landRecord.is_acquired_or_gazetted ||
    landRecord.is_vested_or_abandoned ||
    landRecord.litigation_status === 'DISPUTE_REPORTED'
  ) {
    overallStatus = 'HIGH_RISK';
  } else if (checklist.some((c) => c.status === 'MISSING')) {
    overallStatus = 'MISSING_DOCS';
  } else if (discrepancyAnalysis.hasDiscrepancies) {
    overallStatus = 'DISCREPANCY';
  }

  return {
    land: {
      ...landRecord,
      formatted_area: masterFormattedArea,
      overall_status: overallStatus
    },
    documents,
    checklist,
    discrepancyAnalysis,
    disclaimer: {
      bn: 'তথ্যগত অমিল বা ঘাটতি শনাক্ত হলে ক্রয়ের পূর্বে সাব-রেজিস্ট্রি বা ভূমি অফিসে সরাসরি যোগাযোগ করে অফিসিয়াল যাচাইয়ের পরামর্শ দেওয়া হচ্ছে। JomiSearch কোনো সরকারি মালিকানা সনদ প্রদান করে না।',
      en: 'Potential clerical/survey discrepancy detected. Official verification with competent land authorities is strongly recommended. JomiSearch does not issue legal ownership certificates.'
    }
  };
}

// 1. GET /api/locations - Cascading filter metadata (District -> Upazila -> Mouza)
app.get('/api/locations', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT division, district, upazila, mouza, jl_number
       FROM land_records
       ORDER BY district, upazila, mouza`
    );
    res.json({ success: true, locations: result.rows });
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ success: false, message: 'Server error loading locations' });
  }
});

// 2. GET /api/lands - Search & Filter Land Records with Scenario & Pagination Support
app.get('/api/lands', async (req, res) => {
  try {
    const {
      district,
      upazila,
      mouza,
      khatian_number,
      dag_number,
      scenario,
      page = 1,
      limit = 12
    } = req.query;

    const conditions = [];
    const values = [];

    if (district) {
      values.push(district.trim());
      conditions.push(`district = $${values.length}`);
    }
    if (upazila) {
      values.push(upazila.trim());
      conditions.push(`upazila = $${values.length}`);
    }
    if (mouza) {
      values.push(mouza.trim());
      conditions.push(`mouza = $${values.length}`);
    }
    if (khatian_number) {
      values.push(`%${khatian_number.trim()}%`);
      conditions.push(`khatian_number ILIKE $${values.length}`);
    }
    if (dag_number) {
      values.push(`%${dag_number.trim()}%`);
      conditions.push(`dag_number ILIKE $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const landRes = await pool.query(
      `SELECT * FROM land_records ${whereClause} ORDER BY land_id ASC`,
      values
    );

    // Enrich all matching records through the dynamic engines
    const enrichedList = await Promise.all(
      landRes.rows.map((row) => buildFullLandDueDiligence(row))
    );

    // Optional scenario filter computed dynamically
    const filteredByScenario = scenario && scenario !== 'ALL'
      ? enrichedList.filter((item) => item.land.overall_status === scenario)
      : enrichedList;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, parseInt(limit, 10) || 12);
    const startIndex = (pageNum - 1) * pageSize;
    const paginated = filteredByScenario.slice(startIndex, startIndex + pageSize);

    res.json({
      success: true,
      total: filteredByScenario.length,
      page: pageNum,
      totalPages: Math.ceil(filteredByScenario.length / pageSize),
      results: paginated
    });
  } catch (err) {
    console.error('Error searching lands:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 3. GET /api/lands/:id - Full Land Due-Diligence Profile & Report Data
app.get('/api/lands/:id', async (req, res) => {
  try {
    const landId = parseInt(req.params.id, 10);
    if (isNaN(landId)) {
      return res.status(400).json({ success: false, message: 'Invalid land ID format' });
    }

    const landRes = await pool.query(`SELECT * FROM land_records WHERE land_id = $1`, [landId]);
    if (landRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: {
          bn: 'প্রদত্ত তথ্যের সাথে কোনো ডেমো রেকর্ড পাওয়া যায়নি।',
          en: 'No matching demo records found for this reference.'
        }
      });
    }

    const dueDiligenceData = await buildFullLandDueDiligence(landRes.rows[0]);
    res.json({ success: true, data: dueDiligenceData });
  } catch (err) {
    console.error('Error fetching land profile:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 4. GET /api/qr/:qrReference - Option A Demo QR Code Lookup
app.get('/api/qr/:qrReference', async (req, res) => {
  try {
    const qrRef = String(req.params.qrReference || '').trim().toUpperCase();
    if (!qrRef) {
      return res.status(400).json({ success: false, message: 'QR reference is required' });
    }

    const docRes = await pool.query(
      `SELECT * FROM documents WHERE UPPER(qr_reference) = $1 LIMIT 1`,
      [qrRef]
    );

    if (docRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: {
          bn: `কিউআর রেফারেন্স "${qrRef}"-এর সাথে আমাদের ডেমো ডেটাবেজে কোনো নথি পাওয়া যায়নি। এটি কোনো জাল দলিলের প্রমাণ নয়—অনুগ্রহ করে সঠিক ডেমো কোড (যেমন: QR-DH-1001, QR-SV-2005, QR-CTG-3012) ব্যবহার করুন।`,
          en: `No matching demo record found for QR reference "${qrRef}". This does not imply inauthenticity—please try a valid demo code (e.g., QR-DH-1001, QR-SV-2005, QR-CTG-3012).`
        }
      });
    }

    const matchedDocument = docRes.rows[0];
    const landRes = await pool.query(
      `SELECT * FROM land_records WHERE land_id = $1`,
      [matchedDocument.land_id]
    );

    const dueDiligenceData = await buildFullLandDueDiligence(landRes.rows[0]);
    res.json({
      success: true,
      matchedDocument,
      data: dueDiligenceData
    });
  } catch (err) {
    console.error('Error in QR lookup:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 JomiSearch Backend running on http://localhost:${PORT}`);
});