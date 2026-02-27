// @/components/notes/NotesPreview.tsx
import { MarkdownRenderer } from "@/components/notes/MarkdownRenderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type NotesPreviewProps = {
  title?: string;
  content: string;
};

export function NotesPreview({ title, content }: NotesPreviewProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="pb-2 pl-1 font-medium text-sm">Note Preview</div>

      <Card
        className={cn(
          `
          flex-1 min-h-0 bg-gray-50 dark:bg-gray-600 border-gray-300 dark:border-gray-700 flex flex-col
          `,
        )}
      >
        <CardHeader className="shrink-0">
          <CardTitle className="prose dark:prose-invert max-w-none">
            {title || "Untitled Note"}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 overflow-auto text-left max-w-none">
          <MarkdownRenderer content={content || "Untitled note content"} />
        </CardContent>
      </Card>
    </div>
  );
}
