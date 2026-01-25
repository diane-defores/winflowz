# BMAD Method Implementation for WinFlowz

This directory contains the BMAD (Breakthrough Method for Agile AI-Driven Development) organization for the WinFlowz project.

## What is BMAD?

BMAD is a framework that organizes software development projects for efficient AI-driven workflows. It divides the development lifecycle into clear phases handled by specialized AI agents, ensuring reproducible, scalable, and efficient development.

## Directory Structure

```
bmad/
├── planning/           # Planning Phase Documents
│   ├── business/       # Business information and strategy
│   ├── case-studies/   # Case studies and examples
│   └── product/        # Product roadmap and planning
├── tasks/              # Development tasks and stories
└── templates/          # Reusable templates and prompts
```

## Core BMAD Files

The main BMAD framework is installed in `.bmad-core/` and includes:

- **agents/** - AI agent definitions (Analyst, PM, Architect, Developer, QA, etc.)
- **workflows/** - Predefined workflows for different development scenarios
- **templates/** - Document templates for PRDs, architecture specs, etc.
- **checklists/** - Quality checklists for various phases
- **web-bundles/** - Standalone files for web AI platforms (ChatGPT, Claude, Gemini)

## How to Use BMAD

### 1. Planning Phase

Use planning agents to create foundational documents:

- **Analyst** (`bmad-core/agents/analyst.md`): Market analysis, user personas
- **Product Manager** (`bmad-core/agents/pm.md`): Requirements, feature planning
- **Architect** (`bmad-core/agents/architect.md`): System design, technical specs
- **UX Expert** (`bmad-core/agents/ux-expert.md`): User flows, wireframes

### 2. Development Phase

Use development agents to implement features:

- **Scrum Master** (`bmad-core/agents/sm.md`): Story management, sprint planning
- **Developer** (`bmad-core/agents/dev.md`): Implementation
- **QA** (`bmad-core/agents/qa.md`): Testing and validation

### 3. Web Bundles

Pre-built bundles in `web-bundles/` can be uploaded to:
- ChatGPT (GPT-4)
- Claude (Anthropic)
- Gemini (Google)

These bundles contain complete agent context for AI-assisted development.

## Organized Documentation

### Business Planning (`planning/business/`)
- `businessinfos.md` - Business information, legal requirements, target audience
- `service-optimization.md` - Service offerings and optimization details

### Case Studies (`planning/case-studies/`)
- `case-study-automation.md` - Automation case study examples
- `case-study-optimization.md` - Optimization case study examples
- `etude-cas-focussurlerusse.md` - French case study

### Product Planning (`planning/product/`)
- `roadmap.md` - Product roadmap and development plans

### Templates (`templates/`)
- `prompts.md` - Content integration strategy and templates

## Quick Start

1. **Read the User Guide**: Start with `.bmad-core/user-guide.md`
2. **Choose Your Agent**: Pick an agent from `.bmad-core/agents/` based on your task
3. **Follow the Workflow**: Use workflows in `.bmad-core/workflows/`
4. **Use Web Bundles**: Upload relevant bundles from `web-bundles/` to your AI assistant

## Integration with Existing Docs

Technical documentation remains in `/docs/`:
- `AUTH_ANALYSIS.md` - Authentication implementation details
- `BRANDING_SPECIFICATION.md` - Brand identity and design system
- `DESIGN_SPECIFICATION.md` - UI/UX design specifications

## Next Steps

1. Review the planning documents in `bmad/planning/`
2. Create PRD (Product Requirements Document) using the PM agent
3. Define architecture using the Architect agent
4. Break down work into stories using the Scrum Master agent
5. Implement features using the Developer agent
6. Test and validate using the QA agent

## Resources

- [BMAD Official Documentation](https://github.com/bmad-code-org/BMAD-METHOD)
- [BMAD User Guide](.bmad-core/user-guide.md)
- [Enhanced IDE Development Workflow](.bmad-core/enhanced-ide-development-workflow.md)

## Version

BMAD v4.44.3 (stable)

For the latest features, consider upgrading to BMAD v6 Alpha:
```bash
npx bmad-method@alpha install
```
