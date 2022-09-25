/// <reference types="vitest" />
import { resolve } from "node:path"
import { existsSync, readFileSync } from "node:fs"
import { defineConfig, loadEnv, Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { VitePWA } from "vite-plugin-pwa"
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	process.env.NODE_ENV ||= mode
	process.env.PUBLIC_URL ||= JSON.parse(readFileSync("package.json", "utf-8")).homepage || ""

	return {
		plugins: [
			react(),
			svgr(),
			tsconfigPaths(),

			envPlugin(),
			devServerPlugin(),
			buildPlugin(),
			basePlugin(),
			importPrefixPlugin(),
			pwaPlugin(),
			htmlPlugin(mode),
			testPlugin(),
		]
	}
})

// Expose `process.env` environment variables to your client code
function envPlugin(): Plugin {
	return {
		name: 'env-plugin',
		config(_, { mode }) {
			const env = loadEnv(mode, ".", [
				"REACT_APP_",
				"NODE_ENV",
				"PUBLIC_URL"
			])
			return {
				define: Object.fromEntries(
					Object.entries(env).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])
				)
			}
		},
	}
}

function devServerPlugin(): Plugin {
	return {
		name: 'dev-server-plugin',
		config: (_, { mode }) => {
			const {
				HOST,
				PORT,
				HTTPS,
				SSL_CRT_FILE,
				SSL_KEY_FILE,
			} = loadEnv(mode, ".", [
				"HOST",
				"PORT",
				"HTTPS",
				"SSL_CRT_FILE",
				"SSL_KEY_FILE",
			])
			const https = HTTPS === "true"
			return {
				server: {
					host: HOST || "localhost",
					port: parseInt(PORT || "3000", 10),
					open: true,
					https: (https && SSL_CRT_FILE && SSL_KEY_FILE) ? {
						cert: readFileSync(resolve(SSL_CRT_FILE)),
						key: readFileSync(resolve(SSL_KEY_FILE)),
					} : https
				}
			}
		}
	}
}

function buildPlugin(): Plugin {
	return {
		name: 'build-plugin',
		config: (_, { mode }) => {
			const {
				BUILD_PATH,
				GENERATE_SOURCEMAP
			} = loadEnv(mode, ".", [
				"BUILD_PATH",
				"GENERATE_SOURCEMAP",
			])
			return {
				build: {
					sourcemap: GENERATE_SOURCEMAP === 'true',
					outDir: BUILD_PATH || "build"
				},
			}
		}
	}
}

function basePlugin(): Plugin {
	return {
		name: 'base-plugin',
		config: (_, { mode }) => {
			const {
				PUBLIC_URL
			} = loadEnv(mode, ".", [
				"PUBLIC_URL",
			])
			return {
				base: PUBLIC_URL || ""
			}
		}
	}
}

// Vitest configuration compatible with react-scripts
function testPlugin(): Plugin {
	return {
		name: 'test-plugin',
		config: () => {
			return {
				test: {
					globals: true,
					environment: "happy-dom",
					setupFiles:
						existsSync("src/setupTests.js") || existsSync("src/setupTests.ts")
							? ["src/setupTests"]
							: [],
					include: [
						"src/**/__tests__/**/*.{js,jsx,ts,tsx}",
						"src/**/*.{test,spec}.{js,jsx,ts,tsx}",
					],
				},
			}
		}
	}
}

// To resolve modules from node_modules, you can prefix paths with ~
// https://create-react-app.dev/docs/adding-a-sass-stylesheet
function importPrefixPlugin(): Plugin {
	return {
		name: 'import-prefix-plugin',
		config: () => {
			return {
				resolve: {
					alias: [{ find: /^~([^/])/, replacement: "$1" }],
				},
			}
		}
	}
}

// Setup PWA with .src/service-worker.js
function pwaPlugin(): Plugin {
	return {
		name: 'pwa-plugin',
		...VitePWA({
			srcDir: "src",
			filename: "service-worker.js",
			injectManifest: {
				maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
			},
		})
	}
}

// Read ./public/index.html instead of ./index.html
// Replace %ENV_VARIABLES% in index.html
// Insert script tag
function htmlPlugin(mode: string): Plugin {
	const env = loadEnv(mode, ".", [
		"REACT_APP_",
		"NODE_ENV",
		"PUBLIC_URL"
	])
	return {
		name: "html-transform",
		transformIndexHtml: {
			enforce: "pre",
			transform: (html) => {
				html = readFileSync("public/index.html", "utf-8")
				html = html.replace(/%(.*?)%/g, (match, p1) => env[p1] ?? match)
				html = html.replace(
					/<\/head>/,
					'<script type="module" src="src/index"></script></head>',
				)
				return html
			},
		},
	}
}
