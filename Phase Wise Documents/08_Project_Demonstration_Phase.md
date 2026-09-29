# ComicCraft – AI Comic Story Creator
## Phase 8: Project Demonstration

| Field | Details |
| --- | --- |
| Project | ComicCraft – AI Comic Story Creator using Gemini Models |
| Phase | 8 of 8 – Project Demonstration |
| Team / Author | [Team name / member names] |
| Date | [DD-MM-YYYY] |
| Version | 1.0 |

---

## 1. Purpose of This Phase

To present ComicCraft clearly and confidently: what it does, how it works, a live walkthrough and the way forward.

---

## 2. Demo Overview

| Item | Details |
| --- | --- |
| Demo title | ComicCraft: from one idea to a finished comic |
| Suggested length | 8 to 10 minutes plus questions |
| Format | Slides (short) plus live app demo |
| Live app | http://127.0.0.1:8000 (local) |
| Project website | https://comiccraft-readme-creation.vercel.app/ |
| API docs | http://127.0.0.1:8000/docs |

---

## 3. Pre-Demo Checklist

| Item | Done |
| --- | --- |
| Python environment activated and dependencies installed | [ ] |
| `.env` contains valid `GEMINI_API_KEY` and `HF_API_KEY` | [ ] |
| Stable Diffusion weights already downloaded (no first-run wait) | [ ] |
| Gemini model IDs still work (test one generation beforehand) | [ ] |
| App starts: `uvicorn app.main:app --reload` | [ ] |
| Stable internet connection | [ ] |
| A finished sample comic and PDF ready as a backup | [ ] |
| Screenshots or a short screen recording as a backup | [ ] |
| GPU machine used if possible (CPU is slow for live generation) | [ ] |
| Notifications off, browser zoom set for the audience | [ ] |

---

## 4. Demo Script

### Part 1 – Introduction (1 minute)

> "Making a comic normally needs both writing and drawing skills. ComicCraft lets anyone turn a one-line idea into a fully illustrated five-panel comic and download it as a PDF."

### Part 2 – How it works (2 minutes)

Show the pipeline:

```
Idea → Gemini Flash (outline) → Gemini Pro (narration + dialogue)
     → Stable Diffusion (panel images) → Layout Builder → PDF Exporter
```

Key points:

- Gemini Flash writes a fast, structured five-panel outline.
- Gemini Pro expands it into narration and character dialogue.
- Stable Diffusion draws one image per panel in the chosen art style.
- The layout builder pairs images and text; FPDF creates the PDF.
- Built with FastAPI, so there is also a JSON API and Swagger docs.

### Part 3 – Live demo (4 minutes)

| Step | Action | What to say |
| --- | --- | --- |
| 1 | Open the home page | "A simple form: prompt, character, setting, tone, art style." |
| 2 | Enter **A brave fox exploring an enchanted forest**, character **Rusty**, setting **forest**, tone **dramatic**, art style **anime** | "These choices steer the whole story and the artwork." |
| 3 | Click **Create my comic** | "Behind the scenes: outline, story, then an image per panel." |
| 4 | Show the preview | "Each panel has a title, image, description and narration." |
| 5 | Go back, change to **funny** tone and **comic book** style, generate again | "Same idea, completely different feel." |
| 6 | Click **Download PDF** and open it | "The finished comic is ready to share or print." |
| 7 | Show `/docs` and the `POST /generate-comic/json` example | "Other programs can generate comics through the API." |

### Part 4 – Wrap-up (1 to 2 minutes)

- Recap: idea in, illustrated comic out.
- Mention advantages and the future roadmap (Section 6).
- Invite questions.

---

## 5. Sample Inputs for the Demo

