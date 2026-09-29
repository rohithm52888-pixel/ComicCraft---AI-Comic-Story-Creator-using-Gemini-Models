# ComicCraft – AI Comic Story Creator
## Phase 3: Project Design

| Field | Details |
| --- | --- |
| Project | ComicCraft – AI Comic Story Creator using Gemini Models |
| Phase | 3 of 8 – Project Design |
| Team / Author | [Team name / member names] |
| Date | [DD-MM-YYYY] |
| Version | 1.0 |

---

## 1. Purpose of This Phase

To turn the requirements into a technical design: architecture, modules, data flow, interfaces, user interface and error handling.

---

## 2. Design Overview

ComicCraft is a **pipeline-style web application**. A FastAPI backend receives the user's input and passes it through five stages, each in its own module. Jinja2 templates render the pages.

### 2.1 High-level pipeline

```
User input (prompt, character, setting, tone, art style)
        │
        ▼
┌──────────────────────┐
│  Gemini Flash         │  →  5-panel structured outline
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│  Gemini Pro           │  →  Narration + character dialogue
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│  Stable Diffusion     │  →  Comic-style image for each panel
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│  Layout Builder       │  →  Matches images with panel text
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│  PDF Exporter (FPDF)  │  →  Downloadable multi-page comic
└──────────────────────┘
```

### 2.2 Architecture layers

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Presentation | HTML, CSS, Jinja2 templates | Input form, comic preview, export confirmation |
| Application | FastAPI, Uvicorn | Routing, validation, orchestration, error handling |
| AI services | Google Gemini (Flash, Pro), Stable Diffusion via Diffusers and PyTorch | Text and image generation |
| Output | FPDF, Pillow | Image handling and PDF creation |
| Storage | Local file system | Panel images and PDFs |
| Configuration | python-dotenv, `.env` | API keys |

---

## 3. Module Design

| Module (file) | Function | Input | Output |
| --- | --- | --- | --- |
| `app/main.py` | App entry point; mounts static files and templates, registers routes | – | FastAPI app |
| `app/routes.py` | All route handlers, input handling, error handling | HTTP requests | HTML pages / JSON |
| `app/gemini_flash.py` | `generate_outline()` | prompt, character, setting, tone, art style | Five panels, each with title, scene description, image prompt |
| `app/gemini_pro.py` | `generate_story()` | Outline + user options | Narration and dialogue per panel |
| `app/image_generator.py` | `generate_image()` | Panel image prompt | Image file saved in `static/panels/` |
| `app/layout_builder.py` | `build_comic_layout()` | Images + panel text | Ordered list of panels (`panel`, `image`, `text`) |
| `app/exporters.py` | `save_pdf()` | Comic layout | Timestamped PDF in `static/exports/` |

### Design principles

- **Single responsibility:** one stage per file.
- **Loose coupling:** each stage takes plain data in and gives plain data out, so a model can be swapped without touching the others.
- **Config outside code:** keys come from `.env`; model IDs sit in one place per module.

---

## 4. Data Flow

### 4.1 Web form flow

1. Browser sends form data to `POST /generate`.
2. `routes.py` validates the input.
3. `generate_outline()` returns the five-panel outline.
4. `generate_story()` adds narration and dialogue.
5. `generate_image()` runs once per panel.
6. `build_comic_layout()` combines images and text.
7. `comic_preview.html` renders the panels.
8. On **Download PDF**, `save_pdf()` writes the PDF and the user lands on `export_success.html`.

### 4.2 JSON API flow

Same pipeline, triggered by `POST /generate-comic/json`. The response is the layout plus the PDF path, with no HTML rendering.

### 4.3 Sequence (text form)

```
User → Browser → FastAPI (/generate)
FastAPI → Gemini Flash : outline request
Gemini Flash → FastAPI : 5-panel outline
FastAPI → Gemini Pro   : story request (outline + options)
Gemini Pro → FastAPI   : narration + dialogue
loop for each panel
    FastAPI → Stable Diffusion : image prompt
    Stable Diffusion → FastAPI : panel image
end
FastAPI → Layout Builder → comic layout
FastAPI → Browser : comic_preview.html
User → Browser → FastAPI (Download PDF) → FPDF → PDF file
```

---

## 5. Data Design

There is no database in Version 1. Data is passed in memory and saved as files.

### 5.1 Input model

