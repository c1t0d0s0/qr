# QR Code Generator

[日本語版 (README.ja.md)](README.ja.md)

A modern, responsive, and privacy-friendly web application to generate QR codes for URLs, text, Wi-Fi networks, emails, phone numbers, and contact cards (vCard).

---

## ✨ Features

- **6 QR Code Types Supported**:
  - 🌐 **URL**: Direct links to websites.
  - 📝 **Text**: Any plain text messages.
  - 📶 **Wi-Fi**: Fast Wi-Fi network connection setup (WPA/WPA2/WPA3, WEP, Open, Hidden SSID).
  - ✉️ **Email**: Pre-filled recipient, subject, and body templates.
  - 📞 **Phone**: Direct dial phone numbers.
  - 📇 **Contact (vCard)**: Digital business cards with name, organization, job title, phone, email, and website.
- **Custom Image Label**: Add an optional descriptive header label embedded directly above the generated QR code.
- **Export & Share**:
  - 💾 **Download PNG**: Save the high-resolution QR code image locally.
  - 📋 **Copy to Clipboard**: One-click copy directly to your clipboard for quick pasting.
- **Theme Customization**: Dark mode and Light mode with smooth transitions and saved preferences.
- **Internationalization (i18n)**:
  - Automatic detection based on browser settings.
  - Manual switching between `Auto`, `日本語 (Japanese)`, and `English`.
- **Responsive & Accessible**:
  - 3x2 grid layout ensuring easy access to all types without horizontal scrolling on mobile or desktop.
  - Fully accessible with WAI-ARIA standards.
- **100% Client-Side**: All QR codes are generated directly in your browser with zero server tracking or data storage.

---

## 🚀 Getting Started

### Local Development

No build step or dependencies installation required. Simply open `index.html` in any modern web browser or serve it with a local static server:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js (npx)
npx serve .
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## ⚙️ Deployment & CI/CD

This repository includes a GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) to deploy automatically to **GitHub Pages** when pushing a tag starting with `v*` (e.g., `v1.0.0`).

### Triggering Deployment

```bash
git tag v1.0.0
git push origin v1.0.0
```

### Google Tag Manager (GTM) Configuration

If you wish to enable Google Tag Manager / Google Analytics:
1. Go to repository **Settings** → **Secrets and variables** → **Actions** → **Variables** (or **Secrets**).
2. Add `GTM_ID` with your Measurement ID / Container ID (e.g., `G-XXXXXXXXXX` or `GTM-XXXXXXX`).
3. The deployment workflow will automatically inject it into `config.js` upon deployment.

---

## 📁 File Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions Pages deployment workflow
├── config.js             # Configuration for GTM / Google Analytics
├── index.html            # Main HTML layout & structure
├── qrcode.min.js         # Client-side QR code generation library
├── script.js             # Application logic, i18n, themes, and QR generation
├── style.css             # Styles, themes (dark/light), and responsive layout
├── LICENSE               # MIT License
├── README.md             # English documentation
└── README.ja.md          # Japanese documentation
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
