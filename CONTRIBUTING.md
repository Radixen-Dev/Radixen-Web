# Contributing to Radixen Web

## Ground rules

- **Never commit directly to `main`.** It is the production branch and is deployed automatically.
- Every change — no matter how small — goes through a branch and a pull request.
- Keep pull requests focused. One concern per PR.

---

## Branch naming

Format: `<type>/<short-description>`

| Type | When to use |
|------|-------------|
| `feat/` | New feature or section |
| `fix/` | Bug fix |
| `content/` | Copy, text, or asset change |
| `style/` | CSS / visual tweak |
| `refactor/` | Code restructure, no behaviour change |
| `chore/` | Tooling, deps, config |

**Examples:**
```
feat/github-projects-section
fix/mobile-nav-overlay-zindex
content/about-copy-update
style/hero-gradient-tweak
chore/add-gitignore
```

Lowercase, hyphen-separated. No spaces, no special characters.

---

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>
```

**Types:** `feat`, `fix`, `content`, `style`, `refactor`, `chore`, `docs`

**Examples:**
```
feat(nav): add github link to nav and footer
fix(hero): restore title opacity after intro overlay
content(about): rewrite about section copy
style(hero): extend fade gradient on canvas edge
chore(git): add gitignore
```

- Use the **imperative mood**: "add" not "added", "fix" not "fixed"
- Keep the summary under 72 characters
- No period at the end

---

## Pull requests

1. **Branch off `main`:**
   ```bash
   git checkout main && git pull
   git checkout -b feat/your-feature
   ```

2. **Make your changes**, commit as you go.

3. **Push and open a PR against `main`:**
   ```bash
   git push -u origin feat/your-feature
   ```

4. **PR title** should follow the same Conventional Commits format as your commits.

5. **PR description** should explain:
   - What changed and why
   - Any decisions made or trade-offs
   - Screenshots for visual changes

6. PRs require at least one review before merging.

7. **Squash merge** into `main`. Keep the history clean.

8. Delete the branch after merging.

---

## Local development

```bash
# Serve locally (no build step required)
python3 -m http.server 4242
# Open http://localhost:4242
```

The project is pure HTML/CSS/JS — no package manager, no build toolchain.
