// backend/seed.js
const fs = require('fs');
const path = require('path');
const pool = require('./db');

const locations = [
  { division: 'ঢাকা', district: 'ঢাকা', upazila: 'সাভার', mouza: 'বিরুলিয়া', jl: 'JL-14', prefix: 'SV' },
  { division: 'ঢাকা', district: 'ঢাকা', upazila: 'সাভার', mouza: 'আশুলিয়া', jl: 'JL-22', prefix: 'AS' },
  { division: 'ঢাকা', district: 'ঢাকা', upazila: 'কেরানীগঞ্জ', mouza: 'শুভাঢ্যা', jl: 'JL-45', prefix: 'KR' },
  { division: 'ঢাকা', district: 'ঢাকা', upazila: 'ধামরাই', mouza: 'কুল্লা', jl: 'JL-09', prefix: 'DHM' },
  { division: 'ঢাকা', district: 'ঢাকা', upazila: 'ঢাকা সদর', mouza: 'ধানমন্ডি', jl: 'JL-01', prefix: 'DH' },
  { division: 'ঢাকা', district: 'গাজীপুর', upazila: 'জয়দেবপুর', mouza: 'কোনাবাড়ী', jl: 'JL-31', prefix: 'GZ' },
  { division: 'ঢাকা', district: 'গাজীপুর', upazila: 'কালিয়াকৈর', mouza: 'চন্দ্রা', jl: 'JL-18', prefix: 'KL' },
  { division: 'ঢাকা', district: 'নারায়ণগঞ্জ', upazila: 'রূপগঞ্জ', mouza: 'পূর্বাচল', jl: 'JL-52', prefix: 'RP' },
  { division: 'ঢাকা', district: 'নারায়ণগঞ্জ', upazila: 'সোনারগাঁ', mouza: 'পানাম', jl: 'JL-11', prefix: 'SN' },
  { division: 'চট্টগ্রাম', district: 'চট্টগ্রাম', upazila: 'পাঁচলাইশ', mouza: 'ষোলশহর', jl: 'JL-07', prefix: 'CTG' },
  { division: 'চট্টগ্রাম', district: 'চট্টগ্রাম', upazila: 'সীতাকুণ্ড', mouza: 'ভাটিয়ারী', jl: 'JL-29', prefix: 'STK' },
  { division: 'চট্টগ্রাম', district: 'চট্টগ্রাম', upazila: 'পটিয়া', mouza: 'হাবিলাসদ্বীপ', jl: 'JL-63', prefix: 'PT' },
  { division: 'চট্টগ্রাম', district: 'চট্টগ্রাম', upazila: 'মিরসরাই', mouza: 'ইছাখালী', jl: 'JL-84', prefix: 'MRS' },
  { division: 'সিলেট', district: 'সিলেট', upazila: 'সিলেট সদর', mouza: 'খাদিমনগর', jl: 'JL-19', prefix: 'SYL' },
  { division: 'চট্টগ্রাম', district: 'কুমিল্লা', upazila: 'আদর্শ সদর', mouza: 'ধর্মপুর', jl: 'JL-38', prefix: 'CUM' },
  { division: 'রাজশাহী', district: 'রাজশাহী', upazila: 'পবা', mouza: 'হরিয়ান', jl: 'JL-12', prefix: 'RAJ' },
  { division: 'রাজশাহী', district: 'বগুড়া', upazila: 'বগুড়া সদর', mouza: 'মাটিডালি', jl: 'JL-27', prefix: 'BOG' }
];

const owners = [
  'মোঃ আব্দুল করিম', 'আলহাজ্ব রফিকুল ইসলাম', 'মিসেস ফাতেমা বেগম', 'মোঃ কামরুল হাসান',
  'সৈয়দ মোস্তফা কামাল', 'প্রফেসর ড. আনিসুর রহমান', 'মোঃ জহিরুল হক', 'বেগম রোকেয়া সুলতানা',
  'মোঃ মাহবুবুর রহমান', 'ইঞ্জিনিয়ার তানভীর আহমেদ', 'মোঃ শফিকুল আলম', 'নুসরাত জাহান চৌধুরী'
];