| Sample | Prompt | Character | Setting | Tone | Art style |
| --- | --- | --- | --- | --- | --- |
| 1 (main) | A brave fox exploring an enchanted forest | Rusty | forest | dramatic | anime |
| 2 (style change) | A brave fox exploring an enchanted forest | Rusty | forest | funny | comic book |
| 3 (README / project doc example) | A brave fox exploring an enchanted forest | Rusty | forest | light-hearted | comic book |
| 4 (optional) | [Your own idea] | [Name] | space | mysterious | watercolor |

---

## 6. Key Talking Points

### Problem and solution

- Comics need writing plus drawing skill and a lot of time.
- ComicCraft combines story writing and illustration in one workflow.

### Advantages

- Reduces the effort of making a comic by hand.
- Combines writing and illustration in one workflow.
- Several creative styles and tones to choose from.
- Accessible to users with limited drawing or writing experience.
- Produces a downloadable final document.

### Technology highlights

- Three AI models working together, each for what it does best.
- FastAPI backend with web pages and a REST API.
- Modular design: one file per pipeline stage.
- Secure key handling with `.env`.

### Future enhancements

- User accounts and saved comic libraries
- Panel editing before export
- More character and art-style controls
- Multiple characters and recurring character designs
- Voice narration and sound effects
- Print-ready export and multiple page sizes
- Sharing options

---

## 7. Suggested Slide Outline

| Slide | Content |
| --- | --- |
| 1 | Title, team, project name |
| 2 | Problem statement |
| 3 | Solution: what ComicCraft does |
| 4 | Features and input options |
| 5 | Architecture / pipeline diagram |
| 6 | AI models and tech stack |
| 7 | Live demo (switch to the app) |
| 8 | Testing summary and results |
| 9 | Advantages and future scope |
| 10 | Thank you / questions |

---

## 8. Anticipated Questions and Answers

| Question | Suggested answer |
| --- | --- |
| Why two Gemini models? | Flash is fast and good for a structured outline; Pro writes richer narration and dialogue. |
| Why Stable Diffusion for images? | It is an open model that runs locally, and the art style is controlled through the prompt. |
| Why is image generation slow? | Diffusion models are heavy. A CUDA GPU is recommended; CPU works but is slower. |
| What if a Gemini model stops working? | Google retires old IDs. Change the model ID in `gemini_flash.py` / `gemini_pro.py` to an available one. |
| Are API keys safe? | Keys are stored in `.env`, loaded with `python-dotenv` and excluded from Git. |
| Can the comic be edited? | Not yet. Panel editing is a planned enhancement. |
| Can other apps use it? | Yes, through `POST /generate-comic/json`. |
| Are characters consistent across panels? | Character consistency is a known challenge for image models. Recurring character designs are on the roadmap. |
| How many panels? | Five in Version 1. |
| Where is the PDF saved? | In `static/exports/` with a timestamped filename. |

---

## 9. Contingency Plan

| If this happens | Do this |
| --- | --- |
| Internet or Gemini API is down | Show the pre-generated sample comic and PDF |
| Image generation is too slow | Use the pre-generated sample and explain the pipeline |
| "Model not found" error | Show the fix (change model ID) or switch to the backup recording |
| App will not start | Show screenshots or the recorded demo and the project website |

---

## 10. Demo Evaluation Checklist

| Criterion | Done |
| --- | --- |
| Problem and solution clearly explained | [ ] |
| Architecture and pipeline shown | [ ] |
| Full flow shown: input, preview, PDF | [ ] |
| Style change demonstrated | [ ] |
| API and Swagger shown | [ ] |
| Advantages and future scope covered | [ ] |
| Questions answered | [ ] |

---

## 11. Project Closure

| Item | Status |
| --- | --- |
| All eight phases documented | [ ] |
| Source code pushed to GitHub | [ ] |
| Final demo delivered | [ ] |
| Feedback recorded | [ ] |

### Conclusion

ComicCraft shows how generative AI can automate creative work. By combining AI plot generation, dialogue writing and image generation, it turns a simple idea into a structured, illustrated five-panel comic in one easy-to-use web application.
