import { writeFileSync } from "node:fs";
import typescript from "typescript";
import type { Options } from "./options.js";
import { appViteConfigJs, appViteConfigTs } from "./paths.js";

const importDirective = ({ jsConfig, svg, setupProxy }: Options) => `\
import { resolve } from "node:path";
import { readFileSync, existsSync } from "node:fs";
import { defineConfig, loadEnv, Plugin${
	svg ? ", createFilter, transformWithOxc" : ""
} } from "vite";
import react from "@vitejs/plugin-react";
${jsConfig ? 'import tsconfigPaths from "vite-tsconfig-paths";' : ""}
${setupProxy ? 'import setupProxy from "./src/setupProxy";' : ""}
`;

const defineConfig = ({
	tsConfig,
	jsConfig,
	svg,
	proxy,
	setupProxy,
}: Options) => `\
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  setEnv(mode);
  return {
    plugins: [
      react(),
      ${jsConfig ? "tsconfigPaths()," : ""}
      envPlugin(),
      devServerPlugin(),
      sourcemapPlugin(),
      buildPathPlugin(),
      basePlugin(),
      importPrefixPlugin(),
      htmlPlugin(mode),
      ${svg ? "svgrPlugin()," : ""}
      ${proxy ? "proxyPlugin()," : ""}
      ${setupProxy ? "setupProxyPlugin()," : ""}
    ],
		${tsConfig ? "resolve: { tsconfigPaths: true }," : ""}
  };
});
`;

const setEnv = `\
function setEnv(mode: string) {
	Object.assign(
		process.env,
		loadEnv(mode, ".", ["REACT_APP_", "NODE_ENV", "PUBLIC_URL"]),
	);
	process.env.NODE_ENV ||= mode;
	const { homepage } = JSON.parse(readFileSync("package.json", "utf-8"));
	process.env.PUBLIC_URL ||= homepage
		? \`\${
				homepage.startsWith("http") || homepage.startsWith("/")
					? homepage
					: \`/\${homepage}\`
			}\`.replace(/\\/$/, "")
		: "";
}
`;

const envPlugin = `\
// Expose \`process.env\` variables to client-side code.
// Migration guide: Replace \`process.env\` with \`import.meta.env\` in your app.
// You may also need to rename variables from the \`REACT_APP_\` prefix to \`VITE_\`.
// https://vite.dev/guide/env-and-mode.html#env-variables
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
// Configure HOST, HTTPS, and PORT.
// Migration guide:
// https://vite.dev/config/server-options.html#server-host
// https://vite.dev/config/server-options.html#server-https
// https://vite.dev/config/server-options.html#server-port
function devServerPlugin(): Plugin {
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
					...(https &&
						SSL_CRT_FILE &&
						SSL_KEY_FILE && {
							https: {
								cert: readFileSync(resolve(SSL_CRT_FILE)),
								key: readFileSync(resolve(SSL_KEY_FILE)),
							},
						}),
				},
			};
		},
	};
}
`;

const sourcemapPlugin = `\
// Migration guide:
// https://vite.dev/config/build-options.html#build-sourcemap
function sourcemapPlugin(): Plugin {
	return {
		name: "sourcemap-plugin",
		config(_, { mode }) {
			const { GENERATE_SOURCEMAP } = loadEnv(mode, ".", [
				"GENERATE_SOURCEMAP",
			]);
			return {
				build: {
					sourcemap: GENERATE_SOURCEMAP === "true",
				},
			};
		},
	};
}
`;

const buildPathPlugin = `\
// Migration guide:
// https://vite.dev/config/build-options.html#build-outdir
function buildPathPlugin(): Plugin {
	return {
		name: "build-path-plugin",
		config(_, { mode }) {
			const { BUILD_PATH } = loadEnv(mode, ".", [
				"BUILD_PATH",
			]);
			return {
				build: {
					outDir: BUILD_PATH || "build",
				},
			};
		},
	};
}
`;

const basePlugin = `\
// Migration guide: Follow the guide below and remove the \`homepage\` field from \`package.json\`.
// https://vite.dev/config/shared-options.html#base
function basePlugin(): Plugin {
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
`;

