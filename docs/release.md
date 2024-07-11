# A tool for migrating your React app from react-scripts (Create React App) to Vite

Switch to Vite in one-shot!

```sh
# cd <YOUR_APP>
npx viject
# and run install command
```

Now you can start developing!

```sh
# dev
npm run dev
# build
npm run build
```

Happy hacking! 👋

or something went wrong? Ask me https://github.com/bhbs/viject/issues

## Current status of Create React App and description of Viject

Recently, maintenance of Create React App has stalled, and there are no plans for active development in the future.

https://github.com/reactjs/react.dev/pull/5487#issuecomment-1409720741

However, I still maintain Create React App-based applications at work. While I have looked at some migration guides, they did not fully meet the needs of my specific application. As a result, I created a migration tool to Vite.

Viject is designed to bridge the gap between Create React App and Vite by using the vite.config file and gradually removing plugins as time allows after the migration.

The "eject" command in Create React App allows react-scripts to be removed with a single command. I have named my tool Viject, which is a play on words combining "Vite" and "eject".

While my requirements have been met, Create React App is a complex tool with many features. If your specific requirements are not met, please let me know by raising an issue. I am interested in resolving any problems you may encounter.

This article will provide a detailed description of the process involved in using Viject.

## vite.config.ts compatible with react-scripts

### Load environment variables


As with Create React App, dotenv expands are used internally in Vite. Use define to load in the Application.

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

https://vitejs.dev/config/shared-options.html#define
https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used

### Setup HOST, PORT and SSL

Can be configured by setting `server`.

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

https://vitejs.dev/config/server-options.html#server-https


### Support sourcemap

Can be supported by enabling `build.sourcemap`.
Use GENERATE_SOURCEMAP for Create React App compatibility.

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

https://vitejs.dev/config/build-options.html#build-sourcemap

### Change output dir

This can be changed by setting `build.outDir`.
Use BUILD_PATH for Create React App compatibility.

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

https://vitejs.dev/config/build-options.html#build-outdir

### Change basePath

This can be changed by setting the `base`.
Use PUBLIC_URL for Create React App compatibility.

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

https://vitejs.dev/config/shared-options.html#base

### Import with `~`

To resolve modules from node_modules, you can prefix paths with ~ in Create React App. Same functionality can be achieved by setting `resolve.alias`.

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

https://vitejs.dev/config/shared-options.html#resolve-alias


### Support setupProxy.js

It can be configured by using `configureServer` Hook.

There is an issue with using the http-proxy module that Vite utilizes for proxying, as it does not support HTTP/2. As a result, Vite falls back to using HTTP/1 when a proxy is configured. Fortunately, this HTTP/1 server still supports HTTPS, so leaving the proxy configuration empty will allow you to use a proxy with HTTPS.

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

https://vitejs.dev/guide/api-plugin.html#configureserver


### Support %ENV_VARIABLES% in index.html

It can be replaced by using transformIndexHtml Hook.

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

https://vitejs.dev/guide/api-plugin.html#transformindexhtml

## Changes that cannot be configured by vite.config

### 1. Add dependencies

Edit package.json

#### Vite / @vitejs/plugin-react

https://www.npmjs.com/package/vite
https://www.npmjs.com/package/@vitejs/plugin-react

`@vitejs/plugin-react` is all-in-one Vite plugin for React projects.

#### @svgr/core-svgr / @svgr/plugin-jsx

In Create React App, SVGs can be imported directly as React components. This is achieved by svgr libraries.

https://create-react-app.dev/docs/adding-images-fonts-and-files/#adding-svgs

#### vite-tsconfig-paths

https://www.npmjs.com/package/vite-tsconfig-paths

`vite-tsconfig-paths` gives Vite the ability to resolve imports using path mapping (jsconfig.json / tsconfig.json).

### 2. Move index.html

https://vitejs.dev/guide/#index-html-and-project-root

In Vite, the rule is to place index.html in the root as the application entry point. In Create React App, the rule is to place it in public/index.html, so it needs to be moved.

### 3. Add react-app.d.ts

When the eject command in react-scripts is used, react-app.d.ts is created. Add the same.

https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/lib/react-app.d.ts

### 4. Convert js to jsx

Checking whether a file with a js extension contains JSX is detrimental to build performance, so Vite requires the extension to be changed if it contains jsx.

https://github.com/vitejs/vite/discussions/3112#discussioncomment-650030

### 5. Update npm-scripts

In Create React App, the command to build the development server was `start`. In Vite, `dev`.

## Appendix

- https://github.com/bhbs/viject
- https://github.com/facebook/create-react-app
- https://vitejs.dev/guide/