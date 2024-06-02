import React from "react";
import styles from "./assets/style.module.css";
import indexStyles from "./assets/index.module.css";

export const CssModulesInclusion = () => (
	<div id="feature-css-modules-inclusion">
		<p className={styles.cssModulesInclusion}>CSS Modules are working!</p>
		<p className={indexStyles.cssModulesIndexInclusion}>
			CSS Modules with index are working!
		</p>
	</div>
);