| Field | Type | Example |
| --- | --- | --- |
| `prompt` | string | "A brave fox exploring an enchanted forest" |
| `character_name` | string | "Rusty" |
| `setting` | string | "forest" |
| `tone` | string | "dramatic" |
| `art_style` | string | "anime" |

### 5.2 Outline panel (from Gemini Flash)

| Field | Description |
| --- | --- |
| title | Short panel title |
| scene description | What happens in the panel |
| image prompt | Text used to draw the panel |

### 5.3 Layout item (returned by the JSON API)

```json
{
  "layout": [
    {
      "panel": 1,
      "image": "static/panels/a_brave_fox_entering_the_forest.png",
      "text": "Narration and dialogue for panel 1..."
    }
  ],
  "pdf_path": "static/exports/comic_20260928_101500.pdf"
}
```

### 5.4 File storage

| Folder | Content | Naming |
| --- | --- | --- |
| `static/panels/` | Generated panel images (PNG) | Derived from the panel's image prompt |
| `static/exports/` | Exported PDFs | `comic_<YYYYMMDD>_<HHMMSS>.pdf` |

---

## 6. API Design

| Method | Route | Purpose | Response |
| --- | --- | --- | --- |
| GET | `/` | Homepage form | `index.html` |
| POST | `/generate` | Run full pipeline from form data | `comic_preview.html` |
| POST | `/generate-comic/json` | Run pipeline from JSON | JSON: `layout` and `pdf_path` |
| GET | `/export-success` | Export confirmation | `export_success.html` |
| POST | `/test-image` | Developer tool: one image from a prompt | Generated image |
| GET | `/docs` | Swagger UI (auto-generated) | Interactive API docs |

---

## 7. User Interface Design

### 7.1 Pages

| Page | Purpose | Main elements |
| --- | --- | --- |
| `index.html` | Input form | Story prompt, main character, setting, tone and art style controls, **Create my comic** button |
| `comic_preview.html` | Result | Panels shown one after another: title, image, description, narration; **Download PDF** button |
| `export_success.html` | Confirmation | Message that the PDF was created |

### 7.2 User flow

```
Home form → Fill options → Create my comic → (generation) → Comic preview
        → Change tone/style and regenerate (optional)
        → Download PDF → Export success page
```

### 7.3 UI guidelines

- Keep the form short and clear; use selection controls for setting, tone and art style.
- Show panels in order (1 to 5).
- Show a readable message if generation fails.
- Keep styling in the CSS so pages look consistent.

---

## 8. Error-Handling Design

| Situation | Handling |
| --- | --- |
| Missing or invalid form input | Reject with a clear message |
| Gemini key missing or invalid | Catch the exception; return a readable error |
| Gemini model ID retired ("not found") | Catch and report; update the model ID in `gemini_flash.py` / `gemini_pro.py` |
| Stable Diffusion load or run failure | Catch and report; suggest checking the Hugging Face token, disk space and GPU/CPU |
| File write failure | Catch and report |

Implementation approach: `HTTPException` and try/except in `routes.py`.

---

## 9. Security Design

- API keys live in `.env` and are loaded with `python-dotenv`.
- `.env`, `env/`, `__pycache__/`, `static/panels/` and `static/exports/` are listed in `.gitignore`.
- No keys are written in source code.
- User input is only passed to the AI services and used to build file names, so file names should be cleaned before saving.

---

## 10. Project Structure

```
ComicCraft/
├── app/
│   ├── main.py
│   ├── routes.py
│   ├── gemini_flash.py
│   ├── gemini_pro.py
│   ├── image_generator.py
│   ├── layout_builder.py
│   └── exporters.py
├── templates/
│   ├── index.html
│   ├── comic_preview.html
│   └── export_success.html
├── static/
│   ├── panels/
│   └── exports/
├── .env
├── requirements.txt
└── README.md
```

---

## 11. Design Decisions Summary

| Decision | Reason |
| --- | --- |
| FastAPI | Fast, supports pages and JSON, automatic Swagger docs |
| Two Gemini models | Flash for quick structure, Pro for richer writing |
| Stable Diffusion via Diffusers | Open model, local generation, style control through prompts |
| FPDF | Simple multi-page PDF creation |
| No database (V1) | Keeps the first version simple; saved libraries are a future enhancement |

> **Note:** The project documentation lists "Gemini Image" for artwork, while the README uses Stable Diffusion. This design follows the README. Update Sections 2 and 3 if your final build differs.

---

## 12. Outcome of the Phase

- Architecture, modules, data flow, API, UI and error handling designed.

**Next phase:** Project Planning.
