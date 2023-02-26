import{_ as e,c as i,o as a,a as t}from"./app.03a8c900.js";const _=JSON.parse('{"title":"Viject ⚡","description":"","frontmatter":{},"headers":[{"level":2,"title":"Usage","slug":"usage","link":"#usage","children":[]},{"level":2,"title":"How it works","slug":"how-it-works","link":"#how-it-works","children":[]},{"level":2,"title":"Supported features","slug":"supported-features","link":"#supported-features","children":[{"level":3,"title":"Styles and Assets","slug":"styles-and-assets","link":"#styles-and-assets","children":[]},{"level":3,"title":"Build","slug":"build","link":"#build","children":[]},{"level":3,"title":"Testing","slug":"testing","link":"#testing","children":[]},{"level":3,"title":"Back-End Integration","slug":"back-end-integration","link":"#back-end-integration","children":[]},{"level":3,"title":"Advanced Configuration","slug":"advanced-configuration","link":"#advanced-configuration","children":[]}]},{"level":2,"title":"Contribution","slug":"contribution","link":"#contribution","children":[]},{"level":2,"title":"License","slug":"license","link":"#license","children":[]}],"relativePath":"index.md"}'),l={name:"index.md"},s=t(`<h1 id="viject-⚡" tabindex="-1">Viject ⚡ <a class="header-anchor" href="#viject-⚡" aria-hidden="true">#</a></h1><blockquote><p>A tool for migrating your React app from react-scripts (Create React App) to Vite</p></blockquote><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-hidden="true">#</a></h2><a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/viject" alt="node compatibility"></a><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-theme-palenight" tabindex="0"><code><span class="line"><span style="color:#82AAFF;">cd</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&lt;</span><span style="color:#C3E88D;">YOUR_AP</span><span style="color:#A6ACCD;">P</span><span style="color:#89DDFF;">&gt;</span></span>
<span class="line"><span style="color:#FFCB6B;">npx</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">viject</span></span>
<span class="line"></span></code></pre></div><h2 id="how-it-works" tabindex="-1">How it works <a class="header-anchor" href="#how-it-works" aria-hidden="true">#</a></h2><ol><li>Remove <code>react-scripts</code> from <code>package.json</code></li><li>Rewrite npm scripts and dependencies for Vite</li><li>Remove <code>react-scripts</code> from <code>react-app-env.d.ts</code></li><li>Rewrite <code>react-app-env.d.ts</code> for CRA compatibility</li><li>Add <code>vite.config.ts</code></li><li>Add <code>index.html</code></li><li>Transform <code>.js</code> files including JSX into <code>.jsx</code></li></ol><h2 id="supported-features" tabindex="-1">Supported features <a class="header-anchor" href="#supported-features" aria-hidden="true">#</a></h2><ul><li>[x] Using HTTPS in Development</li></ul><h3 id="styles-and-assets" tabindex="-1">Styles and Assets <a class="header-anchor" href="#styles-and-assets" aria-hidden="true">#</a></h3><ul><li>[x] Adding a Stylesheet</li><li>[x] Adding a CSS Modules Stylesheet</li><li>[x] Adding a Sass Stylesheet</li><li>[ ] Adding a CSS Reset (<a href="https://create-react-app.dev/docs/adding-css-reset" target="_blank" rel="noreferrer">https://create-react-app.dev/docs/adding-css-reset</a>)</li><li>[x] Post-Processing CSS</li><li>[x] Adding Images, Fonts, and Files</li><li>[ ] Loading .graphql Files (<a href="https://create-react-app.dev/docs/loading-graphql-files" target="_blank" rel="noreferrer">https://create-react-app.dev/docs/loading-graphql-files</a>)</li><li>[x] Using the Public Folder</li><li>[x] Code Splitting</li></ul><h3 id="build" tabindex="-1">Build <a class="header-anchor" href="#build" aria-hidden="true">#</a></h3><ul><li>[x] Adding Bootstrap</li><li>[ ] Adding Flow (<a href="https://create-react-app.dev/docs/adding-flow" target="_blank" rel="noreferrer">https://create-react-app.dev/docs/adding-flow</a>)</li><li>[x] Adding TypeScript</li><li>[ ] Adding Relay (<a href="https://create-react-app.dev/docs/adding-relay" target="_blank" rel="noreferrer">https://create-react-app.dev/docs/adding-relay</a>)</li><li>[x] Adding a Router</li><li>[x] Adding Custom Environment Variables</li><li>[ ] Making a Progressive Web App</li><li>[x] Measuring Performance</li><li>[x] Creating a Production Build (<a href="https://create-react-app.dev/docs/production-build" target="_blank" rel="noreferrer">https://create-react-app.dev/docs/production-build</a>)</li></ul><h3 id="testing" tabindex="-1">Testing <a class="header-anchor" href="#testing" aria-hidden="true">#</a></h3><ul><li>[x] Running Tests</li><li>[ ] <s>Debugging Tests (<a href="https://create-react-app.dev/docs/debugging-tests" target="_blank" rel="noreferrer">https://create-react-app.dev/docs/debugging-tests</a>)</s></li></ul><h3 id="back-end-integration" tabindex="-1">Back-End Integration <a class="header-anchor" href="#back-end-integration" aria-hidden="true">#</a></h3><ul><li>[x] Proxying API Requests in Development (<a href="https://create-react-app.dev/docs/proxying-api-requests-in-development" target="_blank" rel="noreferrer">https://create-react-app.dev/docs/proxying-api-requests-in-development</a>)</li><li>[x] Fetching Data with AJAX Requests</li></ul><h3 id="advanced-configuration" tabindex="-1">Advanced Configuration <a class="header-anchor" href="#advanced-configuration" aria-hidden="true">#</a></h3><p><a href="https://create-react-app.dev/docs/advanced-configuration" target="_blank" rel="noreferrer">https://create-react-app.dev/docs/advanced-configuration</a></p><ul><li>[x] BROWSER</li><li>[ ] BROWSER_ARGS</li><li>[x] HOST</li><li>[x] PORT</li><li>[x] HTTPS</li><li>[ ] <s>WDS_SOCKET_HOST</s></li><li>[ ] <s>WDS_SOCKET_PATH</s></li><li>[ ] <s>WDS_SOCKET_PORT</s></li><li>[x] PUBLIC_URL</li><li>[x] BUILD_PATH</li><li>[ ] <s>CI</s></li><li>[ ] <s>REACT_EDITOR</s></li><li>[ ] <s>CHOKIDAR_USEPOLLING</s></li><li>[x] GENERATE_SOURCEMAP</li><li>[ ] INLINE_RUNTIME_CHUNK</li><li>[ ] IMAGE_INLINE_SIZE_LIMIT</li><li>[ ] <s>FAST_REFRESH</s></li><li>[ ] TSC_COMPILE_ON_ERROR</li><li>[ ] ESLINT_NO_DEV_ERRORS</li><li>[ ] DISABLE_ESLINT_PLUGIN</li><li>[ ] <s>DISABLE_NEW_JSX_TRANSFORM</s></li></ul><h2 id="contribution" tabindex="-1">Contribution <a class="header-anchor" href="#contribution" aria-hidden="true">#</a></h2><p>See <a href="https://github.com/bhbs/viject/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer">Contributing Guide</a></p><h2 id="license" tabindex="-1">License <a class="header-anchor" href="#license" aria-hidden="true">#</a></h2><p>MIT</p>`,24),r=[s];function n(d,o,c,p,h,g){return a(),i("div",null,r)}const f=e(l,[["render",n]]);export{_ as __pageData,f as default};
