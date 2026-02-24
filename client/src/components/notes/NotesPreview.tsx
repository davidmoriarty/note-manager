// @/components/notes/NotesPreview.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type NotesPreviewProps = {
  title?: string;
  content: string;
};

export function NotesPreview({ title, content }: NotesPreviewProps) {
  return (
    <Card className="bg-gray-50 dark:bg-gray-600 border-gray-50 dark:border-gray-700 w-full">
      <CardHeader>
        <CardTitle className="prose dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {title || "Untitled Note"}
          </ReactMarkdown>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-left prose dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content || "Untitled note content"}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
}
