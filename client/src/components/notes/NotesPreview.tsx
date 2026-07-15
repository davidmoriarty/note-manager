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
    <div className="flex min-h-[30vh] flex-col md:min-h-[50vh]">
      <Card
        className={cn(
          "flex min-h-0 flex-1 flex-col border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-600",
        )}
      >
        <CardHeader className="shrink-0">
          <CardTitle className="prose max-w-none dark:prose-invert">
            {title || ""}
          </CardTitle>
        </CardHeader>

        <CardContent className="min-h-0 flex-1 max-w-none overflow-auto text-left">
          <MarkdownRenderer content={content} />
        </CardContent>
      </Card>
    </div>
  );
}
