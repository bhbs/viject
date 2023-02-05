import React from "react";
import styles from "./assets/sass-styles.module.sass";
import indexStyles from "./assets/index.module.sass";

export const SassModulesInclusion = () => (
	<div>
		<p className={styles.sassModulesInclusion}>SASS Modules are working!</p>
		<p className={indexStyles.sassModulesIndexInclusion}>
			SASS Modules with index are working!
		</p>
	</div>
);
