# Publishing Weave Skill To Clawhub

This guide is for publishing:

- Skill path: `/Users/aryanjabbari/Documents/projects/weave-cash/skills/weave`
- Skill name: `weave`

## Prerequisites

1. Install and authenticate `clawhub` CLI.
2. Ensure these files exist:
   - `SKILL.md`
   - `agents/openai.yaml`
   - `references/cli-contract.md`
   - `references/scenarios.md`
   - `LICENSE.txt`
3. Validate frontmatter and metadata:
   - `name: weave`
   - `metadata.openclaw.requires.bins` includes `weave`

## Pre-Publish Checks

From repo root:

```bash
find skills/weave -type f | sort
du -sh skills/weave
```

Optional structure validation (if `PyYAML` is available):

```bash
python3 /Users/aryanjabbari/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/aryanjabbari/Documents/projects/weave-cash/skills/weave
```

## Publish Command

Use this command template:

```bash
clawhub publish /Users/aryanjabbari/Documents/projects/weave-cash/skills/weave --version 0.1.0 --changelog "Initial publish: full Weave invoice lifecycle skill (create, quote, status/watch), JSON-first guidance, runtime token discovery."
```

## Versioning Rules

- First release default: `0.1.0`
- Bump patch for text fixes (`0.1.1`)
- Bump minor for new workflows (`0.2.0`)
- Bump major for breaking behavioral changes (`1.0.0`)

## Changelog Template

```md
Initial publish: full Weave invoice lifecycle skill (create, quote, status/watch), JSON-first guidance, runtime token discovery.
```

For updates:

```md
Updated token/network handling guidance and status-watch timeout behavior documentation.
```

## Post-Publish Validation

1. Check skill metadata:

```bash
clawhub inspect weave
```

2. Confirm `SKILL.md` was published:

```bash
clawhub inspect weave --files
```

3. Verify discoverability in registry search:

```bash
clawhub search weave
```

## Operational Notes

- Keep crypto-only scope; do not add fiat assumptions.
- Runtime token/network support can drift from local docs; `weave tokens` is the live source of truth.
- Do not publish secrets or credential-bearing examples in skill files.
