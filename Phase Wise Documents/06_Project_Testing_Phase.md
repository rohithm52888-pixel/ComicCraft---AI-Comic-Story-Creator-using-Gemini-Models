# ComicCraft – AI Comic Story Creator
## Phase 6: Project Testing

| Field | Details |
| --- | --- |
| Project | ComicCraft – AI Comic Story Creator using Gemini Models |
| Phase | 6 of 8 – Project Testing |
| Team / Author | [Team name / member names] |
| Date | [DD-MM-YYYY] |
| Version | 1.0 |

> **How to use this document:** The test cases and expected results below are ready to run. The **Actual Result** and **Status** columns are left blank so you can record real outcomes after testing.

---

## 1. Purpose of This Phase

To check that ComicCraft meets the requirements from Phase 2 and behaves correctly when things go wrong.

---

## 2. Test Scope

**In scope:** web form, outline, story, image generation, layout, PDF export, JSON API, error handling, configuration and security checks.

**Out of scope:** user accounts, panel editing, audio (not in Version 1).

---

## 3. Test Strategy

| Type | Focus |
| --- | --- |
| Unit / module testing | Each function alone: `generate_outline()`, `generate_story()`, `generate_image()`, `build_comic_layout()`, `save_pdf()` |
| Integration testing | Full pipeline from input to PDF |
| API testing | Routes tested through browser, Swagger UI (`/docs`) and curl |
| Functional (UI) testing | Form, preview and export pages |
| Error-handling testing | Missing keys, invalid input, retired model ID |
| Non-functional checks | Speed on GPU vs CPU, browser compatibility, secret handling |

---

## 4. Test Environment

| Item | Details |
| --- | --- |
| OS | [Windows / macOS / Linux] |
| Python | [3.9+ version] |
| Hardware | [GPU model or CPU only] |
| Browser | [Chrome / Edge / Firefox versions] |
| Server | `uvicorn app.main:app --reload` at http://127.0.0.1:8000 |
| Keys | Valid `GEMINI_API_KEY` and `HF_API_KEY` in `.env` (unless the test says otherwise) |

### Test data

| Field | Value |
| --- | --- |
| Story prompt | A brave fox exploring an enchanted forest |
| Character | Rusty |
| Setting | forest |
| Tone | dramatic (also light-hearted, funny) |
| Art style | anime (also comic book) |

---

## 5. Test Cases

### 5.1 Functional and UI

| ID | Scenario | Steps | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- |
| TC-01 | Home page loads | Open `/` | Form shows story prompt, character, setting, tone and art style inputs and the **Create my comic** button | | |
| TC-02 | Valid comic generation | Submit the test data | Preview page shows five panels in order, each with title, image, description and narration | | |
| TC-03 | Outline structure | Check outline output | Exactly five panels; each has a title, scene description and image prompt | | |
| TC-04 | Narration and dialogue | Check story output | Every panel has narration and character dialogue | | |
| TC-05 | Panel images created | Check `static/panels/` after TC-02 | One image file per panel, saved and shown in the preview | | |
| TC-06 | Layout order | Inspect layout | Panels numbered 1 to 5; each image matches its panel text | | |
| TC-07 | PDF export | Click **Download PDF** | Multi-page PDF saved in `static/exports/` as `comic_<YYYYMMDD>_<HHMMSS>.pdf`; opens correctly | | |
| TC-08 | Export success page | After TC-07 | `export_success.html` shows a confirmation | | |
| TC-09 | Character name used | Use "Rusty" | The character name appears in the story text | | |
| TC-10 | Setting reflected | Try forest, space, city | Story and images match the chosen setting | | |

### 5.2 Style variation

| ID | Scenario | Steps | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- |
| TC-11 | Tone: funny vs dramatic | Generate twice with different tones | Text style is noticeably different | | |
| TC-12 | Art style: anime vs comic book | Generate twice with different styles | Images are visibly different in style | | |
| TC-13 | Regenerate with new options | Change tone and art style, generate again | Whole pipeline runs again; new outline, story and images appear | | |

### 5.3 API

