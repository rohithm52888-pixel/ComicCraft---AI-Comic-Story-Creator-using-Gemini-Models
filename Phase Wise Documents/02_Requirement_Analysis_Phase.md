# ComicCraft – AI Comic Story Creator
## Phase 2: Requirement Analysis

| Field | Details |
| --- | --- |
| Project | ComicCraft – AI Comic Story Creator using Gemini Models |
| Phase | 2 of 8 – Requirement Analysis |
| Team / Author | [Team name / member names] |
| Date | [DD-MM-YYYY] |
| Version | 1.0 |

---

## 1. Purpose of This Phase

To list exactly what ComicCraft must do (functional requirements), how well it must do it (non-functional requirements), and what it needs to run (technical requirements).

---

## 2. Project Scope

**In scope**

- Web form to collect story prompt, main character, setting, tone and art style
- Five-panel outline, narration and dialogue generation using Gemini
- One AI-generated illustration per panel
- In-browser panel-by-panel preview
- PDF export with timestamped filename
- JSON REST API and Swagger documentation
- Local run with Uvicorn

**Out of scope (Version 1)**

- User accounts and saved libraries
- Editing panels before export
- Voice narration and sound effects
- Multiple page sizes, print-ready export, social sharing

---

## 3. Stakeholders and Users

| Stakeholder | Interest |
| --- | --- |
| End user (hobbyist, student, educator, creator) | Quickly get an illustrated comic from a short idea |
| Developer / API consumer | Generate comics programmatically through JSON |
| Project team / maintainers | Maintainable code, easy model updates, secure keys |
| Reviewers / evaluators | Working end-to-end demo and clear documentation |

---

## 4. User Stories

| ID | As a… | I want to… | So that… |
| --- | --- | --- | --- |
| US-01 | user | enter a one-line story idea | I do not need to write a full story |
| US-02 | user | name the main character | the comic is personalised |
| US-03 | user | choose setting, tone and art style | the comic matches the mood I want |
| US-04 | user | see the comic panel by panel | I can review title, image, description and narration |
| US-05 | user | switch tone or style and generate again | I can try a different look and feel |
| US-06 | user | download the comic as a PDF | I can share or print it |
| US-07 | developer | call a JSON endpoint | I can generate comics from my own program |
| US-08 | developer | open Swagger docs | I can test the API interactively |

---

## 5. Functional Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-01 | The system shall show a home page form with fields for story prompt, character name, setting, tone and art style. | Must |
| FR-02 | The system shall generate a **five-panel** structured outline; each panel has a title, a scene description and an image prompt (Gemini Flash). | Must |
| FR-03 | The system shall generate narration and character dialogue for the panels (Gemini Pro). | Must |
| FR-04 | The system shall generate one comic-style image per panel (Stable Diffusion). | Must |
| FR-05 | The system shall match each image with its panel text (layout builder). | Must |
| FR-06 | The system shall display panels one after another with title, image, description and narration. | Must |
| FR-07 | The system shall export the full comic as a multi-page PDF with a timestamped filename. | Must |
| FR-08 | The system shall show an export confirmation page after the PDF is created. | Should |
| FR-09 | The system shall provide `POST /generate-comic/json` returning the layout and PDF path. | Should |
| FR-10 | The system shall provide `POST /test-image` for developers to generate a single image from a prompt. | Could |
| FR-11 | The system shall serve interactive API docs at `/docs`. | Should |
| FR-12 | The system shall let users change tone or art style and re-run the whole pipeline. | Should |
| FR-13 | The system shall return clear errors when input is invalid or an AI service fails. | Must |

### Input options

| Field | Options / examples |
| --- | --- |
| Story prompt | Free text, e.g. "A brave fox exploring an enchanted forest" |
| Main character | Free text, e.g. Rusty, Luna, Max |
| Setting | school, forest, space, city, ocean, castle |
| Tone | light-hearted, dramatic, poetic, funny, mysterious |
| Art style | comic book, anime, pixel art, realistic, watercolor |

---

## 6. Non-Functional Requirements