const importPrefixPlugin = `\
// Prefix imports with \`~\` to resolve modules from \`node_modules\`, like in Create React App.
// https://create-react-app.dev/docs/adding-a-sass-stylesheet
// Migration guide:
// https://vite.dev/config/shared-options.html#resolve-alias
function importPrefixPlugin(): Plugin {
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
`;

const svgrPlugin = `\
// Create React App supports importing SVGs directly as React components.
// This behavior is implemented with SVGR.
// https://create-react-app.dev/docs/adding-images-fonts-and-files/#adding-svgs
function svgrPlugin(): Plugin {
  const filter = createFilter("**/*.svg");
  const postfixRE = /[?#].*$/s;

  return {
    name: "svgr-plugin",
    async transform(code, id) {
      if (filter(id)) {
        const { transform } = await import("@svgr/core");
        const { default: jsx } = await import("@svgr/plugin-jsx");

        const filePath = id.replace(postfixRE, "");
        const svgCode = readFileSync(filePath, "utf8");

        const componentCode = await transform(svgCode, undefined, {
          filePath,
          caller: {
            previousExport: code,
            defaultPlugins: [jsx],
          },
        });

        const res = await transformWithOxc(componentCode, id, {
          lang: "jsx",
        });

        return {
          code: res.code,
          map: null,
        };
      }
    },
  };
}
`;

const proxyPlugin = `\
// Support the \`proxy\` field in \`package.json\`.
// https://create-react-app.dev/docs/proxying-api-requests-in-development/
// Migration guide: Follow the guide below and remove the \`proxy\` field from \`package.json\`.
// https://vite.dev/config/server-options.html#server-proxy
function proxyPlugin(): Plugin {
	return {
		name: "proxy-plugin",
		config() {
			const { proxy } = JSON.parse(readFileSync("package.json", "utf-8"));
			const publicUrl = process.env.PUBLIC_URL || "";
			const basePath = publicUrl.startsWith("http")
				? new URL(publicUrl).pathname
				: publicUrl;
			return {
				server: {
					proxy: {
						"^.*": {
							target: proxy,
							changeOrigin: true,
							secure: false,
							ws: true,
							bypass(req) {
								const path = req.url || "";
								const pathWithoutBase = path.replace(
									new RegExp(\`^(\${basePath})?/\`),
									"",
								);
								if (req.method !== "GET") return;
								if (
									!req.headers.accept?.includes("text/html") &&
									!existsSync(resolve("public", pathWithoutBase)) &&
									![
										"src",
										"@id",
										"@fs",
										"@vite",
										"@react-refresh",
										"node_modules",
										"__open-in-editor",
									].includes(pathWithoutBase.split("/")[0])
								) {
									return;
								}
								return req.url;
							},
						},
					},
				},
			};
		},
	};
}
`;

const setupProxyPlugin = `\
// Support manual proxy configuration through \`src/setupProxy\`.
// https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually
// https://vite.dev/guide/api-plugin.html#configureserver
// Migration guide: Follow the guide below and remove \`src/setupProxy\`.
// https://vite.dev/config/server-options.html#server-proxy
function setupProxyPlugin(): Plugin {
	return {
		name: "setup-proxy-plugin",
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
`;

const htmlPlugin = `\
// Replace \`%ENV_VARIABLES%\` in \`index.html\`.
// https://vite.dev/guide/api-plugin.html#transformindexhtml
// Migration guide: Follow the guide below.
// You may also need to rename variables from the \`REACT_APP_\` prefix to \`VITE_\`.
// https://vite.dev/guide/env-and-mode.html#html-env-replacement
function htmlPlugin(mode: string): Plugin {
	const env = loadEnv(mode, ".", ["REACT_APP_", "NODE_ENV", "PUBLIC_URL"]);
	return {
		name: "html-plugin",
		transformIndexHtml: {
			order: "pre",
			handler(html) {
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
${setEnv}
${envPlugin}
${devServerPlugin}
${sourcemapPlugin}
${buildPathPlugin}
${basePlugin}
${importPrefixPlugin}
${options.svg ? svgrPlugin : ""}
${options.proxy ? proxyPlugin : ""}
${options.setupProxy ? setupProxyPlugin : ""}
${htmlPlugin}`;

	return options.tsConfig
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
	options.tsConfig
		? writeFileSync(appViteConfigTs, viteConfig)
		: writeFileSync(appViteConfigJs, viteConfig);
};
