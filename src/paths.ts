import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = realpathSync(process.cwd());
const resolveApp = (relativePath: string) =>
	resolve(appDirectory, relativePath);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const resolveOwn = (relativePath: string) =>
	resolve(__dirname, "..", relativePath);

export const appIndexHTML = resolveApp("index.html");
export const oldIndexHTML = resolveApp("public/index.html");
export const appViteConfig = resolveApp("vite.config.ts");
export const ownViteConfig = resolveOwn("assets/vite.config.ts");
export const appPackageJson = resolveApp("package.json");
export const ownPackageJson = resolveOwn("package.json");
export const appTypeDeclarations = resolveApp("src/react-app-env.d.ts");
export const ownTypeDeclarations = resolveOwn("assets/react-app.d.ts");
