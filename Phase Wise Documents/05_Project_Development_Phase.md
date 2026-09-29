# ComicCraft – AI Comic Story Creator
## Phase 5: Project Development

| Field | Details |
| --- | --- |
| Project | ComicCraft – AI Comic Story Creator using Gemini Models |
| Phase | 5 of 8 – Project Development |
| Team / Author | [Team name / member names] |
| Date | [DD-MM-YYYY] |
| Version | 1.0 |

---

## 1. Purpose of This Phase

To record how ComicCraft was built: environment setup, module implementation, routes, frontend, configuration and how to run it.

---

## 2. Development Environment

| Item | Details |
| --- | --- |
| Language | Python 3.9+ |
| Framework | FastAPI, served by Uvicorn |
| Templates | Jinja2, HTML, CSS |
| AI libraries | `google-generativeai`, `diffusers`, `transformers`, `accelerate`, `torch` |
| Other libraries | `fpdf`, `Pillow`, `python-dotenv`, `python-multipart` |
| Version control | Git and GitHub |
| Hardware | NVIDIA GPU with CUDA recommended; CPU supported |

### 2.1 Setup steps

```bash
# 1. Clone
git clone https://github.com/<your-username>/ComicCraft.git
cd ComicCraft

# 2. Virtual environment
python -m venv env
env\Scripts\activate          # Windows
source env/bin/activate       # macOS / Linux

# 3. Dependencies
pip install -r requirements.txt
# or, without a requirements.txt:
pip install fastapi uvicorn jinja2 python-multipart google-generativeai diffusers transformers fpdf Pillow accelerate torch python-dotenv
```

### 2.2 Configuration

Create `.env` in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
HF_API_KEY=your_huggingface_api_key_here
```

`.gitignore` must contain:

```gitignore
.env
env/
__pycache__/
static/panels/
static/exports/
```

---

## 3. Implementation by Milestone

### Milestone 1 – Model selection and architecture

- Selected `models/gemini-1.5-flash`, `models/gemini-1.5-pro` and `runwayml/stable-diffusion-v1-5`.
- Designed the pipeline: Outline → Story → Images → Layout → PDF.
- Set up the virtual environment, dependencies, API key and Hugging Face token.

### Milestone 2 – Core features

| Module | Function | What it does |
| --- | --- | --- |
| `app/gemini_flash.py` | `generate_outline()` | Sends the user's prompt, character, setting, tone and art style to Gemini Flash. Returns a five-panel outline; each panel has a title, scene description and image prompt. |
| `app/gemini_pro.py` | `generate_story()` | Sends the outline and options to Gemini Pro. Returns narration and character dialogue for each panel. |
| `app/image_generator.py` | `generate_image()` | Loads Stable Diffusion through Diffusers and draws one comic-style image from each panel's image prompt. Saves it in `static/panels/`. |
| `app/layout_builder.py` | `build_comic_layout()` | Matches each image with its panel text and returns an ordered layout list. |
| `app/exporters.py` | `save_pdf()` | Builds a multi-page PDF with FPDF, one panel per page, saved with a timestamped filename in `static/exports/`. |

### Milestone 3 – Routes (`app/routes.py`)

| Method | Route | Behaviour |
| --- | --- | --- |
| GET | `/` | Renders `index.html` |
| POST | `/generate` | Reads form data, runs the pipeline, renders `comic_preview.html` |
| POST | `/generate-comic/json` | Accepts JSON, returns `layout` and `pdf_path` |
| GET | `/export-success` | Renders `export_success.html` |
| POST | `/test-image` | Developer tool: generates one image from a prompt |

Error handling uses `HTTPException` and try/except blocks so failures return readable messages.

`app/main.py` creates the FastAPI app, connects the static files and templates, and registers the routes.

### Milestone 4 – Frontend

| Template | Content |
| --- | --- |
| `templates/index.html` | Form: story prompt, main character, setting, tone, art style, **Create my comic** |
| `templates/comic_preview.html` | Panels shown one after another with title, image, description and narration; **Download PDF** |
| `templates/export_success.html` | PDF export confirmation |

### Milestone 5 – Deployment

- Run and test locally with Uvicorn.
- Swagger UI available at `/docs`.

---

## 4. Running the Application

```bash
uvicorn app.main:app --reload
```

| URL | Purpose |
| --- | --- |
| http://127.0.0.1:8000 | Web app |
| http://127.0.0.1:8000/docs | Swagger UI |

> The first run downloads the Stable Diffusion weights (a few GB), so it can take a while.

---

## 5. Using the JSON API

```bash
curl -X POST http://127.0.0.1:8000/generate-comic/json \
  -H "Content-Type: application/json" \
  -d '{
        "prompt": "A brave fox exploring an enchanted forest",
        "character_name": "Rusty",
        "setting": "forest",
        "tone": "dramatic",
        "art_style": "anime"
      }'
```

Example response:

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

---

## 6. Development Notes and Known Issues

| Topic | Note |
| --- | --- |
| Retired Gemini models | Google retires older IDs over time. If a `1.5` model returns "not found", change the model ID in `gemini_flash.py` / `gemini_pro.py` to a currently available one (see the Gemini models list at ai.google.dev). |
| First-run download | Stable Diffusion weights are a few GB. Download them before a demo. |
| CPU speed | Image generation works on CPU but is much slower than on a CUDA GPU. |
| Secrets | Never commit `.env` or paste API keys in code. |
| Generated files | `static/panels/` and `static/exports/` are ignored by Git. |
| Image model wording | The project documentation mentions "Gemini Image"; the README and this document use Stable Diffusion. Keep them consistent. |

---

## 7. Version Control Workflow

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request.

---

## 8. Development Checklist

| Item | Done |
| --- | --- |
| Environment and dependencies installed | [ ] |
| `.env` created, `.gitignore` updated | [ ] |
| `generate_outline()` working | [ ] |
| `generate_story()` working | [ ] |
| `generate_image()` working | [ ] |
| `build_comic_layout()` working | [ ] |
| `save_pdf()` working | [ ] |
| All routes working | [ ] |
| Templates and CSS complete | [ ] |
| App runs with Uvicorn | [ ] |

---

## 9. Outcome of the Phase

- Complete pipeline implemented: outline, story, images, layout, PDF.
- Web pages and JSON API available and runnable locally.

**Next phase:** Project Testing.
