import { writeFileSync } from "node:fs";
import typescript from "typescript";
import { Options } from "./options.js";
import { appViteConfigJs, appViteConfigTs } from "./paths.js";

const importDirective = ({ tsConfig, jsConfig, svg, setupProxy }: Options) => `\
import { resolve } from "node:path";
import { readFileSync, existsSync } from "node:fs";
import { defineConfig, loadEnv, Plugin } from "vite";
import react from "@vitejs/plugin-react";
${
	tsConfig || jsConfig ? 'import tsconfigPaths from "vite-tsconfig-paths";' : ""
}
${svg ? 'import svgr from "vite-plugin-svgr";' : ""}
${setupProxy ? 'import setupProxy from "./src/setupProxy";' : ""}
`;

const defineConfig = ({
	tsConfig,
	jsConfig,
	svg,
	proxy,
	setupProxy,
}: Options) => `\
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  setEnv(mode);
  return {
    plugins: [
      react(),
      ${svg ? "svgr()," : ""}
      ${tsConfig || jsConfig ? "tsconfigPaths()," : ""}
      envPlugin(),
      devServerPlugin(),
      sourcemapPlugin(),
      buildPathPlugin(),
      basePlugin(),
      importPrefixPlugin(),
      htmlPlugin(mode),
      ${proxy ? "proxyPlugin()," : ""}
      ${setupProxy ? "setupProxyPlugin()," : ""}
    ],
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
// Expose \`process.env\` environment variables to your client code
// https://vitejs.dev/config/shared-options.html#define
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
// https://vitejs.dev/config/server-options.html#server-https
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

const sourcemapPlugin = `\
// https://vitejs.dev/config/build-options.html#build-sourcemap
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
// https://vitejs.dev/config/build-options.html#build-outdir
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
// https://vitejs.dev/config/shared-options.html#base
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
// To resolve modules from node_modules, you can prefix paths with ~
// https://create-react-app.dev/docs/adding-a-sass-stylesheet
// https://vitejs.dev/config/shared-options.html#resolve-alias
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

const proxyPlugin = `\
// Configuring the Proxy in package.json
// https://create-react-app.dev/docs/proxying-api-requests-in-development/
// https://vitejs.dev/config/server-options.html#server-proxy
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
// Configuring the Proxy Manually
// https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually
// https://vitejs.dev/guide/api-plugin.html#configureserver
function setupProxyPlugin(): Plugin {
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
`;

const htmlPlugin = `\
// Replace %ENV_VARIABLES% in index.html
// https://vitejs.dev/guide/api-plugin.html#transformindexhtml
function htmlPlugin(mode: string): Plugin {
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
