// // client/src/components/auth/UserForm.tsx
// import { type AnyFormApi, useForm } from "@tanstack/react-form";
// import type { ReactNode } from "react";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { toastMessage } from "@/components/ui/toast";

// type FormValues = Record<string, unknown>;

// type UserFormProps = {
// 	schema: z.ZodType;
// 	defaultValues: FormValues;
// 	onSubmit: (values: FormValues) => Promise<void> | void;
// 	submitText: string;
// 	children: (form: AnyFormApi) => ReactNode;
// };

// export function UserForm({
// 	schema,
// 	defaultValues,
// 	onSubmit,
// 	submitText,
// 	children,
// }: UserFormProps) {
// 	const form = useForm({
// 		defaultValues,
// 		validators: {
// 			onSubmit: async ({ value }) => {
// 				const result = schema.safeParse(value);
// 				if (result.success) return;

// 				const fieldErrors: Record<string, string[]> = {};

// 				// Field-level errors
// 				const tree = z.treeifyError(result.error);
// 				if (
// 					tree &&
// 					typeof tree === "object" &&
// 					"properties" in tree &&
// 					tree.properties
// 				) {
// 					const properties = tree.properties as Record<
// 						string,
// 						{ errors?: string[] }
// 					>;
// 					for (const [key, node] of Object.entries(properties)) {
// 						if (node?.errors?.length) {
// 							fieldErrors[key] = node.errors;
// 						}
// 					}
// 				}
// 				if (
// 					"formErrors" in result.error &&
// 					Array.isArray(result.error.formErrors)
// 				) {
// 					// Form-level errors (global errors)
// 					fieldErrors._form = result.error.formErrors;
// 				}

// 				return fieldErrors;
// 			},
// 		},
// 		onSubmit: async ({ value }) => {
// 			try {
// 				await onSubmit(value);
// 			} catch (err: any) {
// 				toastMessage("error", "Submission failed", {
// 					description: err.message,
// 				});
// 			}
// 		},
// 	});

// 	return (
// 		<form
// 			onSubmit={(e) => {
// 				e.preventDefault();
// 				e.stopPropagation();
// 				void form.handleSubmit();
// 			}}
// 			className="space-y-8"
// 		>
// 			{children(form)}

// 			<form.Subscribe
// 				selector={(state) => [state.canSubmit, state.isSubmitting]}
// 			>
// 				{([canSubmit, isSubmitting]) => (
// 					<Button
// 						type="submit"
// 						variant="sky"
// 						size="lg"
// 						className="w-full py-6 mt-2"
// 						disabled={!canSubmit}
// 					>
// 						{isSubmitting ? "Submitting..." : submitText}
// 					</Button>
// 				)}
// 			</form.Subscribe>
// 		</form>
// 	);
// }