| ID | Scenario | Steps | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- |
| TC-14 | JSON generation | `POST /generate-comic/json` with the curl example | Response has `layout` (five items with `panel`, `image`, `text`) and `pdf_path` | | |
| TC-15 | JSON missing field | Send JSON without `prompt` | Request rejected with an HTTP error and a clear message; server keeps running | | |
| TC-16 | Test image endpoint | `POST /test-image` with a prompt | One image is generated | | |
| TC-17 | Swagger docs | Open `/docs` | Swagger UI lists all endpoints and can call them | | |

### 5.4 Error handling and robustness

| ID | Scenario | Steps | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- |
| TC-18 | Empty story prompt | Submit the form with an empty prompt | Readable message; no crash | | |
| TC-19 | Invalid Gemini key | Set a wrong `GEMINI_API_KEY`, generate | Error handled and reported; no crash | | |
| TC-20 | Missing `.env` | Remove `.env`, start app and generate | Clear error about missing keys; no crash | | |
| TC-21 | Retired Gemini model ID | Use a model ID that returns "not found" | Error reported; changing the ID in `gemini_flash.py` / `gemini_pro.py` fixes it | | |
| TC-22 | Stable Diffusion failure | Break the Hugging Face token or model access | Error handled and reported | | |
| TC-23 | Special characters | Prompt with quotes, symbols and emoji | Image file names are safe; generation still works | | |
| TC-24 | Very long prompt | Paste a long paragraph | App handles it or shows a clear message | | |

### 5.5 Non-functional and security

| ID | Scenario | Steps | Expected result | Actual result | Status |
| --- | --- | --- | --- | --- | --- |
| TC-25 | GPU run | Generate a comic on a CUDA GPU | Completes; record total time | | |
| TC-26 | CPU-only run | Generate a comic on CPU | Completes, slower than GPU; record total time | | |
| TC-27 | Browser compatibility | Open the app in two or more browsers | Layout and preview work in each | | |
| TC-28 | Secrets not in Git | Check repo and `.gitignore` | `.env` is ignored and not committed; no keys in source | | |
| TC-29 | Generated files ignored | Check `.gitignore` | `static/panels/` and `static/exports/` are ignored | | |
| TC-30 | Repeated generation | Generate three comics in a row | Each gets unique files; no overwrite of earlier PDFs | | |

---

## 6. Requirement Coverage

| Requirement | Covered by |
| --- | --- |
| FR-01 Input form | TC-01, TC-09, TC-10 |
| FR-02 Five-panel outline | TC-03 |
| FR-03 Narration and dialogue | TC-04 |
| FR-04 Panel images | TC-05, TC-12 |
| FR-05 Layout | TC-06 |
| FR-06 Preview | TC-02 |
| FR-07 PDF export | TC-07, TC-30 |
| FR-08 Export page | TC-08 |
| FR-09 JSON API | TC-14, TC-15 |
| FR-10 Test image | TC-16 |
| FR-11 Swagger docs | TC-17 |
| FR-12 Regenerate with new style | TC-11, TC-13 |
| FR-13 Error handling | TC-15, TC-18 to TC-24 |
| NFR-04 Security | TC-28, TC-29 |
| NFR-02 Performance | TC-25, TC-26 |
| NFR-07 Compatibility | TC-27 |

---

## 7. Defect Log (template)

| Defect ID | Related test | Description | Severity (High / Med / Low) | Status (Open / Fixed / Retested) | Owner |
| --- | --- | --- | --- | --- | --- |
| D-01 | | | | | |
| D-02 | | | | | |

---

## 8. Test Summary (fill in after execution)

| Metric | Value |
| --- | --- |
| Total test cases | 30 |
| Passed | [ ] |
| Failed | [ ] |
| Blocked / not run | [ ] |
| Defects found / fixed | [ ] / [ ] |
| GPU generation time | [ ] |
| CPU generation time | [ ] |

---

## 9. Entry and Exit Criteria

**Entry:** all modules and routes implemented, app runs, valid keys available.

**Exit:**

- All Must-have test cases (TC-01 to TC-08, TC-14) pass.
- No open High-severity defects.
- Error-handling cases (TC-18 to TC-22) show readable messages, with no server crash.

---

## 10. Outcome of the Phase

- Test plan, 30 test cases and defect log ready to execute.

**Next phase:** Project Documentation.
