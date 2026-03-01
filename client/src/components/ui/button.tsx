import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded text-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				primary: "bg-foreground text-background",
				secondary: "bg-secondary text-secondary-foreground",
				gray: "bg-gray-400 text-white",
				zinc: "bg-zinc-400 text-white",
				neutral: "bg-neutral-400 text-white",
				stone: "bg-stone-400 text-white",
				blue: "bg-blue-400 text-white",
				sky: "bg-sky-500 text-white hover:bg-sky-400",
				cyan: "bg-cyan-400 text-white",
				lime: "bg-lime-400 text-white",
				teal: "bg-teal-400 text-white",
				green: "bg-green-400 text-white",
				emerald: "bg-emerald-400 text-white",
				yellow: "bg-yellow-400 text-white",
				amber: "bg-amber-400 text-white",
				orange: "bg-orange-400 text-white",
				pink: "bg-pink-400 text-white",
				rose: "bg-rose-500 text-white",
				red: "bg-red-500 hover:bg-red-600 dark:bg-red-700 text-white",
				fuchsia: "bg-fuchsia-500 text-white",
				indigo: "bg-indigo-600 text-white",
				violet: "bg-violet-700 text-white",
				purple: "bg-purple-700 text-white",
				destructive:
					"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
				ghost:
					"hover:border hover:border-slate-300 dark:hover:border dark:border-slate-700",
				link: "text-primary underline-offset-4 hover:underline",
			},
      size: {
        xs: "h-6 rounded-md gap-1 px-2 has-[>svg]:px-1.75",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				md: "h-9 px-4 py-2 has-[>svg]:px-3",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				xl: "h12 rounded-md px-12 py-4",
				icon: "size-9",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
