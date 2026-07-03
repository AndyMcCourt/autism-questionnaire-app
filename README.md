# Autism Questionnaire App

A fully interactive static web version of the Autism Spectrum Quotient (AQ-50) questionnaire.

## Features

- All 50 AQ statements from the linked source form
- Four response choices for every statement
- Sticky progress and live score summary
- Automatic AQ scoring by keyed agree/disagree direction
- Plain-language score bands with a professional-assessment disclaimer
- Completion state, score interpretation, and reset control
- Responsive, accessible questionnaire layout

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

This repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`. Enable GitHub Pages in the repository settings with **GitHub Actions** as the source, then push to `main` or run the workflow manually.

## Build

```bash
npm run build
```

> This application is informational and is not a diagnostic tool. Clinical concerns should be discussed with a qualified professional.
