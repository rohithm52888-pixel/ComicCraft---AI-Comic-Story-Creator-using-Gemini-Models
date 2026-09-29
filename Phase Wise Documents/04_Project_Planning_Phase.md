# ComicCraft – AI Comic Story Creator
## Phase 4: Project Planning

| Field | Details |
| --- | --- |
| Project | ComicCraft – AI Comic Story Creator using Gemini Models |
| Phase | 4 of 8 – Project Planning |
| Team / Author | [Team name / member names] |
| Date | [DD-MM-YYYY] |
| Version | 1.0 |

---

## 1. Purpose of This Phase

To plan how ComicCraft will be built: milestones, tasks, schedule, roles, resources, risks and quality checks.

---

## 2. Project Milestones

| # | Milestone | Deliverables |
| --- | --- | --- |
| M1 | Model selection and architecture | Chosen AI models, architecture design, environment set up |
| M2 | Core features | Outline, story, image, layout and PDF generation modules |
| M3 | `routes.py` | FastAPI routes, input handling, error handling (`HTTPException`, try/except) |
| M4 | Frontend | HTML/CSS pages rendered with Jinja2 templates |
| M5 | Deployment | App run and tested locally with Uvicorn |

Documentation and demonstration run alongside M3 to M5 and finish the project (Phases 7 and 8).

---

## 3. Work Breakdown Structure

### M1 – Model selection and architecture

| Task ID | Task |
| --- | --- |
| T1.1 | Finalise problem statement and scope |
| T1.2 | Select Gemini Flash, Gemini Pro and Stable Diffusion |
| T1.3 | Design pipeline and module structure |
| T1.4 | Get Gemini API key and Hugging Face token |
| T1.5 | Create project folder, virtual environment and `.gitignore` |
| T1.6 | Install dependencies |

### M2 – Core features

| Task ID | Task |
| --- | --- |
| T2.1 | Build `generate_outline()` in `gemini_flash.py` |
| T2.2 | Build `generate_story()` in `gemini_pro.py` |
| T2.3 | Build `generate_image()` in `image_generator.py` |
| T2.4 | Build `build_comic_layout()` in `layout_builder.py` |
| T2.5 | Build `save_pdf()` in `exporters.py` |
| T2.6 | Test each module on its own |

### M3 – Routes

| Task ID | Task |
| --- | --- |
| T3.1 | Set up `main.py` (app, static files, templates) |
| T3.2 | Create `GET /` and `POST /generate` |
| T3.3 | Create `POST /generate-comic/json` |
| T3.4 | Create `GET /export-success` and `POST /test-image` |
| T3.5 | Add input validation and error handling |

### M4 – Frontend

| Task ID | Task |
| --- | --- |
| T4.1 | Design and build `index.html` (form) |
| T4.2 | Build `comic_preview.html` (panel preview, Download PDF) |
| T4.3 | Build `export_success.html` |
| T4.4 | Add CSS styling |

### M5 – Deployment and testing

| Task ID | Task |
| --- | --- |
| T5.1 | Run with `uvicorn app.main:app --reload` |
| T5.2 | Execute test cases (Phase 6) and fix defects |
| T5.3 | Check `/docs` (Swagger) |
| T5.4 | Final end-to-end run |

### Closing tasks

| Task ID | Task |
| --- | --- |
| T6.1 | Finish README and project documentation |
| T6.2 | Prepare demo script and sample inputs |
| T6.3 | Rehearse and present the demo |

---

## 4. Schedule

Dates are placeholders. Replace them with your real calendar.

| Milestone | Start | End | Duration | Status |
| --- | --- | --- | --- | --- |
| M1 Model selection and architecture | [DD-MM] | [DD-MM] | [x days] | [ ] |
| M2 Core features | [DD-MM] | [DD-MM] | [x days] | [ ] |
| M3 Routes | [DD-MM] | [DD-MM] | [x days] | [ ] |
| M4 Frontend | [DD-MM] | [DD-MM] | [x days] | [ ] |
| M5 Deployment and testing | [DD-MM] | [DD-MM] | [x days] | [ ] |
| Documentation | [DD-MM] | [DD-MM] | [x days] | [ ] |
| Demonstration | [DD-MM] | [DD-MM] | [x days] | [ ] |

### Simple timeline

```
M1 ████
M2     ████████
M3             ████
M4                 ████
M5                     ████
Docs                   ██████
Demo                         ██
```

---

## 5. Roles and Responsibilities

Fill in names. Roles can be shared in a small team.

| Role | Responsibility | Assigned to |
| --- | --- | --- |
| Project lead | Scope, schedule, integration | [Name] |
| AI / backend developer | Gemini modules, Stable Diffusion, layout, PDF | [Name] |
| API developer | FastAPI routes, validation, error handling | [Name] |
| Frontend developer | Templates, HTML/CSS | [Name] |
| Tester | Test cases, defect log | [Name] |
| Documentation and demo | README, phase documents, demo script | [Name] |

---

## 6. Resource Plan

| Resource | Details |
| --- | --- |
| Language and framework | Python 3.9+, FastAPI, Uvicorn, Jinja2 |
| AI services | Google Gemini API (Flash, Pro), Stable Diffusion (`runwayml/stable-diffusion-v1-5`) |
| Libraries | google-generativeai, diffusers, transformers, accelerate, torch, fpdf, Pillow, python-dotenv, python-multipart |
| Accounts | Google AI Studio (API key), Hugging Face (token) |
| Hardware | NVIDIA CUDA GPU recommended; CPU works but slowly |
| Tools | Git and GitHub, code editor, browser, Swagger UI, curl or Postman |

---

## 7. Risk Management Plan

| ID | Risk | Likelihood | Impact | Mitigation | Owner |
| --- | --- | --- | --- | --- | --- |
| R1 | Gemini model ID retired ("not found") | Medium | High | Keep IDs easy to change; check Google's model list | [Name] |
| R2 | No GPU, slow image generation | Medium | Medium | Use a CUDA machine for the demo; pre-generate a sample comic | [Name] |
| R3 | Large first-time model download | High | Low | Download weights before the demo | [Name] |
| R4 | API key leak | Low | High | Use `.env`, `.gitignore`, never paste keys in code | [Name] |
| R5 | API rate limits or downtime | Medium | High | Retry, keep a backup sample output | [Name] |
| R6 | Inconsistent AI output | Medium | Medium | Structured prompts, allow regeneration | [Name] |
| R7 | Schedule slip | Medium | Medium | Prioritise Must-have features first | [Name] |

---

## 8. Communication and Version Control

- Use Git and GitHub; each feature on its own branch, for example `feature/my-feature`.
- Workflow: fork, create branch, commit, push, open a Pull Request.
- Hold short regular check-ins to review progress and blockers.
- Track tasks with the task IDs in Section 3.

---

## 9. Quality Plan

| Area | Approach |
| --- | --- |
| Code | Modular files, one stage per module, readable names |
| Testing | Module tests, API tests, end-to-end tests (see Phase 6) |
| Review | Pull Request review before merging |
| Security | `.env` for keys, `.gitignore` for secrets and generated files |
| Documentation | README kept in sync with code |

---

## 10. Success Criteria

- A user can go from a one-line idea to a five-panel illustrated comic.
- The comic downloads as a PDF.
- The JSON API returns a layout and PDF path.
- All Must-have requirements (Phase 2) pass their tests.
- Documentation and a working demo are ready.

---

## 11. Outcome of the Phase

- Milestones, tasks, schedule, roles, resources and risks planned.

**Next phase:** Project Development.
