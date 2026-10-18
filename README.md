**#  JomiSearch (জমি সার্চ)**



**\*\*Citizen-Facing Pre-Purchase Land Due-Diligence Assistant for Bangladesh\*\*** &#x20;

*\*Smart Pre-Purchase Land Record, Khatian, Deed & Mutation Verification Platform (Version 2.0)\**



**---**



**## 📖 1. Executive Summary & Product Mission**



In Bangladesh, verifying historical and current property records before buying a plot of land—such as **\*\*CS (Cadastral Survey), SA (State Acquisition), RS (Revisional Survey) Khatians, Baya Deeds (Prior Chain Deeds), Registered Title Deeds, e-Mutation (Namjari), and Land Development Tax Receipts (Dakhila)\*\***—is a fragmented and complex process for ordinary citizens.



**\*\*JomiSearch\*\*** is a citizen-friendly web application designed to act as a **\*\*Smart Pre-Purchase Due-Diligence Assistant\*\***, bringing multi-document verification, unit conversion, and legal risk checks into a single, easy-to-understand interface.



**\*\*JomiSearch\*\*** হলো বাংলাদেশের সাধারণ নাগরিকদের জন্য তৈরি একটি **\*\*Citizen-facing Pre-Purchase Land Due-Diligence Assistant\*\*** ওয়েব অ্যাপ্লিকেশন। বাংলাদেশে একজন সাধারণ নাগরিক জমি কেনার পূর্বে যাতে ওই নির্দিষ্ট প্লটের সম্পর্কিত যাবতীয় উপলব্ধ রেকর্ড (সিএস, এসএ, আরএস খতিয়ান, নামজারি, মূল ও বায়া দলিল এবং খাজনার দাখিলা) এবং আইনি সীমাবদ্ধতা এক জায়গায় সহজে যাচাই করতে পারেন—সেই লক্ষ্যেই এই প্ল্যাটফর্মটি তৈরি করা হয়েছে।





**### Core Value Proposition (JomiSearch vs. e-Porcha / DLRMS)**



Government portals like **\*\*e-Porcha\*\*** or **\*\*DLRMS\*\*** are designed for searching or applying for individual land records. **\*\*JomiSearch\*\*** does not replicate government portals; instead, it aggregates structured metadata across multiple land documents and performs real-time comparative due diligence:



1\. **\*\*Cross-Document Discrepancy Detection:\*\*** Automatically compares plot numbers (Dag) and land areas across historical surveys, deeds, and mutations to highlight inconsistencies.

2\. **\*\*4-Color Pre-Purchase Verification Checklist:\*\*** Evaluates document presence and validity using four clear visual statuses: 🟢 **\*\*Found\*\***, 🔴 **\*\*Missing\*\***, 🟠 **\*\*Discrepancy\*\***, and ⚪ **\*\*Not Checked\*\***.

3\. **\*\*Automated Land Area Normalization:\*\*** Converts traditional Bangladeshi land units (**\*\*Acre\*\***, **\*\*Decimal/Shotok\*\***, **\*\*Katha\*\***, and **\*\*Bigha\*\***) into a unified internal base standard (**\*\*Decimal\*\***) for accurate mathematical comparison.

4\. **\*\*QR Code Document Lookup:\*\*** Allows citizens to scan a document QR code via camera, upload a QR image, or enter a reference string to pull up the associated plot's full due-diligence profile.

