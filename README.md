# 🚀 CodeVault

> Automatically extract, organize, and sync your coding solutions from coding platforms to GitHub.

![CodeVault](https://img.shields.io/badge/CodeVault-v1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

# 📌 Overview

CodeVault is an open-source browser extension that helps developers automatically maintain their coding journey.

Solve a coding problem → CodeVault detects it → Extracts your solution → Organizes metadata → Syncs it with GitHub.

No manual copy-paste.  
No manual repository management.

---

# ✨ Features (v1.0.0)

## ✅ LeetCode Solution Extraction

Automatically detects accepted LeetCode solutions and extracts submitted code.

Currently supported:

- Java

More programming languages will be added in future releases.

---

## ✅ Automatic GitHub Sync

CodeVault automatically creates solution files inside your GitHub repository.

Example:

```
Your Repository

LeetCode
│
└── Easy
    │
    └── Two-Sum.java
```

Every solution is committed with a meaningful commit message.

Example:

```
feat(leetcode): Add Two Sum
```

---

## ✅ Problem Metadata Extraction

Automatically collects:

- Problem name
- Difficulty
- Platform
- Programming language
- Solution content
- Solved date

---

## ✅ Language Detection

Detects programming language and creates the correct file extension.

Example:

```
Java        → Two-Sum.java
Python      → Two-Sum.py
C++         → Two-Sum.cpp
JavaScript  → Two-Sum.js
```

(Currently Java support is available.)

---

# 📥 Installation

## Chrome Extension

The extension will be available through:

- Chrome Web Store
- Microsoft Edge Add-ons
- Firefox Add-ons

---

## Manual Installation

For now, you can install CodeVault manually:

1. Download the latest release from GitHub Releases.

2. Extract the downloaded file.

3. Open Chrome:

```
chrome://extensions
```

4. Enable:

```
Developer Mode
```

5. Click:

```
Load unpacked
```

6. Select the CodeVault extension folder.

---

# ⚙️ How It Works

```
Solve Coding Problem

        ↓

Submit Accepted Solution

        ↓

CodeVault Detects Solution

        ↓

Extract Code + Metadata

        ↓

GitHub API Sync

        ↓

Solution Saved Automatically
```

---

# 🏗️ Architecture

```
Coding Platform

        ↓

CodeVault Extension

        ↓

Solution Extractor

        ↓

Metadata Processor

        ↓

GitHub Client

        ↓

Your Repository
```

---

# 🛠️ Tech Stack

## Extension

- TypeScript
- React
- WXT Framework
- Chrome Extension Manifest V3

## APIs

- GitHub REST API

## Development

- pnpm
- Vite

---

# 📁 Project Structure

```
CodeVault

├── apps
│   └── extension
│       ├── entrypoints
│       └── src
│           ├── features
│           │   ├── github
│           │   ├── platforms
│           │   └── settings
│
├── docs
│
└── packages
```

---

# 🛠️ Development Setup

For contributors:

Clone the repository:

```bash
git clone https://github.com/vivekkushwahaofficial/CodeVault.git
```

Install dependencies:

```bash
pnpm install
```

Build extension:

```bash
pnpm --dir apps/extension build
```

---

# 🚧 Roadmap

## v1.1

- More programming languages
- Better settings management
- Multiple repository support
- Improved error handling

---

## Future

- Multiple coding platform support
- AI-powered solution classification
- Pattern detection
- Analytics dashboard
- Revision system
- Developer portfolio generation

---

# 🤝 Contributing

CodeVault is open source and contributions are welcome.

You can contribute through:

- Bug reports
- Feature requests
- Pull requests
- Documentation improvements

Steps:

```bash
git checkout -b feature/new-feature

git commit -m "feat: add new feature"

git push origin feature/new-feature
```

Then create a Pull Request.

---

# 📄 License

CodeVault is licensed under the MIT License.

---

# ⭐ Support

If you find CodeVault useful, consider giving the repository a star.

---

Built with ❤️ for developers who want their coding journey organized automatically.