const landClasses = ['ভিটি', 'নাল', 'বাড়ি', 'চালা', 'ডাঙ্গা', 'পুকুর'];

async function seedDatabase() {
  const client = await pool.connect();
  try {
    console.log('⏳ Initializing PostgreSQL Schema...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf-8');
    await client.query(schemaSql);

    await client.query('BEGIN');

    let docCounter = 1000;
    const nextQr = (prefix, customCode = null) => {
      if (customCode) return customCode;
      docCounter += 1;
      return `QR-${prefix}-${docCounter}`;
    };

    console.log('🌱 Seeding 50 Realistic Land Plots & ~195 Linked Documents...');

    for (let i = 1; i <= 50; i++) {
      const loc = locations[(i - 1) % locations.length];
      const owner = owners[(i - 1) % owners.length];
      const landClass = landClasses[(i - 1) % landClasses.length];
      const baseDag = String(100 + i * 5);
      const baseKhatian = `KH-${200 + i}`;
      const baseArea = Number((4.5 + (i % 12) * 1.25).toFixed(2)); // in decimal

      // Scenario classification based on MASTER_CONTEXT.md:
      // 1..25  -> Clean & Verified (25 plots)
      // 26..35 -> Dag & Area Discrepancy (10 plots)
      // 36..43 -> Missing Mutation & Overdue Tax (8 plots)
      // 44..47 -> Govt Khas / Acquisition Warning (4 plots)
      // 48..50 -> Court Litigation / Title Suit (3 plots)

      let isKhas = false;
      let isVested = false;
      let isAcquired = false;
      let litigationStatus = 'NO_RECORD_FOUND';
      let remarks = 'সকল রেকর্ড ও মাঠ পর্চা প্রাথমিকভাবে সামঞ্জস্যপূর্ণ।';

      if (i >= 26 && i <= 35) {
        remarks = 'দলিল ও খতিয়ানের দাগ বা জমির পরিমাণে আংশিক পার্থক্য পরিলক্ষিত হয়েছে।';
      } else if (i >= 36 && i <= 43) {
        remarks = 'বিক্রেতার নিজ নামে ই-নামজারি পাওয়া যায়নি এবং ভূমি উন্নয়ন কর বকেয়া রয়েছে।';
      } else if (i === 44 || i === 45) {
        isKhas = true;
        remarks = 'সতর্কতা: এই দাগটি ১ নং খাস খতিয়ানভুক্ত সরকারি জমির অন্তর্ভুক্ত।';
      } else if (i === 46) {
        isAcquired = true;
        remarks = 'সতর্কতা: সড়ক সম্প্রসারণ / রেলসংযোগ প্রকল্পের জন্য ভূমি অধিগ্রহণ (LA Case) নোটিশভুক্ত।';
      } else if (i === 47) {
        isVested = true;
        remarks = 'সতর্কতা: অর্পিত সম্পত্তি ( ক তফসিল ) তালিকায় অন্তর্ভুক্তির রেকর্ড রয়েছে।';
      } else if (i >= 48 && i <= 50) {
        litigationStatus = 'DISPUTE_REPORTED';
        remarks = `দেওয়ানি আদালতে স্বত্ব ও বাঁটোয়ারা মামলা (Title Suit No. ${110 + i}/2024) এবং অস্থায়ী নিষেধাজ্ঞা চলমান।`;
      }

      // Specific flagship plot overrides for memorable demo lookups
      let finalDag = baseDag;
      let finalKhatian = isKhas ? '1' : baseKhatian;
      let finalArea = baseArea;

      if (i === 1) {
        // Clean Flagship Plot (QR-DH-1001)
        finalDag = '105';
        finalKhatian = 'KH-201';
        finalArea = 5.50;
      } else if (i === 26) {
        // Flagship Dag & Area Discrepancy Plot (QR-SV-2005)
        finalDag = '205';
        finalKhatian = 'KH-410';
        finalArea = 10.00;
      } else if (i === 36) {
        // Flagship Missing Mutation & Overdue Tax Plot (QR-CTG-3012)
        finalDag = '312';
        finalKhatian = 'KH-512';
        finalArea = 8.25;
      }

      const insertLandRes = await client.query(
        `INSERT INTO land_records (
          division, district, upazila, mouza, jl_number, khatian_number, dag_number,
          land_area, area_unit, land_class, is_khas, is_vested_or_abandoned,
          is_acquired_or_gazetted, litigation_status, remarks
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        RETURNING land_id`,
        [
          loc.division, loc.district, loc.upazila, loc.mouza, loc.jl,
          finalKhatian, finalDag, finalArea, 'decimal', landClass,
          isKhas, isVested, isAcquired, litigationStatus, remarks
        ]
      );

      const landId = insertLandRes.rows[0].land_id;

      // Helper to insert a document
      const insertDoc = async (doc) => {
        await client.query(
          `INSERT INTO documents (
            land_id, document_type, document_number, issuing_authority, issue_date,
            qr_reference, recorded_owner_name, recorded_dag_number, recorded_khatian_number,
            recorded_area, area_unit, tax_paid_up_to_year, document_status, notes
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
          [
            landId, doc.type, doc.number, doc.authority, doc.date,
            doc.qr, doc.owner, doc.dag, doc.khatian,
            doc.area, doc.unit, doc.taxYear || null, doc.status || 'ACTIVE', doc.notes || null
          ]
        );
      };

      // 1. CS_KHATIAN (All plots have historical CS record)
      await insertDoc({
        type: 'CS_KHATIAN',
        number: `CS-${100 + i}`,
        authority: `জেলা রেকর্ড রুম, ${loc.district}`,
        date: '1940-03-15',
        qr: i === 1 ? 'QR-DH-1001' : nextQr(loc.prefix),
        owner: isKhas ? 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার (পক্ষে জেলা প্রশাসক)' : `মরহুম হাজী ${owner.split(' ').pop()}`,
        dag: finalDag,
        khatian: `CS-${100 + i}`,
        area: Number((finalArea / 100).toFixed(4)), // Stored in Acre in CS Khatian to showcase unit conversion!
        unit: 'acre',
        notes: 'সিএস জরিপের মূল ছাপা খতিয়ান (একরে পরিমাপকৃত)'
      });

      // 2. RS_KHATIAN
      // For plots 26..30 (Dag Discrepancy subset), RS Khatian has a mismatched Dag (e.g. 250 instead of 205)
      const rsDag = (i >= 26 && i <= 30) ? (i === 26 ? '250' : String(Number(finalDag) + 45)) : finalDag;
      await insertDoc({
        type: 'RS_KHATIAN',
        number: `RS-${300 + i}`,
        authority: `সহকারী সেটেলমেন্ট অফিস, ${loc.upazila}`,
        date: '1985-07-20',
        qr: nextQr(loc.prefix),
        owner: isKhas ? 'জেলা প্রশাসক (১ নং খাস খতিয়ান)' : owner,
        dag: rsDag,
        khatian: finalKhatian,
        area: finalArea,
        unit: 'decimal',
        notes: (i >= 26 && i <= 30)
          ? 'আরএস জরিপে দাগ নম্বর পরিবর্তিত বা লিপিকর ত্রুটি রয়েছে'
          : 'আরএস জরিপ চূড়ান্ত প্রকাশিত পর্চা'
      });

      // 3. TITLE_DEED (মূল বিক্রয় কবলা দলিল)
      await insertDoc({
        type: 'TITLE_DEED',
        number: `DEED-${2015 + (i % 8)}-${4000 + i}`,
        authority: `সাব-রেজিস্ট্রি অফিস, ${loc.upazila}`,
        date: '2018-11-12',
        qr: i === 26 ? 'QR-SV-2005' : (i === 36 ? 'QR-CTG-3012' : nextQr(loc.prefix)),
        owner: owner,
        dag: finalDag,
        khatian: finalKhatian,
        area: finalArea,
        unit: 'decimal',
        notes: 'রেজিস্ট্রিকৃত সাফ কবলা দলিল'
      });

      // 4. BAYA_DEED (পেছনের বায়া দলিল - included on Clean & Discrepancy & Litigation plots)
      if (i <= 35 || i >= 48) {
        await insertDoc({
          type: 'BAYA_DEED',
          number: `BAYA-1998-${1200 + i}`,
          authority: `সাব-রেজিস্ট্রি অফিস, ${loc.upazila}`,
          date: '1998-05-10',
          qr: nextQr(loc.prefix),
          owner: `পূর্ববর্তী মালিক (${owner}-এর দাতা)`,
          dag: finalDag,
          khatian: `SA-${200 + i}`,
          area: finalArea,
          unit: 'decimal',
          notes: '২৫ বছরের ধারাবাহিক ভায়া দলিল'
        });
      }

      // 5. MUTATION_KHATIAN (ই-নামজারি খতিয়ান - OMITTED for plots 36..43 Missing Mutation scenario & Khas plots 44..45)
      if (i <= 35 || i >= 46) {
        // For plots 26..35 (Discrepancy scenario), introduce Area Variance (e.g. 10.00 decimal in Deed vs 8.50 decimal in Mutation)
        const mutationArea = (i >= 26 && i <= 35)
          ? (i === 26 ? 8.50 : Number((finalArea - 1.50).toFixed(2)))
          : finalArea;

        await insertDoc({
          type: 'MUTATION_KHATIAN',
          number: `MUT-2023-${8000 + i}`,
          authority: `উপজেলা ভূমি অফিস (AC Land), ${loc.upazila}`,
          date: '2023-02-18',
          qr: nextQr(loc.prefix),
          owner: owner,
          dag: finalDag,
          khatian: finalKhatian,
          area: mutationArea,
          unit: 'decimal',
          notes: (i >= 26 && i <= 35)
            ? 'আংশিক অংশ বা যৌথ মালিকানার কারণে নামজারিতে জমির পরিমাণ কম অনুমোদিত'
            : 'ই-নামজারি চূড়ান্ত খতিয়ান ও ডিসিআর'
        });
      }

      // 6. TAX_DAKHILA (ভূমি উন্নয়ন কর দাখিলা)
      // Plots 1..25 have up-to-date 1433 Bangabda (or 1431+); Plots 36..43 have overdue tax (1426 Bangabda)
      const taxYear = (i >= 36 && i <= 43) ? '১৪২৬ বঙ্গাব্দ' : '১৪৩৩ বঙ্গাব্দ';
      await insertDoc({
        type: 'TAX_DAKHILA',
        number: `DAKHILA-${90000 + i}`,
        authority: `ইউনিয়ন ভূমি অফিস, ${loc.mouza}`,
        date: (i >= 36 && i <= 43) ? '2019-08-14' : '2026-04-20',
        qr: nextQr(loc.prefix),
        owner: owner,
        dag: finalDag,
        khatian: finalKhatian,
        area: finalArea,
        unit: 'decimal',
        taxYear: taxYear,
        notes: (i >= 36 && i <= 43)
          ? 'ভূমি উন্নয়ন কর দীর্ঘদিন বকেয়া রয়েছে'
          : 'অনলাইন ভূমি উন্নয়ন কর (LD Tax) পরিশোধিত দাখিলা'
      });
    }

    await client.query('COMMIT');
    console.log('✅ Successfully seeded 50 land_records and all linked documents!');
    console.log('📌 Quick Test QR Codes: QR-DH-1001 (Clean), QR-SV-2005 (Discrepancy), QR-CTG-3012 (Missing Mutation & Tax Overdue)');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', err);
  } finally {
    client.release();
    process.exit(0);
  }
}

seedDatabase();