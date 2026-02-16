import { useNavigate } from "@tanstack/react-router";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 *
 * Tailwind helper (existing)
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Type-safe navigation helper for routes
 * with optional search params.
 *
 * Usage:
 *  nav('/login'),
 *  nav('/register'),
 *  nav('/profile')
 */
export function useNav() {
	const navigate = useNavigate();
	return {
		to: (
			to: string,
			options?: {
				search?: Record<string, string>;
				replace?: boolean;
			},
		) => {
			navigate({
				to,
				search: options?.search,
				replace: options?.replace,
			});
		},
	};
}
