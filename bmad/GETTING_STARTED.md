# Getting Started with BMAD Method for WinFlowz

This guide will help you start using the BMAD method for AI-driven development on the WinFlowz project.

## What You'll Learn

1. How to use BMAD agents for different development phases
2. How to organize your work using BMAD principles
3. How to leverage AI assistants with BMAD bundles
4. Best practices for maintaining documentation

## Prerequisites

- Familiarity with the WinFlowz project
- Access to an AI assistant (ChatGPT, Claude, or Gemini recommended)
- Basic understanding of Agile development

## Quick Start (5 minutes)

### 1. Understand the BMAD Phases

BMAD organizes work into two main phases:

**Planning Phase** (Strategy First)
- Define requirements and scope
- Design architecture
- Plan user experience
- Create stories and tasks

**Development Phase** (Implementation)
- Build features
- Write tests
- Deploy changes
- Iterate based on feedback

### 2. Choose Your Starting Point

**New Feature or Project?**
→ Start with the Planning Phase (Step 3)

**Existing Feature to Improve?**
→ Use the Brownfield workflow (Step 4)

**Bug Fix or Small Change?**
→ Use the Developer agent directly (Step 5)

### 3. Planning Phase Workflow

For new features or significant changes:

#### Step 1: Market Analysis (Optional)
Use the **Analyst Agent** to research:
```
Load: .bmad-core/agents/analyst.md
Task: Analyze market for [feature/product]
```

#### Step 2: Define Requirements
Use the **Product Manager Agent**:
```
Load: .bmad-core/agents/pm.md
Task: Create PRD for [feature description]
Context: Include business info from bmad/planning/business/
```

The PM will create:
- Product Requirements Document (PRD)
- Feature specifications
- Acceptance criteria
- Success metrics

#### Step 3: Design Architecture
Use the **Architect Agent**:
```
Load: .bmad-core/agents/architect.md
Task: Design architecture for [feature from PRD]
Context: Review existing docs/DESIGN_SPECIFICATION.md
```

The Architect will provide:
- System design
- Database schema
- API contracts
- Component structure

#### Step 4: Plan User Experience (if UI changes)
Use the **UX Expert Agent**:
```
Load: .bmad-core/agents/ux-expert.md
Task: Design UX for [feature]
Context: Follow docs/BRANDING_SPECIFICATION.md
```

### 4. Brownfield Development (Existing Codebase)

For working with existing code:

#### Step 1: Create Epic or Story
Use the **Scrum Master Agent**:
```
Load: .bmad-core/agents/sm.md
Load: .bmad-core/tasks/brownfield-create-story.md
Task: Create story for [change description]
```

#### Step 2: Implement
Use the **Developer Agent**:
```
Load: .bmad-core/agents/dev.md
Task: Implement story [story-name]
Context: Include architecture docs and story
```

### 5. Development Workflow

#### Implementation
Use the **Developer Agent**:
```
Load: .bmad-core/agents/dev.md
Task: Implement [specific task]
Guidelines:
- Follow existing code patterns
- Write tests alongside code
- Update documentation
```

#### Quality Assurance
Use the **QA Agent**:
```
Load: .bmad-core/agents/qa.md
Task: Review and test [implementation]
```

The QA agent will:
- Create test cases
- Identify edge cases
- Validate against requirements
- Suggest improvements

## Using Web Bundles

Web bundles are pre-packaged agent files perfect for uploading to web-based AI platforms.

### For ChatGPT
1. Go to ChatGPT
2. Start a new chat
3. Upload file from `web-bundles/agents/[agent-name].txt`
4. Provide your task and context

### For Claude
1. Open Claude
2. Start a new conversation
3. Attach file from `web-bundles/agents/[agent-name].txt`
4. Describe your task

### For Gemini
1. Access Gemini
2. Create new prompt
3. Include content from `web-bundles/agents/[agent-name].txt`
4. Add your specific request

### Team Bundles
For complex tasks requiring multiple perspectives:

- **team-fullstack.txt** - Complete team (all agents)
- **team-no-ui.txt** - Backend-focused team
- **team-ide-minimal.txt** - Minimal set for quick tasks

## Best Practices

### 1. Document Sharding
Break large documents into focused sections:
- Keep PRD sections under 500 lines
- Separate concerns (features, technical, UX)
- Cross-reference related documents

### 2. Context Preservation
Always provide relevant context:
- Link to related documents
- Include previous decisions
- Reference existing code patterns

### 3. Iterative Development
Work in small iterations:
- Complete one story before starting another
- Get QA review after each implementation
- Update documentation continuously

### 4. Maintain Organization
Keep documentation updated:
- Move completed stories to archive
- Update roadmap regularly
- Keep templates current

## Common Workflows

### Adding a New Page
1. PM: Define page requirements and content
2. UX Expert: Design page layout and flow
3. Architect: Plan component structure
4. Dev: Implement page components
5. QA: Test functionality and responsiveness

### Implementing Authentication Feature
1. PM: Specify auth requirements
2. Architect: Design auth flow and security
3. Dev: Implement auth logic
4. QA: Security testing and edge cases

### Optimizing Performance
1. Analyst: Identify performance bottlenecks
2. Architect: Propose optimization strategy
3. Dev: Implement optimizations
4. QA: Validate performance improvements

### Creating API Endpoint
1. PM: Define API requirements
2. Architect: Design API contract
3. Dev: Implement endpoint and tests
4. QA: API testing and validation

## Troubleshooting

### Agent Doesn't Understand Context
**Solution**: Provide more specific context files
- Include relevant documentation
- Reference specific code sections
- Clarify the current state vs. desired state

### Output Too Generic
**Solution**: Be more specific in your prompts
- Provide concrete examples
- Specify exact requirements
- Include technical constraints

### Conflicts Between Agents
**Solution**: Use the orchestrator
```
Load: .bmad-core/agents/bmad-orchestrator.md
Task: Resolve conflict between [agent1] and [agent2]
```

## Next Steps

1. **Review Existing Planning Docs**
   - Read `bmad/planning/business/businessinfos.md`
   - Check `bmad/planning/product/roadmap.md`
   - Review case studies in `bmad/planning/case-studies/`

2. **Pick Your First Task**
   - Check the roadmap for priorities
   - Choose a small, well-defined task
   - Follow the appropriate workflow above

3. **Try Web Bundles**
   - Upload a team bundle to your AI assistant
   - Test with a simple task
   - Get familiar with the workflow

4. **Explore Advanced Features**
   - Read `.bmad-core/user-guide.md`
   - Check workflows in `.bmad-core/workflows/`
   - Review checklists in `.bmad-core/checklists/`

## Resources

- [BMAD README](README.md) - Overview and structure
- [Documentation Index](INDEX.md) - Complete documentation map
- [User Guide](../.bmad-core/user-guide.md) - Detailed BMAD documentation
- [Workflows](../.bmad-core/workflows/) - Pre-defined workflows
- [Checklists](../.bmad-core/checklists/) - Quality checklists

## Getting Help

- Review the BMAD user guide for detailed explanations
- Check the documentation index for specific documents
- Use the orchestrator agent for complex decisions
- Reference case studies for examples

---

Happy building with BMAD! 🚀
