import React from "react";
import { ReactComponent as Logo } from "./assets/logo.svg";

export const SvgComponent = () => {
	return <Logo id="feature-svg-component" />;
};

export const SvgComponentWithRef = React.forwardRef<SVGSVGElement>(
	(_props, ref) => <Logo id="feature-svg-component-with-ref" ref={ref} />,
);
