# Piyush Koshti | Portfolio

Personal portfolio of Piyush Koshti, AWS Cloud / DevOps Engineer. Plain HTML, CSS and JavaScript, no build step, so it runs directly on GitHub Pages.

Live site: https://piyushdevops410.github.io/

## Publish on GitHub Pages

1. Create a **public** repository named exactly `piyushdevops410.github.io`.
2. Upload everything in this folder to the repository root (`index.html` must be at the top level; keep the `assets` folder and the hidden `.nojekyll` file).
3. Go to **Settings → Pages**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, and save.
4. After about a minute the site is live at https://piyushdevops410.github.io/

Using git:

```bash
git init
git add .
git commit -m "Add portfolio website"
git branch -M main
git remote add origin https://github.com/piyushdevops410/piyushdevops410.github.io.git
git push -u origin main
```

## Structure

```
index.html                 All page content
assets/css/styles.css      Design, theme (dark/light) and animations
assets/js/main.js          Reveal-on-scroll, counters, skill bars, menu, screenshot viewer
assets/img/                Photo, favicon, social preview, project screenshots
assets/Piyush_Koshti_AWS_DevOps_Resume.pdf   "Download resume" button
```

## Editing

- Text, projects and links: `index.html` (each project is one `<article class="project-card">`).
- Add a project screenshot: put the image in `assets/img/projects/` and add it to the card's `data-gallery` list.
- Project 3 (EKS platform) has no repository link yet. A commented-out button is in `index.html`; uncomment it and set the repo URL.
- Update the resume: replace the PDF in `assets/` keeping the same file name.
