# Migrate your React app from `react-scripts` (Create React App) to Vite

Viject helps you move a Create React App project to Vite in one shot.

```sh
# cd <YOUR_APP>
npx viject
# then run your package manager's install command
```

After that, you can start developing with Vite:

```sh
# dev server
npm run dev
# production build
npm run build
```

If something goes wrong, open an issue:
https://github.com/bhbs/viject/issues

## Why Viject exists

Create React App maintenance has effectively stalled, and there are no plans for active future development:

https://github.com/reactjs/react.dev/pull/5487#issuecomment-1409720741

I still maintain Create React App applications at work, and while I reviewed several migration guides, none of them matched the needs of my project closely enough. Viject was built to make that migration practical.

Viject is designed to bridge Create React App and Vite by absorbing compatibility differences into `vite.config`, so you can migrate quickly first and remove compatibility layers gradually later.

The name is a play on Create React App's `eject` command: `Vite` + `eject` = `Viject`.

Create React App is a large tool with a lot of behavior, so there may still be cases Viject does not cover yet. If you run into one, please open an issue. I want to keep improving compatibility.

This document explains the approach Viject takes.

## `vite.config.ts` compatibility with `react-scripts`

### Load environment variables

Like Create React App, Vite uses dotenv expansion internally. Viject uses `define` so the app can continue reading compatible environment variables.

```js
function envPlugin() {
  return {
    name: "env-plugin",
    config(_, { mode }) {
      const env = loadEnv(mode, ".", ["REACT_APP_", "NODE_ENV", "PUBLIC_URL"]);
      return {
        define: Object.fromEntries(
          Object.entries(env).map(([key, value]) => [
            `process.env.${key}`,
            JSON.stringify(value),
          ]),
        ),
      };
    },
  };
}
```

https://vite.dev/config/shared-options.html#define
https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used

### Configure `HOST`, `PORT`, and SSL

This can be configured through `server`.

```js
function devServerPlugin() {
  return {
    name: "dev-server-plugin",
    config(_, { mode }) {
      const { HOST, PORT, HTTPS, SSL_CRT_FILE, SSL_KEY_FILE } = loadEnv(
        mode,
        ".",
        ["HOST", "PORT", "HTTPS", "SSL_CRT_FILE", "SSL_KEY_FILE"],
      );
      const https = HTTPS === "true";
      return {
        server: {
          host: HOST || "0.0.0.0",
          port: parseInt(PORT || "3000", 10),
          open: true,
          https:
            https && SSL_CRT_FILE && SSL_KEY_FILE
              ? {
                  cert: readFileSync(resolve(SSL_CRT_FILE)),
                  key: readFileSync(resolve(SSL_KEY_FILE)),
                }
              : https,
        },
      };
    },
  };
}
```

https://vite.dev/config/server-options.html#server-https

### Support source maps

Enable `build.sourcemap` and use `GENERATE_SOURCEMAP` for Create React App compatibility.

```js
function sourcemapPlugin() {
  return {
    name: "sourcemap-plugin",
    config(_, { mode }) {
      const { GENERATE_SOURCEMAP } = loadEnv(mode, ".", ["GENERATE_SOURCEMAP"]);
      return {
        build: {
          sourcemap: GENERATE_SOURCEMAP === "true",
        },
      };
    },
  };
}
```

https://vite.dev/config/build-options.html#build-sourcemap

### Change the output directory

Set `build.outDir` and use `BUILD_PATH` for Create React App compatibility.

```js
function buildPathPlugin() {
  return {
    name: "build-path-plugin",
    config(_, { mode }) {
      const { BUILD_PATH } = loadEnv(mode, ".", ["BUILD_PATH"]);
      return {
        build: {
          outDir: BUILD_PATH || "build",
        },
      };
    },
  };
}
```

https://vite.dev/config/build-options.html#build-outdir

### Change the base path

Set `base` and use `PUBLIC_URL` for Create React App compatibility.

```js
function basePlugin() {
  return {
    name: "base-plugin",
    config(_, { mode }) {
      const { PUBLIC_URL } = loadEnv(mode, ".", ["PUBLIC_URL"]);
      return {
        base: PUBLIC_URL || "",
      };
    },
  };
}
```

https://vite.dev/config/shared-options.html#base

### Support `~` imports

Create React App allows `~` as a prefix when resolving modules from `node_modules`. The same behavior can be reproduced with `resolve.alias`.

```js
function importPrefixPlugin() {
  return {
    name: "import-prefix-plugin",
    config() {
      return {
        resolve: {
          alias: [{ find: /^~([^/])/, replacement: "$1" }],
        },
      };
    },
  };
}
```

https://vite.dev/config/shared-options.html#resolve-alias

### Support `setupProxy.js`

This can be implemented with the `configureServer` hook.

Vite uses `http-proxy` for proxying, and that library does not support HTTP/2. When a proxy is configured, Vite falls back to HTTP/1. That server still supports HTTPS, so an empty proxy configuration is enough to keep HTTPS proxy behavior available.

https://github.com/vitejs/vite/issues/484

```js
function setupProxyPlugin() {
  return {
    name: "configure-server",
    config() {
      return {
        server: { proxy: {} },
      };
    },
    configureServer(server) {
      setupProxy(server.middlewares);
    },
  };
}
```

https://vite.dev/guide/api-plugin.html#configureserver

### Support `%ENV_VARIABLES%` in `index.html`

This can be implemented with the `transformIndexHtml` hook.

```js
function htmlPlugin(mode) {
  const env = loadEnv(mode, ".", ["REACT_APP_", "NODE_ENV", "PUBLIC_URL"]);
  return {
    name: "html-transform",
    transformIndexHtml: {
      enforce: "pre",
      transform(html) {
        return html.replace(/%(.*?)%/g, (match, p1) => env[p1] ?? match);
      },
    },
  };
}
```

https://vite.dev/guide/api-plugin.html#transformindexhtml

## Changes that cannot be handled only in `vite.config`

### 1. Add dependencies

Update `package.json`.

#### `vite` / `@vitejs/plugin-react`

https://www.npmjs.com/package/vite
https://www.npmjs.com/package/@vitejs/plugin-react

`@vitejs/plugin-react` is the all-in-one Vite plugin for React projects.

#### `@svgr/core-svgr` / `@svgr/plugin-jsx`

In Create React App, SVG files can be imported directly as React components. That behavior depends on SVGR libraries.

https://create-react-app.dev/docs/adding-images-fonts-and-files/#adding-svgs

#### `vite-tsconfig-paths`

https://www.npmjs.com/package/vite-tsconfig-paths

`vite-tsconfig-paths` lets Vite resolve imports from `jsconfig.json` or `tsconfig.json` path mappings.

### 2. Move `index.html`

https://vite.dev/guide/#index-html-and-project-root

In Vite, `index.html` is part of the application entry point and lives at the project root. In Create React App, it lives at `public/index.html`, so it must be moved.

### 3. Add `react-app.d.ts`

When you run `eject` in `react-scripts`, `react-app.d.ts` is generated. Viject adds an equivalent file.

https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/lib/react-app.d.ts

### 4. Convert `.js` files containing JSX to `.jsx`

Checking whether a `.js` file contains JSX hurts build performance, so Vite expects JSX files to use the `.jsx` extension.

https://github.com/vitejs/vite/discussions/3112#discussioncomment-650030

### 5. Update npm scripts

In Create React App, the development command is `start`. In Vite, it is `dev`.

## Appendix

- https://github.com/bhbs/viject
- https://github.com/facebook/create-react-app
- https://vite.dev/guide/
