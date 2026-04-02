# Contributing to Viject

Thanks for your interest in contributing to Viject.

## Ways to contribute

Contributions of all sizes are welcome, including:

- Fixing typos
- Improving documentation
- Refactoring code
- Opening [issues](https://github.com/bhbs/viject/issues)
- Triaging issues
- Sharing feedback on issues

## Reporting issues

If you are reporting a bug, include as much detail as possible. A minimal reproduction is especially helpful. For example, you can share a small repro using [RunKit](https://runkit.com) or [replit](https://replit.com).

## Setup

```sh
npm ci
```

## Development

Run tests with:

```sh
npm run test:e2e
npm run test:unit -- -u
npm run test:integration
```

Check code style with:

```sh
npm run lint
```

Format code with:

```sh
npm run format
```
