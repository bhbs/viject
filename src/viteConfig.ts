import { writeFileSync } from "node:fs";
import typescript from "typescript";
import { Options } from "./options.js";
import { appViteConfig } from "./paths.js";

const importDirective = ({ ts, svg, setupProxy }: Options) => `\
/// <reference types="vitest" />
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react";
${ts ? 'import tsconfigPaths from "vite-tsconfig-paths";' : ""}
${svg ? 'import svgr from "vite-plugin-svgr";' : ""}
${setupProxy ? 'import setupProxy from "./src/setupProxy";' : ""}
`;

const defineConfig = ({ ts, svg, setupProxy }: Options) => `\
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env.NODE_ENV ||= mode;
  const { homepage } = JSON.parse(readFileSync("package.json", "utf-8"));
  process.env.PUBLIC_URL ||= \`\${
    homepage && (homepage.startsWith("http") || homepage.startsWith("/"))
      ? homepage
      : \`/\${homepage}\`
  }\`.replace(/\\/$/, "");

  return {
    plugins: [
      react(),
      ${svg ? "svgr()," : ""}
      ${ts ? "tsconfigPaths()," : ""}
      envPlugin(),
      devServerPlugin(),
      buildPlugin(),
      basePlugin(),
      importPrefixPlugin(),
      htmlPlugin(mode),
      testPlugin(),
      ${setupProxy ? "setupProxyPlugin()," : ""}
    ],
  };
});
`;

const envPlugin = `\
// Expose \`process.env\` environment variables to your client code
function envPlugin(): Plugin {
  return {
    name: "env-plugin",
    config(_, { mode }) {
      const env = loadEnv(mode, ".", ["REACT_APP_", "NODE_ENV", "PUBLIC_URL"]);
      return {
        define: Object.fromEntries(
          Object.entries(env).map(([key, value]) => [
            \`process.env.\${key}\`,
            JSON.stringify(value),
          ]),
        ),
      };
    },
  };
}
`;

const devServerPlugin = `\
function devServerPlugin(): Plugin {
  return {
    name: "dev-server-plugin",
    config: (_, { mode }) => {
      const { HOST, PORT, HTTPS, SSL_CRT_FILE, SSL_KEY_FILE } = loadEnv(
        mode,
        ".",
        ["HOST", "PORT", "HTTPS", "SSL_CRT_FILE", "SSL_KEY_FILE"],
      );
      const https = HTTPS === "true";
      return {
        server: {
          host: HOST || "localhost",
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
`;

const buildPlugin = `\
function buildPlugin(): Plugin {
  return {
    name: "build-plugin",
    config: (_, { mode }) => {
      const { BUILD_PATH, GENERATE_SOURCEMAP } = loadEnv(mode, ".", [
        "BUILD_PATH",
        "GENERATE_SOURCEMAP",
      ]);
      return {
        build: {
          sourcemap: GENERATE_SOURCEMAP === "true",
          outDir: BUILD_PATH || "build",
        },
      };
    },
  };
}
`;

const basePlugin = `\
function basePlugin(): Plugin {
  return {
    name: "base-plugin",
    config: (_, { mode }) => {
      const { PUBLIC_URL } = loadEnv(mode, ".", ["PUBLIC_URL"]);
      return {
        base: PUBLIC_URL || "",
      };
    },
  };
}
`;

const testPlugin = ({ setupTestsJs, setupTestsTs }: Options) => `\
// Vitest configuration compatible with react-scripts
function testPlugin(): Plugin {
  return {
    name: "test-plugin",
    config: () => {
      return {
        test: {
          globals: true,
          environment: "happy-dom",
          setupFiles: [${
						setupTestsJs || setupTestsTs ? ` "src/setupTests" ` : ""
					}],
          include: [
            "src/**/__tests__/**/*.{js,jsx,ts,tsx}",
            "src/**/*.{test,spec}.{js,jsx,ts,tsx}",
          ],
        },
      };
    },
  };
}
`;

const importPrefixPlugin = `\
// To resolve modules from node_modules, you can prefix paths with ~
// https://create-react-app.dev/docs/adding-a-sass-stylesheet
function importPrefixPlugin(): Plugin {
  return {
    name: "import-prefix-plugin",
    config: () => {
      return {
        resolve: {
          alias: [{ find: /^~([^/])/, replacement: "$1" }],
        },
      };
    },
  };
}
`;

const setupProxyPlugin = `\
// Configuring the Proxy Manually
// https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually
function setupProxyPlugin(): Plugin {
  return {
    name: "configure-server",
    configureServer(server) {
      setupProxy(server.middlewares);
    },
  };
}
`;

const htmlPlugin = `\
// Replace %ENV_VARIABLES% in index.html
function htmlPlugin(mode: string): Plugin {
  const env = loadEnv(mode, ".", ["REACT_APP_", "NODE_ENV", "PUBLIC_URL"]);
  return {
    name: "html-transform",
    transformIndexHtml: {
      enforce: "pre",
      transform: (html) => {
        return html.replace(/%(.*?)%/g, (match, p1) => env[p1] ?? match);
      },
    },
  };
}
`;

export const createViteConfig = (options: Options) => {
	const config = `\
${importDirective(options)}
${defineConfig(options)}
${envPlugin}
${devServerPlugin}
${buildPlugin}
${basePlugin}
${testPlugin(options)}
${importPrefixPlugin}
${options.setupProxy ? setupProxyPlugin : ""}
${htmlPlugin}`;

	return options.ts
		? config
		: typescript.transpileModule(config, {
				compilerOptions: {
					target: typescript.ScriptTarget.ESNext,
					module: typescript.ModuleKind.ESNext,
				},
		  }).outputText;
};

export const writeViteConfig = (options: Options) => {
	const viteConfig = createViteConfig(options);
	writeFileSync(appViteConfig, viteConfig);
};
