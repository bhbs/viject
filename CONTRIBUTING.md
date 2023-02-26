# Contribution Guide

Hi! We're really excited that you're interested in contributing to Viject!

## Contribute

I truly appreciate contributions in the form of:

- Fixing typos
- Improving docs
- Refactoring codes
- Opening [issues](https://github.com/bhbs/viject/issues)
- Triaging issues
- Sharing your opinion on issues.

## Issues

- If you're reporting a bug, include as much information as possible. Ideally, include a test case that reproduces the bug. For example, a [Runkit](https://runkit.com) or [repl.it](https://repl.it) playground.

## 👨‍💻 Setup

```sh
npm ci
```

## 🧪 Develop

To test:

```sh
npm run test:integration
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
