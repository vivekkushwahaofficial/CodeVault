# 🚀 CodeVault

> Automatically detect, organize, and sync your accepted coding solutions from coding platforms to GitHub.

![Version](https://img.shields.io/badge/version-v0.1.0-blue)
![Status](https://img.shields.io/badge/status-MVP-success)
![Platform](https://img.shields.io/badge/platform-LeetCode-orange)
![License](https://img.shields.io/badge/license-MIT-green)

---

# 📌 Overview

CodeVault is an open-source browser extension that automatically captures your accepted coding solutions, organizes them into a clean repository structure, and synchronizes everything to GitHub.

Instead of manually copying solutions, creating folders, writing README files, and committing changes, CodeVault handles the complete workflow automatically.

Current MVP supports:

- ✅ LeetCode
- ✅ GitHub OAuth Authentication
- ✅ Automatic Repository Sync
- ✅ Automatic README Generation
- ✅ Duplicate Submission Detection

More platforms and advanced features are planned in future releases.

---

# ✨ Features

## ✅ Automatic LeetCode Detection

CodeVault automatically detects when your LeetCode submission is accepted.

No buttons.
No manual actions.

Simply solve the problem and CodeVault does the rest.

---

## ✅ Solution Extraction

Automatically extracts your submitted solution from the accepted submission page.

Currently supported:

- Java
- Python
- C++

Support for JavaScript, Go, Rust, and more is planned.

---

## ✅ Problem Metadata Extraction

Automatically collects metadata including:

- Problem Title
- Difficulty
- Platform
- Programming Language
- Submission URL

---

## ✅ Problem Statement Extraction

Automatically extracts the complete problem statement and stores it inside a beautifully formatted README.md.

---

## ✅ Automatic README Generation

Each solved problem gets its own README.

Example:

```text
Interleaving String

Difficulty: Medium

Problem Statement

...

Approach

...

Complexity

...
```

---

## ✅ GitHub OAuth Authentication

Secure authentication using GitHub OAuth.

No Personal Access Token (PAT) is required.

---

## ✅ Automatic GitHub Sync

After every accepted submission, CodeVault automatically:

- Creates folders
- Generates README.md
- Saves your solution
- Creates a Git commit
- Pushes everything to GitHub

Example commit message:

```text
feat(leetcode): Add Two Sum
```

---

## ✅ Duplicate Detection

CodeVault generates a unique fingerprint for every accepted submission.

Previously uploaded submissions are automatically skipped to prevent duplicate commits.

---

## ✅ Organized Repository Structure

Solutions are automatically organized by:

- Platform
- Difficulty
- Problem Name

Example:

```text
Repository
│
└── LeetCode
    │
    ├── easy
    │   └── Two-Sum
    │       ├── README.md
    │       └── Solution.java
    │
    └── medium
        └── Interleaving-String
            ├── README.md
            └── Solution.java
```

---

# ⚙️ How It Works

```text
Solve Coding Problem

        │

        ▼

Submit Accepted Solution

        │

        ▼

CodeVault Detects Submission

        │

        ▼

Extract Solution

        │

        ▼

Extract Metadata

        │

        ▼

Extract Problem Statement

        │

        ▼

Generate README

        │

        ▼

Build Solution Package

        │

        ▼

Authenticate with GitHub

        │

        ▼

Commit Files

        │

        ▼

Push to Repository
```

---

# 🏗️ Architecture

```text
LeetCode

      │

      ▼

Content Script

      │

      ▼

Metadata Extractor

      │

      ▼

Solution Extractor

      │

      ▼

Problem Statement Extractor

      │

      ▼

README Generator

      │

      ▼

Background Service

      │

      ▼

Spring Boot Backend

      │

      ▼

GitHub REST API

      │

      ▼

GitHub Repository
```

---

# 🛠️ Tech Stack

## Browser Extension

- TypeScript
- React
- WXT Framework
- Chrome Extension Manifest V3

## Backend

- Java
- Spring Boot
- Spring Security
- OAuth2
- GitHub REST API

## Development Tools

- pnpm
- TurboRepo
- Vite
- Git

---

# 📁 Project Structure

```text
CodeVault
│
├── apps
│   ├── backend
│   │
│   └── extension
│       ├── entrypoints
│       └── src
│           ├── features
│           │   ├── github
│           │   ├── platforms
│           │   ├── extractor
│           │   ├── sync
│           │   └── settings
│           │
│           ├── shared
│           └── core
│
├── packages
│
└── docs
```

---

# 📥 Installation

## Chrome Extension

Coming soon on:

- Chrome Web Store
- Microsoft Edge Add-ons
- Firefox Add-ons

---

## Manual Installation

1. Clone the repository.

```bash
git clone https://github.com/vivekkushwahaofficial/CodeVault.git
```

2. Install dependencies.

```bash
pnpm install
```

3. Build the extension.

```bash
pnpm --dir apps/extension build
```

4. Open Chrome.

```text
chrome://extensions
```

5. Enable Developer Mode.

6. Click **Load unpacked**.

7. Select the generated extension folder.

---

# 🛠️ Development Setup

Clone the repository.

```bash
git clone https://github.com/vivekkushwahaofficial/CodeVault.git
```

Install dependencies.

```bash
pnpm install
```

Run the extension.

```bash
pnpm --dir apps/extension dev
```

Build the extension.

```bash
pnpm --dir apps/extension build
```

Run the backend.

```bash
cd apps/backend

./mvnw spring-boot:run
```

---

# 📌 Current MVP Status

## Supported

- ✅ LeetCode
- ✅ Java
- ✅ Python
- ✅ C++
- ✅ JavaScript
- ✅ Go
- ✅ Rust
- ✅ GitHub OAuth
- ✅ Automatic GitHub Sync
- ✅ README Generation
- ✅ Metadata Extraction
- ✅ Problem Statement Extraction
- ✅ Duplicate Detection
---

# 🚧 Roadmap

## v0.2

- GeeksforGeeks Support
- Multiple Programming Languages
- Better Settings Management
- Repository Configuration

---

## v0.3

- HackerRank Support
- Codeforces Support
- CodeChef Support
- Coding Ninjas Support

---

## v0.4

- AI Pattern Detection
- Automatic Topic Classification
- Analytics Dashboard
- Statistics Generator

---

## v0.5

- Multiple GitHub Accounts
- Multiple Repository Modes
- Offline Sync
- Background Queue

---

## v1.0

- Multi-platform Solution Manager
- AI-powered Insights
- Portfolio Website
- Revision Planner
- Browser Store Release

---

# 🤝 Contributing

Contributions are always welcome.

You can contribute by:

- Reporting bugs
- Suggesting features
- Improving documentation
- Opening pull requests

Create a new branch.

```bash
git checkout -b feature/my-feature
```

Commit your changes.

```bash
git commit -m "feat: add new feature"
```

Push your branch.

```bash
git push origin feature/my-feature
```

Finally, open a Pull Request.

---

# 📄 License

This project is licensed under the Apache License 2.0.

---

# ⭐ Support

If you find CodeVault useful, please consider giving the repository a ⭐.

It helps the project grow and motivates future development.

---

# 🌟 Vision

CodeVault aims to become the ultimate coding solution management platform.

In the future, developers will be able to:

- Automatically sync solutions from multiple coding platforms
- Organize solutions by difficulty, topic, pattern, and language
- Track coding progress and analytics
- Generate developer portfolios
- Receive AI-powered insights and revision plans
- Maintain a complete coding journey with zero manual effort

---

Built with ❤️ for developers who love solving problems, not managing repositories.
