import React from "react";
import styles from "./assets/style.module.css";
import indexStyles from "./assets/index.module.css";

export const CssModulesInclusion = () => (
	<div>
		<p className={styles.cssModulesInclusion}>CSS Modules are working!</p>
		<p className={indexStyles.cssModulesInclusion}>
			CSS Modules with index are working!
		</p>
	</div>
);
