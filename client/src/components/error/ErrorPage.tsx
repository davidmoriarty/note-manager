// client/src/components/error/ErrorPage.tsx
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/LinkButton";

interface ErrorPageProps {
  status: number;
  title?: string;
  message?: string;
}

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    const ref = document.referrer;

    try {
      if (ref && new URL(ref).origin === window.location.origin) {
        window.history.back();
        return;
      }
    } catch {
      // ignore parsing errors and fall back
    }

    navigate({ to: "/notes" });
  };

  return (
    <Button variant="secondary" size="md" onClick={handleBack}>
      Go Back
    </Button>
  );
}

export function ErrorPage({ status, title, message }: ErrorPageProps) {
  const defaultMessages: Record<number, { title: string; message: string }> = {
    400: { title: "Bad Request", message: "You made an invalid data request." },
    401: {
      title: "Unauthorized",
      message: "You need to log in to access this page.",
    },
    403: {
      title: "Forbidden",
      message: "You do not have permission to access this page.",
    },
    404: {
      title: "Not Found",
      message: "The page you are looking for does not exist.",
    },
    500: {
      title: "Internal Server Error",
      message: "Something went wrong on our end.",
    },
  };

  const defaults = defaultMessages[status] ?? {
    title: "Error",
    message: "An unexpected error occurred.",
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center space-y-5 text-center">
      <h1 className="text-8xl font-extrabold text-center">{status}</h1>
      <h2 className="text-xl font-bold text-center">
        {title ?? defaults.title}
      </h2>
      <p className="text-lg text-center mb-6">{message ?? defaults.message}</p>

      <div className="flex gap-4">
        <BackButton />

        {status === 401 && (
          <LinkButton to="/login" variant="secondary" size="md">
            Go to Login
          </LinkButton>
        )}
      </div>
    </div>
  );
}
