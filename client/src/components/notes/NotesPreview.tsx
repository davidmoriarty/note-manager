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
    <Card className="bg-white text-black dark:bg-gray-300 dark:text-gray-900 w-full min-h-[50vh] max-w-4xl mx-auto p-8">
      <CardHeader>
        <CardTitle className="text-4xl tracking-tight leading-relaxed">
          {title || "Untitled Note"}
        </CardTitle>
      </CardHeader>
      <CardContent className="max-w-[50ch] mx-auto text-justify">
        {content ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        ) : (
          <p className="text-lg font-medium tracking-wide leading-relaxed">
            Nothing to preview
          </p>
        )}
      </CardContent>
    </Card>
  );
}
