# PHS Remodeling Website

A premium, professional website for **PHS Remodeling** built with Jekyll and Decap CMS, hosted on GitHub Pages.

---

## 🚀 Quick Start (GitHub Pages Deployment)

### 1. Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Name it `phsremodeling` (or any name you prefer)
3. Set it to **Public** (required for free GitHub Pages)
4. **Don't** initialize with a README (you have one already)

### 2. Push the Code
```bash
cd phs-remodeling
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

### 3. Enable GitHub Pages
1. In your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` → `/ (root)` → **Save**
4. Your site will be live at `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

### 4. Set a Custom Domain (phsremodeling.com)
1. In GitHub Pages settings → **Custom domain** → enter `phsremodeling.com` → Save
2. In your domain registrar (GoDaddy, Namecheap, etc.) add DNS records:
   ```
   Type    Name    Value
   A       @       185.199.108.153
   A       @       185.199.109.153
   A       @       185.199.110.153
   A       @       185.199.111.153
   CNAME   www     YOUR-USERNAME.github.io
   ```
3. Back in `_config.yml` set `url: "https://phsremodeling.com"` and `baseurl: ""`

---

## ✏️ Content Editing (Decap CMS)

### Setting Up the CMS Admin

#### Step 1 — Create a GitHub App (for PKCE auth)
1. Go to **GitHub → Settings → Developer settings → GitHub Apps → New GitHub App**
2. Fill in:
   - **App name**: PHS Remodeling CMS
   - **Homepage URL**: `https://phsremodeling.com`
   - **Callback URL**: `https://phsremodeling.com/admin/`
   - **Webhook**: Uncheck "Active"
   - **Permissions**: Repository → Contents: **Read & write**; Metadata: **Read**
3. Click **Create GitHub App** — note the **App ID** (a number)
4. Under "Install App" → install it on your repository

#### Step 2 — Update admin/config.yml
Open `admin/config.yml` and replace the placeholders:
```yaml
backend:
  repo:   YOUR-GITHUB-USERNAME/YOUR-REPO-NAME  # e.g. jsmith/phsremodeling
  app_id: 123456                               # Your numeric GitHub App ID
```

#### Step 3 — Access the CMS
Visit `https://phsremodeling.com/admin/` and log in with GitHub.

### What You Can Edit in the CMS

| Section | CMS Location |
|---|---|
| Projects / Portfolio | **Projects** collection → add/edit/delete |
| Services list (hero tags) | **Site Settings → Services List** |
| Why Choose Us cards | **Site Settings → Why Choose Us** |
| Business hours | **Site Settings → Hours of Service** |
| Stats bar numbers | **Site Settings → Stats Bar** |
| Phone / Email / Area | **Site Settings → Business Info** |

---

## 📁 File Structure

```
phs-remodeling/
├── index.html              Main page (Jekyll + Liquid template)
├── _config.yml             Site settings — phone, email, hours, stats
├── _data/
│   ├── services.yml        Service tags shown in the hero
│   └── whyus.yml           "Why Choose Us" card content
├── _projects/              Portfolio projects (one file per project)
│   ├── 01-kitchen-renovation.md
│   ├── 02-bathroom-remodel.md
│   └── 03-exterior-siding-roofing.md
├── admin/
│   ├── index.html          Decap CMS admin interface
│   └── config.yml          CMS configuration
├── assets/
│   ├── css/style.css       All styles
│   ├── js/main.js          JavaScript
│   └── images/uploads/     CMS-uploaded images land here
├── Gemfile                 Ruby dependencies (for local dev)
├── .gitignore
└── README.md
```

---

## 🖼️ Adding Images

### Hero Background
Open `index.html` and replace the placeholder section with:
```html
<img src="/assets/images/hero.jpg" alt="" class="hero-bg-img" />
```
Upload `hero.jpg` to `assets/images/`.

### Project Images
1. Via CMS: go to **Projects** → select a project → upload images
2. Via files: place images in `assets/images/uploads/` and add paths in the project's `.md` file:
```yaml
images:
  - /assets/images/uploads/kitchen-before.jpg
  - /assets/images/uploads/kitchen-after.jpg
  - /assets/images/uploads/kitchen-detail.jpg
```

---

## 💻 Local Development (optional)

```bash
# Install Ruby & Bundler first: https://jekyllrb.com/docs/installation/
gem install bundler
bundle install
bundle exec jekyll serve --livereload
# → Open http://localhost:4000
```

---

## 📬 Contact Form

The form requires a backend handler. Choose one:

**Option A — Formspree (easiest)**
1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form → get your endpoint URL
3. In `index.html`, change the `<form>` tag:
   ```html
   <form action="https://formspree.io/f/YOUR_ID" method="POST">
   ```
4. Remove the `id="contactForm"` JavaScript handler in `main.js` (or keep for UX feedback)

**Option B — Netlify Forms**
Add `netlify` attribute to the form tag and host on Netlify instead of GitHub Pages.

**Option C — EmailJS**
Use the `main.js` fetch block with EmailJS for client-side email sending.

---

## 📞 Support

Website built for **PHS Remodeling** — phsremodeling.com
