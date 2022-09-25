# Contribution Guide

Hi! We're really excited that you're interested in contributing to Viject!

## Contribute

I truly appreciate contributions in the form of:

- Fixing typos
- Improving docs
- Refactoring codes
- Triaging [issues](https://github.com/bhbs/viject/issues).
- Sharing your opinion on issues.

## Issues

- Before opening a new issue, look for existing issues (even closed ones).
- If you're reporting a bug, include as much information as possible. Ideally, include a test case that reproduces the bug. For example, a [Runkit](https://runkit.com) or [repl.it](https://repl.it) playground.

## 👨‍💻 Setup

```sh
npm ci
```

## 🧪 Develop

To test:

```sh
npm test
```

To check code style:

```sh
npm run lint
```

## 🚀 Release (Admin)

```
npm version $SEMVER
```

```
git push origin $TAG
```
