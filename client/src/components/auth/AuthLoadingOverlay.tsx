// client/src/components/auth/AuthLoadingOverlay.tsx

import { Check, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type AuthLoadingOverlayProps = {
  open: boolean;
  title: string;
  steps: readonly string[];
  onComplete?: () => void;
};

export function AuthLoadingOverlay({
  open,
  title,
  steps,
  onComplete,
}: AuthLoadingOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      return;
    }

    setCurrentStep(0);

    const timers: ReturnType<typeof setTimeout>[] = [];

    steps.forEach((_, index) => {
      timers.push(
        setTimeout(
          () => {
            setCurrentStep(index + 1);
          },
          550 * (index + 1),
        ),
      );
    });

    timers.push(
      setTimeout(
        () => {
          onCompleteRef.current?.();
        },
        550 * steps.length + 1000,
      ),
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [open, steps]);

  if (!open) return null;

  const finalStepIndex = steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background px-4 transition-opacity duration-300">
      <div className="flex w-full max-w-xl flex-col items-center gap-10 px-6">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>

        <div className="w-full max-w-md space-y-4">
          {steps.map((step, index) => {
            const isFinalStep = index === finalStepIndex;
            const completed = !isFinalStep && index < currentStep;
            const active =
              index === currentStep || (isFinalStep && currentStep >= index);

            return (
              <div key={step} className="flex items-center gap-3">
                {completed ? (
                  <Check className="h-5 w-5 text-emerald-500" />
                ) : active ? (
                  <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
                ) : (
                  <div className="h-5 w-5 rounded-full border" />
                )}

                <span
                  className={
                    completed || active
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
