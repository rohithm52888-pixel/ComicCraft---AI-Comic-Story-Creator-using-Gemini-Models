# ComicCraft – AI Comic Story Creator
## Phase 7: Project Documentation

| Field | Details |
| --- | --- |
| Project | ComicCraft – AI Comic Story Creator using Gemini Models |
| Phase | 7 of 8 – Project Documentation |
| Team / Author | [Team name / member names] |
| Date | [DD-MM-YYYY] |
| Version | 1.0 |

---

## 1. Purpose of This Phase

To gather all project knowledge into clear documents that users, developers and reviewers can rely on.

---

## 2. Documentation Inventory

| Document | Audience | Purpose | Location |
| --- | --- | --- | --- |
| `README.md` | Developers, users | Overview, setup, run steps, API reference | Repository root |
| `ComicCraft_Project_Documentation.docx` | Reviewers, evaluators | Overview, objectives, features, workflow, AI components, advantages, future work | Project folder |
| Swagger UI (`/docs`) | Developers | Interactive API documentation | http://127.0.0.1:8000/docs |
| Phase documents 01 to 08 | Team, reviewers | Record of each project phase | This document set |
| Project website | Public | Project reference page | https://comiccraft-readme-creation.vercel.app/ |

---

## 3. Project Summary (for quick reference)

**ComicCraft** is an AI-powered web app that turns a short story idea into a fully illustrated five-panel comic and exports it as a PDF.

| Aspect | Details |
| --- | --- |
| Input | Story prompt, main character, setting, tone, art style |
| Text AI | Gemini Flash (outline), Gemini Pro (narration and dialogue) |
| Image AI | Stable Diffusion via Hugging Face Diffusers (README implementation) |
| Backend | FastAPI, Uvicorn |
| Frontend | HTML, CSS, Jinja2 |
| Output | In-browser preview and PDF |

---

## 4. Contents of the README

The README covers:

1. Features
2. How it works (pipeline diagram)
3. Tech stack
4. AI models
5. Project structure
6. Prerequisites
7. Installation
8. Environment variables
9. Running the app
10. API endpoints
11. Usage scenarios
12. Project milestones
13. Contributing, license, acknowledgements

**Maintenance rule:** update the README whenever a route, model ID, dependency or folder changes.

---

## 5. User Guide

### 5.1 Creating a comic

1. Open the app at http://127.0.0.1:8000.
2. Enter a **story prompt**, for example *A brave fox exploring an enchanted forest*.
3. Enter the **main character**, for example *Rusty*.
4. Choose a **setting**, **tone** and **art style**.
5. Click **Create my comic**.
6. Wait while the outline, story and images are generated. The first run may take longer because of the model download.
7. Review the five panels: title, image, description and narration.
8. Click **Download PDF** to export.
9. Open the PDF from `static/exports/`.

### 5.2 Trying a different look

Choose another tone (for example *funny*) or art style (for example *comic book*) and generate again. The full pipeline runs again with the new settings.

### 5.3 Available options

| Field | Options |
| --- | --- |
| Setting | school, forest, space, city, ocean, castle |
| Tone | light-hearted, dramatic, poetic, funny, mysterious |
| Art style | comic book, anime, pixel art, realistic, watercolor |

### 5.4 Tips for better results

- Keep the prompt short and specific: who, where, what happens.
- Give the character a clear name.
- Match tone and art style to the story mood.

---

## 6. Installation Guide

See Phase 5, Section 2, or the README **Installation** section. In short:

1. Install Python 3.9+, Git and (recommended) an NVIDIA GPU with CUDA.
2. Clone the repository and create a virtual environment.
3. Run `pip install -r requirements.txt`.
4. Create `.env` with `GEMINI_API_KEY` and `HF_API_KEY`.
5. Start the app: `uvicorn app.main:app --reload`.

---

## 7. API Reference

