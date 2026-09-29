# ComicCraft – AI Comic Story Creator
## Phase 1: Brainstorming & Ideation

| Field | Details |
| --- | --- |
| Project | ComicCraft – AI Comic Story Creator using Gemini Models |
| Phase | 1 of 8 – Brainstorming & Ideation |
| Team / Author | [Team name / member names] |
| Date | [DD-MM-YYYY] |
| Version | 1.0 |

---

## 1. Purpose of This Phase

To identify the problem, shape the idea, choose the right AI approach and agree on what the first version of ComicCraft will and will not do.

---

## 2. Problem Statement

Making a comic normally needs two separate skills, **writing** (plot, narration, dialogue) and **drawing** (illustrating every panel), and both take a lot of time. Many people have a story idea but little drawing or writing experience, so the idea never becomes a finished comic.

**Problem in one line:** *There is no simple way for a non-artist to turn a one-line story idea into a complete, illustrated, shareable comic.*

---

## 3. Proposed Idea

**ComicCraft** is a web app that turns a short story idea into a fully illustrated five-panel comic. The user gives:

- a story prompt (one line)
- a main character
- a setting
- a tone
- an art style

ComicCraft then:

1. writes a structured five-panel outline,
2. expands it into narration and character dialogue,
3. draws an illustration for each panel,
4. shows the comic panel by panel in the browser, and
5. exports it as a downloadable PDF.

**Vision:** Combine story writing and illustration in one workflow, so comic creation is open to anyone.

---

## 4. Objectives

| # | Objective |
| --- | --- |
| O1 | Convert a user's short idea into a structured comic story. |
| O2 | Generate a five-panel comic outline automatically. |
| O3 | Create narration and character dialogue using generative AI. |
| O4 | Generate artwork for each comic panel. |
| O5 | Let users control setting, tone and art style. |
| O6 | Let users download the finished comic as a PDF. |

---

## 5. Target Users

| User group | Need |
| --- | --- |
| Hobbyists and story lovers | Turn ideas into visuals without drawing skills |
| Students | Create illustrated stories for assignments and projects |
| Educators | Produce quick illustrated stories for teaching material |
| Content creators | Prototype comic concepts quickly |
| Developers | Use the JSON API to generate comics from other programs |

---

## 6. Value Proposition

- **Saves effort:** writing and illustration happen in one flow.
- **Accessible:** no drawing or writing experience needed.
- **Flexible:** several tones, settings and art styles to choose from.
- **Portable output:** the result is a PDF that can be shared or printed.
- **Programmable:** a REST API lets other tools generate comics.

---

## 7. Idea Generation – Approach Options and the Choice Made

### 7.1 How to generate the text

| Option | Description | Decision |
| --- | --- | --- |
| A | One AI call writes outline, narration and dialogue together | Not chosen – less control over structure |
| **B** | **Two stages: a fast model writes the outline, a stronger model writes narration and dialogue** | **Chosen** |

**Rationale:** Splitting the work gives a predictable five-panel structure first (Gemini Flash, fast), then richer writing on top of it (Gemini Pro).

### 7.2 How to produce the images

| Option | Description | Decision |
| --- | --- | --- |
| A | Stock or pre-drawn images | Not chosen – cannot match a custom story |
| **B** | **AI image generation, one image per panel from an image prompt in the outline** | **Chosen** |

The README implementation uses **Stable Diffusion (`runwayml/stable-diffusion-v1-5`)** through Hugging Face Diffusers. The project documentation names a Gemini image model for artwork. See the note in Section 10.

### 7.3 How users interact

| Option | Description | Decision |
| --- | --- | --- |
| A | Command-line tool | Not chosen – not friendly for non-developers |
| **B** | **Web app with a simple form and in-browser preview** | **Chosen** |
| **C** | **REST API alongside the web app** | **Chosen (bonus)** |

**Rationale:** FastAPI supports both the web pages and the JSON API, and generates Swagger docs automatically.

---

## 8. Feature Ideas and Prioritisation (MoSCoW)

### Must have (Version 1)

- Story prompt, main character, setting, tone and art style inputs
- Five-panel outline generation
- Narration and dialogue generation
- One illustration per panel
- In-browser comic preview
- PDF export with timestamped filename

### Should have

- JSON API endpoint (`/generate-comic/json`)
- Swagger docs (`/docs`)
- Style re-generation (change tone or art style and run again)
- Clear error handling for AI or key failures

### Could have (future enhancements)

- User accounts and saved comic libraries
- Edit individual panels before export
- More character and art-style controls
- Multiple characters and recurring character designs
- Voice narration and sound effects
- Multiple page sizes and print-ready export
- Sharing options for generated comics

### Won't have (in Version 1)

- User accounts, panel editing, audio, social sharing

---

## 9. AI Model Selection

| Model | ID | Why it was chosen |
| --- | --- | --- |
| Gemini Flash | `models/gemini-1.5-flash` | Fast, suited to writing a structured outline |
| Gemini Pro | `models/gemini-1.5-pro` | Stronger writing for narration and dialogue |
| Stable Diffusion | `runwayml/stable-diffusion-v1-5` | Open model for comic-style panel images, runs locally on GPU or CPU |

---

## 10. Key Decision Note – Image Model

The two source documents describe the image step slightly differently:

- **README:** Stable Diffusion via Hugging Face Diffusers.
- **Project documentation:** "Gemini Image" for panel artwork.

This document set follows the **README** because it describes the actual code structure (`image_generator.py`, Diffusers, PyTorch). **Confirm the final choice with your team and edit these files if the deployed version uses a Gemini image model.**

---

## 11. SWOT Analysis

| Strengths | Weaknesses |
| --- | --- |
| End-to-end pipeline in one app | Image generation is slow on CPU |
| Configurable tone, setting and style | Stable Diffusion weights are a multi-GB download |
| PDF output and REST API | Character look may vary between panels |

| Opportunities | Threats |
| --- | --- |
| Saved libraries, sharing, print-ready output | Retirement of older Gemini model IDs |
| Recurring characters and voice narration | API rate limits and costs |
| Education and content-creation use | Inconsistent AI output quality |

---

## 12. Risks Identified Early

| Risk | Impact | Mitigation idea |
| --- | --- | --- |
| Gemini model IDs get retired | Story generation fails with "not found" | Keep model IDs easy to change in `gemini_flash.py` / `gemini_pro.py` |
| No GPU available | Very slow image generation | Support CPU fallback and recommend a CUDA GPU |
| API keys leaked | Security issue | Keep keys in `.env`, add `.env` to `.gitignore` |
| Inconsistent AI output | Poor comic quality | Use structured outline prompts, allow re-generation |

---

## 13. Outcome of the Phase

- Problem statement and vision agreed.
- Five-panel comic pipeline chosen: **Outline → Story → Images → Layout → PDF**.
- Technology direction set: FastAPI, Gemini (Flash and Pro), Stable Diffusion, FPDF.
- Version 1 scope defined; future enhancements parked.

**Next phase:** Requirement Analysis.
