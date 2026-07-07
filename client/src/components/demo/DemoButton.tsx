// client/src/components/demo/DemoButton.tsx

import { Button, type ButtonProps } from "@/components/ui/button";

type DemoButtonProps = {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  label?: string;
  loadingLabel?: string;
  size?: ButtonProps["size"];
  className?: string;
};

export function DemoButton({
  loading,
  disabled,
  onClick,
  label = "Try Demo",
  loadingLabel = "Starting Demo...",
  size = "lg",
  className,
}: DemoButtonProps) {
  return (
    <Button
      type="button"
      variant="sky"
      size={size}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? loadingLabel : label}
    </Button>
  );
}