5\. **\*\*Bilingual Interface & Printable Summary Report:\*\*** Instant toggle between **\*\*Bengali (\`bn\` default)\*\*** and **\*\*English (\`en\`)\*\***, complete with a single-page, print-ready consolidated due-diligence report and buyer next steps.



**### ⚖️ Critical Boundaries & Ethical Guardrails**



\* **\*\*No Legal Ownership Certification:\*\*** JomiSearch is an independent citizen-assistance tool, **\*\*not\*\*** a government authority, and does **\*\*not\*\*** issue legal ownership or title certificates.

\* **\*\*Non-Accusatory Tone:\*\*** When a missing record or field discrepancy is detected, the system never labels a document or person as *\*"fake"\**, *\*"forged"\**, or *\*"fraudulent"\**. Instead, it provides objective, precautionary guidance:

&#x20; \> *\*"Potential clerical/survey discrepancy detected. Official verification with competent land authorities (Sub-Registry or AC Land Office) is strongly recommended."\**



**---**



**## ⚙️ 2. System Architecture & Technology Stack**



\* **\*\*Frontend:\*\*** React 18 (Vite), React Router v6, Tailwind CSS (*\*"Golden Paddy & Frosted Glass"\** Design System), Lucide React Icons, \`html5-qrcode\`.

\* **\*\*Backend:\*\*** Node.js, Express.js (Modular REST APIs powered by 3 real-time rule engines).

\* **\*\*Database:\*\*** PostgreSQL (\`pg\` connection pool with a strict, bloat-free **\*\*2-Table Relational Schema\*\***).



**### Backend Rule Engines (Code Engines Over Database Bloat)**



To ensure scalability without storing static checklists or redundant discrepancy rows in PostgreSQL, the backend executes three modular engines in real time:



1\. **\*\*Unit Converter Engine (\`backend/engines/unitConverter.js\`):\*\***

&#x20;  \* Normalizes all document land areas into **\*\*Decimal (শতক)\*\*** using standard Bangladesh land formulas:

&#x20;    \* $1 \text{ Acre} = \text{value} \times 100 \text{ Decimal}$

&#x20;    \* $1 \text{ Decimal} = \text{value} \times 1.0 \text{ Decimal}$

&#x20;    \* $1 \text{ Katha} = \text{value} \times 1.65289 \text{ Decimal}$ (720 sq. ft. standard)

&#x20;    \* $1 \text{ Bigha} = \text{value} \times 33.0 \text{ Decimal}$

&#x20;  \* Applies an epsilon tolerance of $\pm 0.02 \text{ Decimal}$ to prevent false-positive alerts caused by floating-point rounding across historical surveys.



2\. **\*\*Automated Checklist Engine (\`backend/engines/checklistEngine.js\`):\*\***

&#x20;  \* Evaluates Khatian chain continuity (\`CS\` & \`RS\`), Title/Baya Deed presence, e-Mutation status, Land Development Tax validity (benchmark: $\ge 1431 \text{ Bangabda}$), Government Encumbrances (Khas/Vested/Acquired), and Court Litigation status.



3\. **\*\*Cross-Document Discrepancy Engine (\`backend/engines/discrepancyEngine.js\`):\*\***

&#x20;  \* Performs field-by-field comparison across \`CS_KHATIAN\` $\rightarrow$ \`RS_KHATIAN\` $\rightarrow$ \`TITLE_DEED\` $\rightarrow$ \`MUTATION_KHATIAN\` $\rightarrow$ \`TAX_DAKHILA\`, generating bilingual warning notices and a side-by-side comparison matrix.



**---**



**## 📂 3. Project Directory Structure**



\`\`\`text

jomisearch/

├── README.md                           # Full project documentation & setup guide

├── database/

│   └── schema.sql                      # 2-table PostgreSQL schema (land_records, documents)

├── backend/

│   ├── package.json

│   ├── .env                            # PORT=4000 and DATABASE_URL configuration

│   ├── db.js                           # PostgreSQL connection pool

│   ├── seed.js                         # Automated seeder (50 plots & \~195 documents)

│   ├── engines/

│   │   ├── unitConverter.js            # Area normalization & conversion engine

│   │   ├── checklistEngine.js          # 4-color verification checklist engine

│   │   └── discrepancyEngine.js        # Cross-document discrepancy engine

│   └── server.js                       # Express REST API server

└── frontend/

&#x20;   ├── package.json

&#x20;   ├── vite.config.js                  # Vite config with /api proxy to localhost:4000

&#x20;   ├── tailwind.config.js

&#x20;   ├── postcss.config.js

&#x20;   ├── index.html

&#x20;   └── src/

&#x20;       ├── main.jsx

&#x20;       ├── index.css

&#x20;       ├── context/

&#x20;       │   └── LanguageContext.jsx     # Bilingual i18n context ('bn' default, 'en')

&#x20;       ├── components/

&#x20;       │   ├── BrandLogo.jsx           # Bangladesh Map Outline + Search Lens SVG

&#x20;       │   ├── SplashScreen.jsx        # 1.8s animated preloader screen

&#x20;       │   ├── Header.jsx              # Frosted glass navbar & scrolling notice ticker

&#x20;       │   ├── InfoTooltip.jsx         # '(i)' interactive citizen guidance popovers

&#x20;       │   ├── Footer.jsx              # Official portal links & legal disclaimer

&#x20;       │   └── QrScannerModal.jsx      # Camera, image upload & demo QR lookup modal

&#x20;       ├── pages/

&#x20;       │   ├── HomePage.jsx            # Manual search form & QR entry point

&#x20;       │   ├── LandProfilePage.jsx     # Plot profile, 4-color checklist & comparison table

&#x20;       │   └── ReportPage.jsx          # Print-friendly single-page summary report

&#x20;       └── App.jsx

\`\`\`



**---**



**## 🗄️ 4. Database Schema & 50-Plot Synthetic Dataset**



The PostgreSQL database strictly uses only **\*\*2 core tables\*\***:



1\. **\*\*\`land_records\`:\*\*** Stores master plot information (\`division\`, \`district\`, \`upazila\`, \`mouza\`, \`jl_number\`, \`khatian_number\`, \`dag_number\`, \`land_area\`, \`area_unit\`, \`land_class\`, \`is_khas\`, \`is_vested_or_abandoned\`, \`is_acquired_or_gazetted\`, \`litigation_status\`, \`remarks\`).

2\. **\*\*\`documents\`:\*\*** Stores historical and current records linked via \`land_id\` (\`CS_KHATIAN\`, \`RS_KHATIAN\`, \`TITLE_DEED\`, \`BAYA_DEED\`, \`MUTATION_KHATIAN\`, \`TAX_DAKHILA\`), including owner names, recorded Dag/Khatian numbers, recorded areas, tax year, and unique \`qr_reference\` strings.



**### Scenario Breakdown of the 50 Seeded Plots**



\* **\*\*Plots 1 – 25 (25 Plots):\*\*** 🟢 **\*\*Clean & Verified Plots\*\*** — Complete CS, RS, Title Deed, Baya Deed, Mutation, and up-to-date Land Tax (1433 Bangabda).

\* **\*\*Plots 26 – 35 (10 Plots):\*\*** 🟠 **\*\*Dag & Area Discrepancy Plots\*\*** — Contains mismatched plot numbers (e.g., Title Deed Dag \`205\` vs. RS Khatian Dag \`250\`) and area variances (e.g., \`10.00 Decimal\` in Title Deed vs. \`8.50 Decimal\` in Mutation).

\* **\*\*Plots 36 – 43 (8 Plots):\*\*** 🔴 **\*\*Missing Mutation & Overdue Tax Plots\*\*** — Missing seller e-Mutation (\`MUTATION_KHATIAN\`) and overdue Land Development Tax (last paid in \`1426 Bangabda\`).

\* **\*\*Plots 44 – 47 (4 Plots):\*\*** ⚠️ **\*\*Government Khas / Acquisition / Vested Plots\*\*** — Flagged under Government Khas Khatian No. 1, Vested Property, or Land Acquisition (LA) notice.

\* **\*\*Plots 48 – 50 (3 Plots):\*\*** ⚠️ **\*\*Court Litigation Plots\*\*** — Active civil court title suits and injunctions reported.



**### Quick-Test Demo QR Codes**



\| QR Reference | Scenario Tested | Location (Mouza, Upazila, District) | Dag & Khatian |

\| :--- | :--- | :--- | :--- |

\| **\*\*\`QR-DH-1001\`\*\*** | 🟢 **\*\*Clean & Verified Plot\*\*** (Showcases Acre $\rightarrow$ Decimal conversion) | Birulia, Savar, Dhaka | Dag: \`105\`, Khatian: \`KH-201\` |

\| **\*\*\`QR-SV-2005\`\*\*** | 🟠 **\*\*Dag & Area Discrepancy\*\*** (Dag \`205\` vs \`250\` & Area \`10.00\` vs \`8.50\`) | Chandra, Kaliakair, Gazipur | Dag: \`205\`, Khatian: \`KH-410\` |

\| **\*\*\`QR-CTG-3012\`\*\*** | 🔴 **\*\*Missing Mutation & Overdue Tax\*\*** (Last paid \`1426 Bangabda\`) | Kulla, Dhamrai, Dhaka | Dag: \`312\`, Khatian: \`KH-512\` |



**---**



**## 🚀 5. Complete Local Setup Guide (PostgreSQL, Windows & macOS)**



Follow these step-by-step instructions to set up and run **\*\*JomiSearch\*\*** on either **\*\*Windows\*\*** or **\*\*macOS\*\***.



**### Prerequisites**



1\. **\*\*Node.js (v18+ LTS recommended):\*\*** Download and install from [https\://nodejs.org]\(https\://nodejs.org).

2\. **\*\*PostgreSQL (v15, v16, or v17):\*\*** Download and install from [https\://www\.postgresql.org/download/]\(https\://www\.postgresql.org/download/).



**---**



**### Step 1: Install PostgreSQL & Create the \`jomisearch\` Database**



**#### 🪟 Option A: For Windows Users**



1\. **\*\*Run the PostgreSQL Installer:\*\***

&#x20;  \* Double-click the downloaded \`.exe\` installer and click **\*\*Next\*\***.

&#x20;  \* Keep **\*\*PostgreSQL Server\*\***, **\*\*pgAdmin 4\*\***, and **\*\*Command Line Tools\*\*** checked (you may uncheck *\*Stack Builder\**).

&#x20;  \* When prompted for a superuser (\`postgres\`) password, enter a memorable password without special URL characters (e.g., \`12345\` or \`postgres\`).

&#x20;  \* Keep the default port as **\*\*\`5432\`\*\*** and locale as **\*\*\`[Default locale]\`\*\***, then complete the installation.

2\. **\*\*Create the \`jomisearch\` Database (Method 1 — Using pgAdmin 4 GUI):\*\***

&#x20;  \* Open **\*\*pgAdmin 4\*\*** from the Windows Start Menu.

&#x20;  \* In the left sidebar, expand **\*\*Servers\*\*** $\rightarrow$ **\*\*PostgreSQL 16/17\*\*** and enter your password.

&#x20;  \* Right-click on **\*\*Databases\*\*** $\rightarrow$ select **\*\*Create\*\*** $\rightarrow$ **\*\*Database...\*\***

&#x20;  \* Type **\*\*\`jomisearch\`\*\*** (all lowercase) in the **\*\*Database\*\*** field and click **\*\*Save\*\***.

3\. **\*\*Create the \`jomisearch\` Database (Method 2 — Using SQL Shell \`psql\`):\*\***

&#x20;  \* Open **\*\*SQL Shell (psql)\*\*** from the Windows Start Menu.

&#x20;  \* Press \`Enter\` four times to accept the defaults for \`Server [localhost]\`, \`Database [postgres]\`, \`Port [5432]\`, and \`Username [postgres]\`.

&#x20;  \* Type your PostgreSQL password (characters will remain hidden) and press \`Enter\`.

&#x20;  \* At the \`postgres=#\` prompt, run:

&#x20;    \`\`\`sql

&#x20;    CREATE DATABASE jomisearch;

&#x20;    \`\`\`



**#### 🍎 Option B: For macOS Users**



1\. **\*\*Install PostgreSQL:\*\***

&#x20;  \* You can install PostgreSQL using the official **\*\*EDB macOS Installer\*\***, **\*\*Postgres.app\*\***, or **\*\*Homebrew\*\***:

&#x20;    \`\`\`bash

&#x20;    brew install postgresql\@16

&#x20;    brew services start postgresql\@16

&#x20;    \`\`\`

2\. **\*\*Create the \`jomisearch\` Database (Method 1 — Using pgAdmin 4 GUI):\*\***

&#x20;  \* Open **\*\*pgAdmin 4\*\*** from \`/Applications\`, connect to your local PostgreSQL server, right-click **\*\*Databases\*\*** $\rightarrow$ **\*\*Create\*\*** $\rightarrow$ **\*\*Database...\*\***, enter **\*\*\`jomisearch\`\*\***, and click **\*\*Save\*\***.

3\. **\*\*Create the \`jomisearch\` Database (Method 2 — Using macOS Terminal):\*\***

&#x20;  \* Open Terminal and run:

&#x20;    \`\`\`bash

&#x20;    psql -U postgres -c "CREATE DATABASE jomisearch;"

&#x20;    \`\`\`



**---**



**### Step 2: Backend Configuration, Database Seeding & Server Launch**



\> **\*\*💡 Why Port \`4000\` is Used:\*\*** &#x20;

\> On macOS (Monterey and newer), port \`5000\` is reserved by Apple's built-in **\*\*AirPlay Receiver\*\*** service. Using port **\*\*\`4000\`\*\*** ensures zero port conflicts across both **\*\*Windows\*\*** and **\*\*macOS\*\***.



1\. **\*\*Open Terminal 1\*\*** in VS Code (or Command Prompt / PowerShell / macOS Terminal) and navigate to the \`backend\` folder:

&#x20;  \`\`\`bash

&#x20;  cd backend

&#x20;  \`\`\`



2\. **\*\*Configure \`backend/.env\`:\*\***

&#x20;  Create or open \`backend/.env\` and set your PostgreSQL password in \`DATABASE_URL\` (replace \`12345\` with your actual PostgreSQL password):

&#x20;  \`\`\`env

&#x20;  PORT=4000

&#x20;  DATABASE_URL=postgresql://postgres:12345\@localhost:5432/jomisearch

&#x20;  \`\`\`



3\. **\*\*Install Backend Dependencies:\*\***

&#x20;  \`\`\`bash

&#x20;  npm install

&#x20;  \`\`\`



4\. **\*\*Test the PostgreSQL Connection:\*\***

&#x20;  \`\`\`bash

&#x20;  node -e "require('./db').query('SELECT NOW()').then(r => { console.log('✅ Connection OK:', r.rows[0]); process.exit(0); }).catch(e => { console.error('❌ Connection Failed:', e.message); process.exit(1); })"

&#x20;  \`\`\`



5\. **\*\*Run the Database Seeder (Creates Schema + Seeds 50 Plots & \~195 Documents):\*\***

&#x20;  \`\`\`bash

&#x20;  node seed.js

&#x20;  \`\`\`

*\*Expected Output:\**

&#x20;  \`\`\`text

&#x20;  ⏳ Initializing PostgreSQL Schema...

&#x20;  🌱 Seeding 50 Realistic Land Plots & \~195 Linked Documents...

&#x20;  ✅ Successfully seeded 50 land_records and all linked documents!

&#x20;  📌 Quick Test QR Codes: QR-DH-1001 (Clean), QR-SV-2005 (Discrepancy), QR-CTG-3012 (Missing Mutation & Tax Overdue)

&#x20;  \`\`\`



6\. **\*\*Start the Backend Server:\*\***

&#x20;  \`\`\`bash

&#x20;  npm run dev

&#x20;  \`\`\`

*\*Expected Output:\**

&#x20;  \`\`\`text

&#x20;  🚀 JomiSearch Backend running on http\://localhost:4000

&#x20;  \`\`\`

*\*(Keep this terminal window running!)\**



**---**



**### Step 3: Frontend Setup & Launch**



1\. **\*\*Open a Second Terminal (Terminal 2)\*\*** in VS Code and navigate to the \`frontend\` folder:

&#x20;  \`\`\`bash

&#x20;  cd frontend

&#x20;  \`\`\`



2\. **\*\*Install Frontend Dependencies:\*\***

&#x20;  \`\`\`bash

&#x20;  npm install

&#x20;  \`\`\`



3\. **\*\*(If Using Strict npm Script Sandboxing on macOS/Windows):\*\***

&#x20;  If your npm configuration displays an \`allowScripts\` warning for \`esbuild\` or \`fsevents\`, approve and rebuild them:

&#x20;  \`\`\`bash

&#x20;  npm install-scripts approve esbuild

&#x20;  npm install-scripts approve fsevents

&#x20;  npm rebuild

&#x20;  \`\`\`



4\. **\*\*Start the Vite Development Server:\*\***

&#x20;  \`\`\`bash

&#x20;  npm run dev

&#x20;  \`\`\`



5\. **\*\*Open the Application in Your Browser:\*\***

&#x20;  Visit [**\*\*http\://localhost:5173\*\***]\(http\://localhost:5173) 🎉



**---**



**## 🌐 6. Cloud & Production Deployment Guide**



You can deploy **\*\*JomiSearch\*\*** to production cloud providers or any Windows/Linux/macOS server:



**### 1. Managed PostgreSQL Database (Neon / Supabase / Render)**

1\. Create a free PostgreSQL instance on [Neon.tech]\(https\://neon.tech), [Supabase]\(https\://supabase.com), or [Render]\(https\://render.com) and copy the connection string (\`postgresql://user:pass\@host/dbname?sslmode=require\`).

2\. Temporarily paste the cloud connection string into your local \`backend/.env\` as \`DATABASE_URL\` and run \`node seed.js\` once. This automatically initializes \`schema.sql\` and seeds all 50 plots into your cloud database.



**### 2. Backend API Deployment (Render / Railway / VPS)**

\* **\*\*Root Directory:\*\*** \`backend\`

\* **\*\*Build Command:\*\*** \`npm install\`

\* **\*\*Start Command:\*\*** \`npm start\` (\`node server.js\`)

\* **\*\*Environment Variables:\*\***

&#x20; \* \`PORT=4000\`

&#x20; \* \`DATABASE_URL=\<your-cloud-postgresql-connection-string>\`



**### 3. Frontend Production Build (Vercel / Netlify)**

\* **\*\*Root Directory:\*\*** \`frontend\`

\* **\*\*Build Command:\*\***

&#x20; \`\`\`bash

&#x20; npm run build

&#x20; \`\`\`

\* **\*\*Output Directory:\*\*** \`dist\`

\* To preview the production build locally:

&#x20; \`\`\`bash

&#x20; npm run preview

&#x20; \`\`\`



**---**



**## 🔌 7. REST API Reference**



\| Method | Endpoint | Description |

\| :--- | :--- | :--- |

\| \`GET\` | \`/api/locations\` | Returns distinct Divisions, Districts, Upazilas, Mouzas, and JL numbers for cascading search filters. |

\| \`GET\` | \`/api/lands\` | Searches and filters plots by \`district\`, \`upazila\`, \`mouza\`, \`khatian_number\`, \`dag_number\`, and \`scenario\` with pagination. |

\| \`GET\` | \`/api/lands/:id\` | Returns full plot details, linked documents, 4-color checklist items, and cross-document discrepancy analysis. |

\| \`GET\` | \`/api/qr/:qrReference\` | Looks up a document by its unique QR code (e.g., \`QR-DH-1001\`) and returns the parent plot's complete due-diligence profile. |



**---**



**## 🛠️ 8. Troubleshooting FAQ (Windows & macOS)**



\| Issue / Error Message | Cause | Exact Solution |

\| :--- | :--- | :--- |

\| **\*\*\`Port 5000 is already in use\` (macOS)\*\*** | macOS AirPlay Receiver occupies port \`5000\` by default. | Ensure \`PORT=4000\` is set in \`backend/.env\`, \`backend/server.js\`, and \`frontend/vite.config.js\`. |

\| **\*\*\`'psql' is not recognized as an internal or external command\` (Windows)\*\*** | PostgreSQL's \`bin\` folder is not in your Windows system \`PATH\`. | Use **\*\*pgAdmin 4\*\*** or open **\*\*SQL Shell (psql)\*\*** directly from the Windows Start Menu instead of standard Command Prompt. |

\| **\*\*\`connect ECONNREFUSED 127.0.0.1:5432\`\*\*** | The PostgreSQL background service is stopped. | **\*\*Windows:\*\*** Press \`Win + R\`, type \`services.msc\`, find \`postgresql-x64-16/17\`, right-click, and click **\*\*Start\*\***.\<br>**\*\*macOS:\*\*** Run \`brew services start postgresql\@16\` or start Postgres.app. |

\| **\*\*\`password authentication failed for user "postgres"\`\*\*** | The password in \`backend/.env\` does not match your PostgreSQL password. | Update \`DATABASE_URL\` in \`backend/.env\` with your exact password, save, and re-run \`node seed.js\`. |

\| **\*\*\`database "jomisearch" does not exist\`\*\*** | The \`jomisearch\` database has not been created yet. | Create \`jomisearch\` in **\*\*pgAdmin 4\*\*** or run \`CREATE DATABASE jomisearch;\` in SQL Shell (\`psql\`). |

\| **\*\*\`Internal Server Error\` on QR or Search\*\*** | The database exists but has no tables/data yet. | Run \`cd backend && node seed.js\` to create the tables and seed the 50 plots, then restart \`npm run dev\`. |

\| **\*\*\`npm audit\` warnings on \`nodemon\` / \`braces\`\*\*** | Dev-only file watcher sub-dependency advisory. | **\*\*Never\*\*** run \`npm audit fix --force\` (it downgrades packages to broken legacy versions). You can either ignore it or use Node's built-in watcher (\`node --watch server.js\`). |



**---**



**## 📜 9. License & Legal Disclaimer**



**\*\*JomiSearch\*\*** is an educational and civic-tech MVP prototype (Specification v2.0). All land records, Khatian numbers, deed numbers, owner names, and QR codes included in the seed script are **\*\*100% synthetic demo data\*\***. Prospective buyers must always verify original deeds, Registry Balam books, and Non-Encumbrance Certificates (NEC) directly with the competent Sub-Registry Office, AC Land Office, and a qualified property lawyer before entering into any financial transaction.


---

## 🤖 10. Project Development and AI Assistance Acknowledgements

The development of **JomiSearch** involved the effective integration of Artificial Intelligence (AI) and modern technologies across the project lifecycle, including concept development, system architecture, database schema design, rule engine development, and full-stack code implementation.

- **Primary AI Architect and Coding Assistant:** **Gemini** was primarily used for core code generation, rule engine design, and the implementation of system logic throughout the project.

- **Research and Development (R&D):** **Antigravity** and **ChatGPT** were used as R&D assistants for project idea generation, analysis of relevant land laws and regulations, and various forms of structural and technical research.

