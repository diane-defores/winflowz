# WinFlowz Documentation Index

Quick reference guide to all project documentation organized by category.

## 📋 Planning & Strategy

### Business Documents
- **[Business Information](planning/business/businessinfos.md)** - Legal requirements, company info, target audience
- **[Service Optimization](planning/business/service-optimization.md)** - Notion/Obsidian optimization services

### Product Planning
- **[Roadmap](planning/product/roadmap.md)** - Product development roadmap and future plans

### Case Studies
- **[Automation Case Study](planning/case-studies/case-study-automation.md)** - MetaLab automation workflow
- **[Optimization Case Study](planning/case-studies/case-study-optimization.md)** - Optimization examples
- **[Focus Case Study (FR)](planning/case-studies/etude-cas-focussurlerusse.md)** - French language case study

## 🎨 Design & Branding

Located in `/docs/`:
- **[Branding Specification](../docs/BRANDING_SPECIFICATION.md)** - Complete brand identity guide
- **[Design Specification](../docs/DESIGN_SPECIFICATION.md)** - UI/UX design system
- **[Authentication Analysis](../docs/AUTH_ANALYSIS.md)** - Auth implementation details

## 🛠️ Templates & Tools

### Content Templates
- **[Prompts & Integration Strategy](templates/prompts.md)** - Content integration methodology

### BMAD Templates
Located in `.bmad-core/templates/`:
- PRD templates
- Architecture documentation templates
- Story templates
- Sprint planning templates

## 🤖 AI Agents

All agents are in `.bmad-core/agents/`:
- **analyst.md** - Market research and analysis
- **pm.md** - Product management and requirements
- **architect.md** - System architecture and design
- **ux-expert.md** - User experience and interface design
- **dev.md** - Development and implementation
- **qa.md** - Quality assurance and testing
- **sm.md** - Scrum master and story management

## 📦 Web Bundles

Pre-built agent bundles for web AI platforms in `web-bundles/`:
- Individual agents (analyst, pm, architect, dev, qa, etc.)
- Team bundles (fullstack, minimal, no-ui)
- Expansion packs (if any)

## 📚 Guides

- **[BMAD User Guide](../.bmad-core/user-guide.md)** - Complete BMAD method guide
- **[BMAD README](README.md)** - Quick start and overview
- **[Enhanced Workflow](../.bmad-core/enhanced-ide-development-workflow.md)** - IDE workflow guide

## 🔗 Quick Links

### External Resources
- [WinFlowz Website](https://winflowz.com)
- [GitHub Repository](https://github.com/dianedef/winflowz)
- [BMAD Method Documentation](https://github.com/bmad-code-org/BMAD-METHOD)

### Key Project Files
- **[Main README](../README.md)** - Project overview and setup
- **[Package.json](../package.json)** - Dependencies and scripts
- **[Astro Config](../astro.config.mjs)** - Astro configuration

## 📂 Directory Structure

```
winflowz/
├── .bmad-core/          # BMAD framework
│   ├── agents/          # AI agent definitions
│   ├── templates/       # Document templates
│   ├── workflows/       # Development workflows
│   └── checklists/      # Quality checklists
├── bmad/                # Organized documentation
│   ├── planning/        # Business & product planning
│   ├── tasks/           # Development tasks
│   └── templates/       # Project templates
├── docs/                # Technical specifications
├── src/                 # Source code
├── public/              # Static assets
├── tests/               # Test suites
└── web-bundles/         # AI platform bundles
```

## 🚀 Getting Started

1. **New to the project?** Start with the [Main README](../README.md)
2. **Planning a feature?** Use the [PM Agent](../.bmad-core/agents/pm.md)
3. **Designing architecture?** Use the [Architect Agent](../.bmad-core/agents/architect.md)
4. **Implementing code?** Use the [Developer Agent](../.bmad-core/agents/dev.md)
5. **Testing?** Use the [QA Agent](../.bmad-core/agents/qa.md)

---

*Last Updated: December 2024*
*BMAD Version: 4.44.3*
