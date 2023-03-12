# Viject ⚡

> A tool for migrating your React app from react-scripts (Create React App) to Vite

## Usage

<a href="https://nodejs.org/en/about/releases/">
  <img src="https://img.shields.io/node/v/viject" alt="node compatibility">
</a>

```sh
cd <YOUR_APP>
npx viject
```

## How it works

1. Rewrite npm scripts and dependencies for Vite
1. Remove `react-scripts` from `react-app-env.d.ts`
1. Rewrite `react-app-env.d.ts` for CRA compatibility
1. Add `vite.config.ts` includes plugins for compatibility
1. Add `index.html`
1. Transform `.js` files including JSX into `.jsx`

## Supported features

- 🟢 Using HTTPS in Development

### Styles and Assets

- 🟢 Adding a Stylesheet
- 🟢 Adding a CSS Modules Stylesheet
- 🟢 Adding a Sass Stylesheet
- 🟡 Adding a CSS Reset (https://create-react-app.dev/docs/adding-css-reset)
- 🟢 Post-Processing CSS
- 🟢 Adding Images, Fonts, and Files
- 🟡 Loading .graphql Files (https://create-react-app.dev/docs/loading-graphql-files)
- 🟢 Using the Public Folder
- 🟢 Code Splitting

### Build

- 🟢 Adding Bootstrap
- 🟡 Adding Flow (https://create-react-app.dev/docs/adding-flow)
- 🟢 Adding TypeScript
- 🟡 Adding Relay (https://create-react-app.dev/docs/adding-relay)
- 🟢 Adding a Router
- 🟢 Adding Custom Environment Variables
- 🟡 Making a Progressive Web App
- 🟢 Measuring Performance
- 🟢 Creating a Production Build (https://create-react-app.dev/docs/production-build)

### Testing

https://vitest.dev/guide/migration.html

### Back-End Integration

- 🟢 Proxying API Requests in Development (https://create-react-app.dev/docs/proxying-api-requests-in-development)
- 🟢 Fetching Data with AJAX Requests

### Advanced Configuration

https://create-react-app.dev/docs/advanced-configuration

- 🟢 BROWSER
- 🟡 BROWSER_ARGS
- 🟢 HOST
- 🟢 PORT
- 🟢 HTTPS
- 🚫 WDS_SOCKET_HOST
- 🚫 WDS_SOCKET_PATH
- 🚫 WDS_SOCKET_PORT
- 🟢 PUBLIC_URL
- 🟢 BUILD_PATH
- 🚫 CI
- 🚫 REACT_EDITOR
- 🚫 CHOKIDAR_USEPOLLING
- 🟢 GENERATE_SOURCEMAP
- 🟡 INLINE_RUNTIME_CHUNK
- 🟡 IMAGE_INLINE_SIZE_LIMIT
- 🟢 FAST_REFRESH
- 🟡 TSC_COMPILE_ON_ERROR
- 🟡 ESLINT_NO_DEV_ERRORS
- 🟡 DISABLE_ESLINT_PLUGIN
- 🚫 DISABLE_NEW_JSX_TRANSFORM


## Contribution

See [Contributing Guide](https://github.com/bhbs/viject/blob/main/CONTRIBUTING.md)

## License

MIT