| ID | Category | Requirement |
| --- | --- | --- |
| NFR-01 | Usability | Simple form-based workflow that a non-technical user can complete without help |
| NFR-02 | Performance | Panels appear in sequence; generation time depends on hardware (GPU recommended, CPU supported but slower) |
| NFR-03 | Reliability | Errors from AI services are caught (`HTTPException`, try/except) and reported instead of crashing the app |
| NFR-04 | Security | API keys are stored in `.env`, loaded with `python-dotenv`, never committed to Git |
| NFR-05 | Maintainability | Modular code: each stage lives in its own file; model IDs are easy to change |
| NFR-06 | Portability | Runs on Windows, macOS and Linux with Python 3.9+ |
| NFR-07 | Compatibility | Works in modern browsers; PDF opens in any standard PDF viewer |
| NFR-08 | Documentation | README, API docs (Swagger) and phase documents available |

---

## 7. Technical Requirements

### 7.1 Software

| Item | Requirement |
| --- | --- |
| Language | Python 3.9+ and `pip` |
| Backend | FastAPI, Uvicorn |
| Templates | Jinja2, `python-multipart` for form data |
| Text AI | `google-generativeai` (Gemini Flash, Gemini Pro) |
| Image AI | `diffusers`, `transformers`, `accelerate`, `torch` (Stable Diffusion) |
| PDF | `fpdf` |
| Images | `Pillow` |
| Config | `python-dotenv` |
| Tools | Git, virtual environment (`venv`) |

### 7.2 Accounts and keys

| Item | Purpose |
| --- | --- |
| Google Gemini API key (Google AI Studio) | Outline and story generation |
| Hugging Face access token | Downloading Stable Diffusion weights |

### 7.3 Hardware

| Item | Requirement |
| --- | --- |
| GPU | NVIDIA GPU with CUDA recommended |
| CPU-only | Supported but much slower |
| Disk | A few GB for Stable Diffusion weights, plus space for generated panels and PDFs |
| Network | Internet needed for Gemini API and first-time model download |

---

## 8. System Interfaces

| Interface | Description |
| --- | --- |
| Web UI | `index.html` (form), `comic_preview.html` (preview), `export_success.html` (confirmation) |
| REST API | `GET /`, `POST /generate`, `POST /generate-comic/json`, `GET /export-success`, `POST /test-image` |
| External API | Google Gemini API |
| Model hub | Hugging Face (Stable Diffusion weights) |
| File system | `static/panels/` (images), `static/exports/` (PDFs) |

---

## 9. Constraints

- Gemini model IDs may be retired by Google; older `1.5` IDs may return "not found".
- Image generation quality and speed depend on hardware.
- Free API tiers may have rate limits.
- First run needs a large model download.
- Version 1 always produces **five** panels.

---

## 10. Assumptions and Dependencies

- Users have a working internet connection and a modern browser.
- A valid Gemini API key and Hugging Face token are available.
- The Gemini and Stable Diffusion services stay available.
- The person running the app can install Python packages.

---

## 11. Acceptance Criteria

| # | Criterion |
| --- | --- |
| AC-1 | Submitting the form with valid input shows five panels, each with title, image, description and narration. |
| AC-2 | The chosen tone and art style are visibly reflected in the text and images. |
| AC-3 | Clicking **Download PDF** creates a multi-page PDF with a timestamped filename in `static/exports/`. |
| AC-4 | `POST /generate-comic/json` returns a `layout` list and a `pdf_path`. |
| AC-5 | Missing keys or AI failures show a readable error and do not crash the server. |
| AC-6 | `/docs` opens the Swagger UI. |

---

## 12. Requirement Traceability

| Objective (Phase 1) | Requirements |
| --- | --- |
| O1 Idea → structured story | FR-01, FR-02 |
| O2 Five-panel outline | FR-02 |
| O3 Narration and dialogue | FR-03 |
| O4 Panel artwork | FR-04, FR-05 |
| O5 Setting, tone, style | FR-01, FR-12 |
| O6 PDF download | FR-07, FR-08 |

---

## 13. Outcome of the Phase

- Functional, non-functional and technical requirements documented and prioritised.
- Input options and acceptance criteria defined.

**Next phase:** Project Design.
