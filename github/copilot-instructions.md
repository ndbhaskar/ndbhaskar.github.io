# LLM Instructions for Bhaskar Tax Consultant Website

## Project Purpose

This repository is a static, single-page professional website for Bhaskar Tax Consultant, owned by Bhaskara N D. The site is intended to be hosted on GitHub Pages at:

```text
https://ndbhaskar.github.io/
```

The website should help clients quickly understand the services offered and contact the consultant through phone, WhatsApp or email.

## Business Facts

Use these facts consistently across copy, metadata and UI:

- Brand: Bhaskar Tax Consultant
- Consultant: Bhaskara N D
- Phone / WhatsApp: 8296765186
- Email: ndbhaskar960@gmail.com
- Clients served: 300+
- Experience: 3+ years
- Primary services: Income Tax Filing, GST Registration and Filing, TDS and TCS Filing, Accounting, Balance Sheet Preparation, Tax Audit, Compliance, Business Registrations, MSME, FSSAI, ESI, PF and Professional Tax
- Main audience: individuals, salaried professionals, business owners, freelancers, partnership firms and small businesses

## Developer Credit

Keep the developer credit visible on the page unless the owner explicitly asks to remove it.

- Developer name: Lakshmikanth
- Developer profile: https://l-akshmikanth.github.io/l-akshmikanth/en
- Preferred credit tone: professional and catchy, not overly promotional

## Tech Stack

This is a dependency-free static website. Keep it simple:

- `index.html` for structure, SEO metadata and page content
- `styles.css` for all styling
- `script.js` for small interactions only
- `assets/og-image.svg` as editable social preview source
- `assets/og-image.png` as the actual Open Graph preview image
- `.github/workflows/deploy.yml` for manual GitHub Pages deployment

Do not introduce a framework, package manager, build system, backend or form server unless the user explicitly asks for it.

## Design Direction

Maintain a modern, professional, trust-focused tax consultant website:

- Use a clean navy, green, white and gold accent palette
- Keep cards and panels at restrained corner radius around 8px
- Avoid outdated visiting-card style graphics on the website and in the OG preview
- Keep the page practical and client-facing, not like a marketing landing page with excessive decoration
- Prioritize clear service information, credibility metrics and contact actions
- Make mobile layouts readable with no text overlap
- Keep developer credit as a separate styled box near the footer

## Content Guidance

When editing copy:

- Keep language concise, professional and easy for clients to understand
- Mention 300+ clients and 3+ years where credibility is useful
- Include ITR, GST, TDS/TCS, accounting, registrations, audit and compliance as full-service coverage
- Do not make unverifiable claims beyond the provided business facts
- Keep phone, WhatsApp and email links accurate

## SEO and Social Preview

Preserve and update these when relevant:

- Canonical URL: `https://ndbhaskar.github.io/`
- `og:url`: `https://ndbhaskar.github.io/`
- `og:image`: `https://ndbhaskar.github.io/assets/og-image.png`
- Twitter card image should match the OG image
- Keep `og-image.png` at `1200x630`

If `assets/og-image.svg` changes, regenerate the PNG locally with:

```sh
sips -s format png assets/og-image.svg --out assets/og-image.png
```

Then verify dimensions:

```sh
sips -g pixelWidth -g pixelHeight assets/og-image.png
```

Expected dimensions:

```text
pixelWidth: 1200
pixelHeight: 630
```

## GitHub Pages Deployment

Deployment is manual through GitHub Actions:

- Workflow file: `.github/workflows/deploy.yml`
- Trigger: `workflow_dispatch`
- GitHub Pages source should be set to GitHub Actions
- Do not replace this with branch-based deployment unless asked

## Editing Rules

When updating this repo:

- Keep changes small and focused
- Preserve existing contact details and business facts unless the user provides replacements
- Do not re-add the old visiting-card asset or make it the main social preview
- Do not add a contact form unless a third-party form provider is explicitly requested
- Do not add unnecessary markdown files outside `.github` unless the user asks
- Validate HTML, CSS, JS and workflow files after edits
