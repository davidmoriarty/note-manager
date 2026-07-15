// client/src/components/demo/DemoWelcomeDialog.tsx

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DemoFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type DemoWelcomeDialogProps = {
  open: boolean;
  appName: string;
  description: string;
  features: readonly DemoFeature[];
  notice: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
};

export function DemoWelcomeDialog({
  open,
  appName,
  description,
  features,
  notice,
  primaryLabel = "Start exploring",
  secondaryLabel = "Create an account",
  onPrimary,
  onSecondary,
}: DemoWelcomeDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-lg"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Welcome to the {appName} demo</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-2.5">
                <Icon className="mt-0.5 size-4 shrink-0 text-sky-500" />

                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-sm leading-snug text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Note:</span>{" "}
            {notice}
          </p>
        </div>

        <DialogFooter className="gap-2">
          {onSecondary && (
            <Button type="button" variant="outline" onClick={onSecondary}>
              {secondaryLabel}
            </Button>
          )}

          <Button type="button" variant="primary" onClick={onPrimary}>
            {primaryLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
