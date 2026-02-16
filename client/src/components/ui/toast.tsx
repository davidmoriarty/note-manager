// client/src/lib/toast.tsx
import {
	AlertTriangle,
	CheckCircle,
	Info,
	Loader2,
	XCircle,
} from "lucide-react";
import { toast as sonnerToast } from "sonner";

export type ToastType = "success" | "info" | "warning" | "error" | "loading";

export type ToastOptions = {
	description?: string;
	duration?: number;
	actionLabel?: string;
	onAction?: () => void;
};

const iconMap: Record<ToastType, any> = {
	success: CheckCircle,
	info: Info,
	warning: AlertTriangle,
	error: XCircle,
	loading: Loader2,
};

const styleMap: Record<
	ToastType,
	{ bg: string; text: string; border: string }
> = {
	success: {
		bg: "bg-green-50",
		text: "text-green-800",
		border: "border-green-200",
	},
	info: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
	warning: {
		bg: "bg-yellow-50",
		text: "text-yellow-800",
		border: "border-yellow-200",
	},
	error: { bg: "bg-red-50", text: "text-red-800", border: "border-red-200" },
	loading: {
		bg: "bg-zinc-50",
		text: "text-zinc-800",
		border: "border-zinc-300",
	},
};

export function toastMessage(
	type: ToastType,
	title: string,
	options: ToastOptions = {},
) {
	const Icon = iconMap[type];
	const style = styleMap[type];

	return sonnerToast(title, {
		description: options.description,
		duration: options.duration ?? (type === "loading" ? Infinity : 1500),
		icon: <Icon className="w-5 h-5" />,
		action:
			options.actionLabel && options.onAction
				? {
						label: options.actionLabel,
						onClick: options.onAction,
					}
				: undefined,
		className: `
      ${style.bg}
      ${style.text}
      ${style.border}
      border rounded-lg shadow-sm
    `,
	});
}

// Optional shorthand helpers
export const toast = {
	success: (title: string, options?: ToastOptions) =>
		toastMessage("success", title, options),
	error: (title: string, options?: ToastOptions) =>
		toastMessage("error", title, options),
	info: (title: string, options?: ToastOptions) =>
		toastMessage("info", title, options),
	warning: (title: string, options?: ToastOptions) =>
		toastMessage("warning", title, options),
	loading: (title: string, options?: ToastOptions) =>
		toastMessage("loading", title, options),
};
