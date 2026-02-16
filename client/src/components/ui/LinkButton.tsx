import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

type LinkButtonProps = {
	variant: any;
	size: any;
	className?: string;
	to: string;
	children: string;
};

export function LinkButton({
	variant,
	size,
	className,
	to,
	children,
}: LinkButtonProps) {
	return (
		<Button variant={variant} size={size} className={className} asChild>
			<Link to={to}>{children}</Link>
		</Button>
	);
}
