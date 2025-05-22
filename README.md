# nodejs-prisma

git init

# test 2

# testing feature/apiAuth branch

# Git Branching Strategy

This document outlines the branching model and naming conventions used in this project to ensure consistency and ease of collaboration.

---

## 📌 Main Branches

- `main` — Stable, production-ready code. Only release-ready code is merged here.
- `dev` — Integration branch where all features and fixes are merged before staging or release.

---

## 🌱 Working Branch Types

### 🔧 Feature Branches

Used for developing new features.

- **Pattern:** `feature/<feature-name>`
- **Example:** `feature/user-login`, `feature/invoice-generator`

### 🐛 Bugfix Branches

Used for fixing non-critical bugs.

- **Pattern:** `bugfix/<short-description>`
- **Example:** `bugfix/fix-navbar`, `bugfix/api-timeout`

### 🚑 Hotfix Branches

Used for urgent fixes to production (merged directly into `main` and `dev`).

- **Pattern:** `hotfix/<short-description>`
- **Example:** `hotfix/fix-login-crash`

### 📦 Release Branches

Used to prepare for a new production release. These branches allow final testing and small tweaks.

- **Pattern:** `release/<version-name>`
- **Example:** `release/v1.2.0`, `release/2025-q2`

### 🧪 Test/Infra/Chore Branches

Used for infrastructure, testing, or routine updates.

- **Pattern:**
  - `test/<task>` — e.g. `test/add-unit-tests`
  - `infra/<setup-task>` — e.g. `infra/docker-setup`
  - `chore/<maintenance-task>` — e.g. `chore/remove-unused-deps`

---

## 🪄 Optional: Include Task ID (for teams using issue tracking)

If you're using GitHub Issues, Jira, etc., include the ticket ID in the branch name:

- `feature/123-user-authentication`
- `bugfix/456-api-error-handling`

---

## 🔄 Workflow Summary

1. **Create your branch** off `dev`:
   ```bash
   git checkout dev
   git pull
   git checkout -b feature/<your-feature-name>
   ```
