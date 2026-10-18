-- database/schema.sql
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS land_records CASCADE;

-- Table 1: land_records (জমির মূল প্রোফাইল)
CREATE TABLE land_records (
    land_id SERIAL PRIMARY KEY,
    division VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    upazila VARCHAR(100) NOT NULL,
    mouza VARCHAR(150) NOT NULL,
    jl_number VARCHAR(50) NOT NULL,
    khatian_number VARCHAR(50) NOT NULL,
    dag_number VARCHAR(50) NOT NULL,
    land_area NUMERIC(10, 2) NOT NULL,
    area_unit VARCHAR(20) DEFAULT 'decimal' NOT NULL,
    land_class VARCHAR(50) NOT NULL,
    is_khas BOOLEAN DEFAULT FALSE,
    is_vested_or_abandoned BOOLEAN DEFAULT FALSE,
    is_acquired_or_gazetted BOOLEAN DEFAULT FALSE,
    litigation_status VARCHAR(50) DEFAULT 'NO_RECORD_FOUND' CHECK (
        litigation_status IN ('NO_RECORD_FOUND', 'DISPUTE_REPORTED', 'NOT_CHECKED')
    ),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: documents (সম্পর্কিত দলিল ও ঐতিহাসিক খতিয়ান)
CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    land_id INT NOT NULL REFERENCES land_records(land_id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (
        document_type IN (
            'CS_KHATIAN',
            'SA_KHATIAN',
            'RS_KHATIAN',
            'CITY_SURVEY',
            'MUTATION_KHATIAN',
            'TITLE_DEED',
            'BAYA_DEED',
            'TAX_DAKHILA',
            'DCR'
        )
    ),
    document_number VARCHAR(100) NOT NULL,
    issuing_authority VARCHAR(150) NOT NULL,
    issue_date DATE NOT NULL,
    qr_reference VARCHAR(100) UNIQUE NOT NULL,
    recorded_owner_name VARCHAR(200) NOT NULL,
    recorded_dag_number VARCHAR(50) NOT NULL,
    recorded_khatian_number VARCHAR(50) NOT NULL,
    recorded_area NUMERIC(10, 2) NOT NULL,
    area_unit VARCHAR(20) NOT NULL CHECK (
        area_unit IN ('acre', 'decimal', 'katha', 'bigha')
    ),
    tax_paid_up_to_year VARCHAR(20),
    document_status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (
        document_status IN ('ACTIVE', 'RECTIFIED', 'CANCELLED')
    ),
    notes TEXT
);

-- Indexes for fast citizen search & QR lookup
CREATE INDEX idx_land_search ON land_records (district, upazila, mouza, khatian_number, dag_number);
CREATE INDEX idx_doc_land_id ON documents (land_id);
CREATE INDEX idx_doc_qr ON documents (qr_reference);