import indexStyles from "./assets/index.module.scss";
import styles from "./assets/scss-styles.module.scss";

export const ScssModulesInclusion = () => (
	<div id="feature-scss-modules-inclusion">
		<p className={styles.scssModulesInclusion}>SCSS Modules are working!</p>
		<p className={indexStyles.scssModulesIndexInclusion}>
			SCSS Modules with index are working!
		</p>
	</div>
);
