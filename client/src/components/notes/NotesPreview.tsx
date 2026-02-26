// @/components/notes/NotesPreview.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type NotesPreviewProps = {
  title?: string;
  content: string;
};

export function NotesPreview({ title, content }: NotesPreviewProps) {
  return (
    <>
      <div className="pb-2 pl-1 font-medium text-sm">
        <span>Note Preview</span>
      </div>
      <Card className="min-h-[45vh] bg-gray-50 dark:bg-gray-600 border-gray-300 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="prose dark:prose-invert max-w-none">
            {title || "Untitled Note"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-left prose-sm dark:prose-invert max-w-none overflow-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content || "Untitled note content"}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </>
  );
}
