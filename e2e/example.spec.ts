import { expect, test } from "@playwright/test";

const cssFeatures = [
	"css-inclusion", //
	"scss-inclusion",
	"sass-inclusion",
];

for (const feature of cssFeatures) {
	test(`${feature}`, async ({ page }) => {
		const ghost_white = "rgb(248, 248, 255)";
		const crimson = "rgb(220, 20, 60)";

		await page.goto(`/#${feature}`);
		const locator = page.locator(`#feature-${feature}`);

		await expect(locator).toHaveCSS("background-color", ghost_white);
		await expect(locator).toHaveCSS("color", crimson);
	});
}

const cssModulesFeatures = [
	"css-modules-inclusion",
	"scss-modules-inclusion",
	"sass-modules-inclusion",
];

for (const feature of cssModulesFeatures) {
	test(`${feature}`, async ({ page }) => {
		const darkblue = "rgb(0, 0, 139)";
		const lightblue = "rgb(173, 216, 230)";

		await page.goto(`/#${feature}`);
		const locatorP1 = page.locator(`#feature-${feature} > p:nth-child(1)`);
		const locatorP2 = page.locator(`#feature-${feature} > p:nth-child(2)`);

		await expect(locatorP1).toHaveCSS("background-color", darkblue);
		await expect(locatorP1).toHaveCSS("color", lightblue);
		await expect(locatorP2).toHaveCSS("background-color", darkblue);
		await expect(locatorP2).toHaveCSS("color", lightblue);
	});
}

test("file-env-variables", async ({ page }) => {
	await page.goto("/#file-env-variables");
	const locator1 = page.locator("#feature-file-env-original-1");
	const locator2 = page.locator("#feature-file-env-original-2");
	const locator3 = page.locator("#feature-file-env");
	const locator4 = page.locator("#feature-file-env-x");

	await expect(locator1).toHaveText("REACT_APP_ORIGINAL_1");
	await expect(locator2).toHaveText("REACT_APP_ORIGINAL_2");
	await expect(locator3).toContainText("REACT_APP_DEVELOPMENT");
	await expect(locator3).toContainText("REACT_APP_PRODUCTION");
	await expect(locator4).toHaveText("REACT_APP_X");
});

test("image-inclusion", async ({ page }) => {
	await page.goto("/#image-inclusion");

	const locator = page.locator("#feature-image-inclusion");

	await expect(locator).toHaveJSProperty("complete", true);
	await expect(locator).toHaveJSProperty("naturalWidth", 1);
});

test("json-inclusion", async ({ page }) => {
	await page.goto("/#json-inclusion");

	const locator = page.locator("#feature-json-inclusion");

	await expect(locator).toHaveText("This is an abstract.");
});

test("public-url", async ({ page }) => {
	await page.goto("/#public-url");

	const locator = page.locator("#feature-public-url");

	await expect(locator).toHaveText("/PUBLIC_URL");
});

test("shell-env-variables", async ({ page }) => {
	await page.goto("/#shell-env-variables");

	const locator = page.locator("#feature-shell-env-variables");

	await expect(locator).toHaveText("REACT_APP_SHELL_ENV_MESSAGE");
});

test("svg-inclusion", async ({ page, browserName }) => {
	if (browserName === "firefox") return;

	await page.goto("/#svg-inclusion");

	const locator = page.locator("#feature-svg-inclusion");

	await expect(locator).toHaveJSProperty("complete", true);
	await expect(locator).not.toHaveJSProperty("naturalWidth", 0);
});

test("svg-component", async ({ page }) => {
	await page.goto("/#svg-component");

	const locator = page.locator("#feature-svg-component");

	expect(locator).toBeDefined();
});

test("svg-in-css", async ({ page }) => {
	await page.goto("/#svg-in-css");

	const locator = page.locator("#feature-svg-in-css");

	const backgroundImage = await locator.evaluate(
		(el) => getComputedStyle(el).backgroundImage,
	);

	expect(backgroundImage).toContain("url");
});

test("expand-env-variables", async ({ page }) => {
	await page.goto("/#expand-env-variables");

	const locator1 = page.locator("#feature-expand-env-1");
	const locator2 = page.locator("#feature-expand-env-2");
	const locator3 = page.locator("#feature-expand-env-3");
	const locator4 = page.locator("#feature-expand-env-existing");

	await expect(locator1).toHaveText("REACT_APP_BASIC");
	await expect(locator2).toHaveText("REACT_APP_BASIC");
	await expect(locator3).toHaveText("REACT_APP_BASIC");
	await expect(locator4).toHaveText("REACT_APP_SHELL_ENV_MESSAGE");
});

test("base-url", async ({ page }) => {
	await page.goto("/#base-url");

	const locator = page.locator("#feature-base-url");

	await expect(locator).toHaveText("absoluteLoad");
});

test("proxy-middleware", async ({ page }) => {
	await page.goto("/#proxy-middleware");

	const locator = page.locator("#feature-proxy-middleware");

	await expect(locator).toContainText("body");
});

test("dynamic-import", async ({ page }) => {
	await page.goto("/#dynamic-import");

	const locator = page.locator("#feature-dynamic-import");

	await expect(locator).toHaveText("Hello World!");
});
