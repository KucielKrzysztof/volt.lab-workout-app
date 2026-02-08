import Image from "next/image";
import React from "react";

export const Logo = (): React.JSX.Element => {
	return (
		<div className="bg-primary relative w-25 h-25  overflow-hidden rounded-full shadow-lg shadow-primary/20">
			<Image src="/logos/logo-1.png" alt="volt.lab-logo" fill className="object-contain p-5 dark:invert transition-all duration-300" sizes="100px" />
		</div>
	);
};
