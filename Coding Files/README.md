# ComicCraft – AI Comic Story Creator using Gemini Models

ComicCraft is a web app that uses AI to turn a short story idea into a full comic, with illustrations to match. You enter a story prompt, a main character, a setting, a tone and an art style. ComicCraft then writes a panel-by-panel storyline with narration and dialogue, draws an illustration for each panel, and exports the finished comic as a PDF.

It's built with **FastAPI**, **Google Gemini** (Flash and Pro) and **Stable Diffusion** through Hugging Face Diffusers.

---

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [AI Models](#ai-models)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Usage Scenarios](#usage-scenarios)
- [Project Milestones](#project-milestones)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Personalized comics**: you choose the story prompt, character name, setting, tone and art style.
- **Structured outline**: Gemini Flash writes a 5-panel outline. Each panel has a title, a scene description and an image prompt.
- **Narration and dialogue**: Gemini Pro expands the outline into narration and character dialogue.
- **Panel illustrations**: Stable Diffusion draws one image per panel.
- **Style changes**: pick a different tone (e.g. *funny*, *dramatic*) or art style (e.g. *anime*, *comic book*) and generate again.
- **In-browser preview**: panels appear one after another, each with its title, image, description and narration.
- **PDF export**: the whole comic downloads as a multi-page PDF with a timestamped filename.
- **REST API**: a JSON endpoint lets other programs generate comics. Interactive Swagger docs are served at `/docs`.

---

## How It Works

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

---

## Tech Stack

| Layer          | Technology                                   |
| -------------- | -------------------------------------------- |
| Backend        | FastAPI, Uvicorn (ASGI server)               |
| Frontend       | HTML, CSS, Jinja2 templates                  |
| Text AI        | Google Gemini (`google-generativeai`)        |
| Image AI       | Hugging Face Diffusers, Stable Diffusion, PyTorch |
| PDF Export     | FPDF                                         |
| Image Handling | Pillow                                       |
| Config         | python-dotenv                                |

---

## AI Models

| Model | ID | Purpose |
| ----- | -- | ------- |
| **Gemini Flash** | `models/gemini-1.5-flash` | Writes the structured panel-by-panel outline quickly |
| **Gemini Pro** | `models/gemini-1.5-pro` | Writes the narration and character dialogue |
| **Stable Diffusion** | `runwayml/stable-diffusion-v1-5` | Draws the comic-style illustration for each panel |

> **Note:** Google retires older Gemini model IDs over time. If a `1.5` model returns a "not found" error, change the model ID in `gemini_flash.py` / `gemini_pro.py` to a model that's still available (see the [Gemini models list](https://ai.google.dev/gemini-api/docs/models)).

---

## Project Structure

```
ComicCraft/
├── app/
│   ├── main.py               # FastAPI app entry point
│   ├── routes.py             # All route handlers
│   ├── gemini_flash.py       # generate_outline()  – Gemini Flash
│   ├── gemini_pro.py         # generate_story()    – Gemini Pro
│   ├── image_generator.py    # generate_image()    – Stable Diffusion
│   ├── layout_builder.py     # build_comic_layout()
│   └── exporters.py          # save_pdf()          – FPDF
├── templates/
│   ├── index.html            # Input form
│   ├── comic_preview.html    # Panel-by-panel comic preview
│   └── export_success.html   # PDF export confirmation
├── static/
│   ├── panels/               # Generated panel images
│   └── exports/              # Generated PDF files
├── .env                      # API keys (not committed)
├── requirements.txt
└── README.md
```

---

## Prerequisites

- **Python 3.9+** and `pip`
- A **Google Gemini API key**: [Get one from Google AI Studio](https://aistudio.google.com/app/apikey)
- A **Hugging Face access token**: [Create one here](https://huggingface.co/settings/tokens)
- *(Recommended)* An NVIDIA GPU with CUDA. Stable Diffusion also runs on a CPU, but much more slowly.
- Git

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/ComicCraft.git
   cd ComicCraft
   ```

2. **Create and activate a virtual environment**

   ```bash
   python -m venv env

   # Windows
   env\Scripts\activate

   # macOS / Linux
   source env/bin/activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

   If you don't have a `requirements.txt` yet, install the packages directly:

   ```bash
   pip install fastapi uvicorn jinja2 python-multipart google-generativeai diffusers transformers fpdf Pillow accelerate torch python-dotenv
   ```

---

## Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
HF_API_KEY=your_huggingface_api_key_here
```

The app loads these values at startup with `python-dotenv`.

> **Security:** Never commit your `.env` file or paste API keys into source code. Add `.env` to your `.gitignore`:
>
> ```gitignore
> .env
> env/
> __pycache__/
> static/panels/
> static/exports/
> ```

---

## Running the App

From the project root, start the FastAPI development server:

```bash
uvicorn app.main:app --reload
```

Then open:

- **App:** http://127.0.0.1:8000
- **API Docs (Swagger UI):** http://127.0.0.1:8000/docs

> The first run downloads the Stable Diffusion weights (a few GB), so it can take a while.

---

## API Endpoints

| Method | Route                  | Description |
| ------ | ---------------------- | ----------- |
| `GET`  | `/`                    | Shows the homepage form (`index.html`) |
| `POST` | `/generate`            | Takes the form data, runs the full AI pipeline and shows `comic_preview.html` |
| `POST` | `/generate-comic/json` | Takes a JSON payload and returns the comic layout plus the PDF path |
| `GET`  | `/export-success`      | Shows the export confirmation page |
| `POST` | `/test-image`          | Developer tool: generates one image from a prompt |

### Example: JSON comic generation

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

**Response (example)**

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

### Input options

| Field          | Examples                                            |
| -------------- | --------------------------------------------------- |
| Story Prompt   | "A brave fox exploring an enchanted forest"         |
| Character Name | Rusty, Luna, Max                                    |
| Setting        | school, forest, space, city                         |
| Tone           | light-hearted, dramatic, poetic, funny              |
| Art Style      | anime, pixel art, comic book, realistic             |

---

## Usage Scenarios

**1. Personalized comic**
The user enters *"A brave fox exploring an enchanted forest"* and picks a character name, the *forest* setting, a *dramatic* tone and the *anime* style. ComicCraft produces a multi-panel comic with images and story text.

**2. Change the style**
For something lighter, the user switches to the *funny* tone and the *comic book* style. The whole pipeline (outline, story and images) runs again with the new settings.

**3. Download as PDF**
Once the user is happy with the preview, they click **Download PDF**. `layout_builder.py` puts each panel together and `exporters.py` builds a timestamped PDF with FPDF. The user then lands on the export success page.

---

## Project Milestones

1. **Model selection and architecture**: choose the AI models, design the architecture and set up the environment.
2. **Core features**: outline, story, image, layout and PDF generation.
3. **`routes.py`**: FastAPI routes, input handling and error handling (`HTTPException`, try/except).
4. **Frontend**: HTML/CSS pages rendered with Jinja2 templates.
5. **Deployment**: run and test the app locally with Uvicorn.

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License. Add a `LICENSE` file to the repository if you plan to share it publicly.

---

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [Google Gemini API](https://ai.google.dev/)
- [Hugging Face Diffusers](https://huggingface.co/docs/diffusers)
- [Stable Diffusion](https://huggingface.co/runwayml/stable-diffusion-v1-5)
- [FPDF](https://pyfpdf.github.io/fpdf2/)
