import { expect, test } from "@playwright/test";

const features = [
	"css-inclusion",
	"css-modules-inclusion",
	"scss-inclusion",
	"scss-modules-inclusion",
	"sass-inclusion",
	"sass-modules-inclusion",
	"file-env-variables",
	"image-inclusion",
	"json-inclusion",
	"public-url",
	"shell-env-variables",
	"svg-inclusion",
	"svg-component",
	"svg-in-css",
	"expand-env-variables",
	"base-url",
	"proxy-middleware",
	"dynamic-import",
];

for (const feature of features) {
	test(`feature: ${feature}`, async ({ page }) => {
		await page.goto(`/#${feature}`);
		const locator = page.locator(`#feature-${feature}`);
		await expect(locator).toBeVisible();
	});
}
