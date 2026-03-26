# Visual Website Builder

## Current State
A full-stack visual website builder with:
- Dashboard: project list, create/delete projects via dialogs
- Editor: drag-and-drop canvas, component palette, properties panel, page management
- Backend: projects, pages, elements stored via Motoko actor
- Create project flow: simple dialog with name input, opens blank editor

## Requested Changes (Diff)

### Add
- A templates gallery step inside the "Create New Project" dialog (multi-step: step 1 = name, step 2 = choose template or blank)
- A set of built-in templates (Blank, Landing Page, Portfolio, Blog Post, About Me, Product Page)
- Each template defines a list of pre-configured elements (type + propsJson) that get bulk-created after the project/page is initialized
- A TemplateGallery component showing template cards with preview thumbnails (icon + label + short description)
- After selecting a template and confirming, create project → create page → bulk add template elements → navigate to editor

### Modify
- Dashboard handleCreate flow: after project creation, apply selected template elements before navigating to editor
- Create Project Dialog: become two-step (name → template picker)

### Remove
- Nothing removed

## Implementation Plan
1. Create src/frontend/src/data/templates.ts with template definitions (id, name, description, icon, elements array)
2. Create src/frontend/src/components/TemplateGallery.tsx grid of template cards
3. Update Dashboard.tsx: two-step dialog (step 1 name, step 2 template select), apply template elements after project+page creation using actor calls
