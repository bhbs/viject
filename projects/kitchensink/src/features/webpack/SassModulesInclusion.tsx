import indexStyles from "./assets/index.module.sass";
import styles from "./assets/sass-styles.module.sass";

export const SassModulesInclusion = () => (
	<div id="feature-sass-modules-inclusion">
		<p className={styles.sassModulesInclusion}>SASS Modules are working!</p>
		<p className={indexStyles.sassModulesIndexInclusion}>
			SASS Modules with index are working!
		</p>
	</div>
);
