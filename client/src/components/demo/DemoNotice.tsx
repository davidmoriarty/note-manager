// client/src/components/demo/DemoNotice.tsx

import { X } from "lucide-react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type DemoNoticeProps = {
  open: boolean;
  onDismiss: () => void;
  title?: string;
  description?: string;
};

export function DemoNotice({
  open,
  onDismiss,
  title = "Demo mode",
  description = "This is a temporary demo workspace. Please don't enter sensitive information.",
}: DemoNoticeProps) {
  if (!open) return null;

  return (
    <Alert tone="info" className="max-w-md">
      <AlertTitle className="font-bold text-lg">{title}</AlertTitle>
      <AlertDescription className="font-medium">{description}</AlertDescription>
      <AlertAction>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          aria-label="Dismiss demo notice"
          className="h-7 w-7"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertAction>
    </Alert>
  );
}