| Method | Route | Description |
| --- | --- | --- |
| GET | `/` | Homepage form |
| POST | `/generate` | Runs the full pipeline from form data and shows the preview |
| POST | `/generate-comic/json` | Takes JSON and returns the comic layout and PDF path |
| GET | `/export-success` | PDF export confirmation |
| POST | `/test-image` | Developer tool: one image from a prompt |

### Request body for `/generate-comic/json`

| Field | Type | Example |
| --- | --- | --- |
| `prompt` | string | "A brave fox exploring an enchanted forest" |
| `character_name` | string | "Rusty" |
| `setting` | string | "forest" |
| `tone` | string | "dramatic" |
| `art_style` | string | "anime" |

### Response

```json
{
  "layout": [
    { "panel": 1, "image": "static/panels/a_brave_fox_entering_the_forest.png", "text": "Narration and dialogue for panel 1..." }
  ],
  "pdf_path": "static/exports/comic_20260928_101500.pdf"
}
```

---

## 8. Troubleshooting Guide

| Problem | Likely cause | Fix |
| --- | --- | --- |
| "Model not found" from Gemini | Old model ID retired by Google | Update the model ID in `gemini_flash.py` / `gemini_pro.py` (see the Gemini models list) |
| Authentication or API key error | Missing or wrong `GEMINI_API_KEY` | Check `.env` in the project root and restart the app |
| Cannot download Stable Diffusion | Missing or wrong `HF_API_KEY`, or no internet | Check the Hugging Face token and connection |
| Very slow image generation | Running on CPU | Use an NVIDIA GPU with CUDA |
| First run takes a long time | Model weights (a few GB) downloading | Wait; later runs are faster |
| Out-of-memory error | Not enough GPU/RAM | Close other apps or use a machine with more memory |
| `ModuleNotFoundError` | Dependencies not installed or virtual environment not active | Activate `env` and run `pip install -r requirements.txt` |
| PDF not found | Wrong folder | Look in `static/exports/` for `comic_<date>_<time>.pdf` |

---

## 9. Frequently Asked Questions

**Do I need drawing skills?** No. The AI writes and illustrates the comic.

**How many panels does a comic have?** Five.

**Can I use it without a GPU?** Yes, but image generation will be much slower.

**Where are my files saved?** Images in `static/panels/`, PDFs in `static/exports/`.

**Can other programs use it?** Yes, through `POST /generate-comic/json`.

**Can I save comics to an account?** Not in Version 1. It is a planned enhancement.

---

## 10. Maintenance Notes

| Task | Frequency / trigger |
| --- | --- |
| Check that Gemini model IDs are still available | Regularly, and whenever a "not found" error appears |
| Update dependencies | Periodically |
| Keep `.gitignore` covering `.env`, `env/`, `__pycache__/`, generated panels and exports | Always |
| Update README and phase documents | With every functional change |
| Clear old files in `static/panels/` and `static/exports/` | As disk space requires |

---

## 11. Future Enhancements (documented roadmap)

- User accounts and saved comic libraries
- Edit individual panels before final export
- More character and art-style controls
- Multiple characters and recurring character designs
- Voice narration and sound effects
- Multiple page sizes and print-ready export
- Sharing options for generated comics

---

## 12. Licence and Credits

- Licensed under the **MIT License** (add a `LICENSE` file if sharing publicly).
- Built with FastAPI, Google Gemini API, Hugging Face Diffusers, Stable Diffusion and FPDF.

---

## 13. Documentation Checklist

| Item | Done |
| --- | --- |
| README up to date | [ ] |
| Project documentation (.docx) reviewed | [ ] |
| Phase documents 01 to 08 reviewed | [ ] |
| Placeholders (names, dates) filled in | [ ] |
| Image model wording (Stable Diffusion vs Gemini Image) consistent everywhere | [ ] |
| `LICENSE` file added | [ ] |
| Screenshots added to demo and user guide | [ ] |

---

## 14. Outcome of the Phase

- Complete documentation set: user guide, installation guide, API reference, troubleshooting, FAQ and maintenance notes.

**Next phase:** Project Demonstration.
