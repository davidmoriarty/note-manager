// client/src/components/notes/MarkdownRenderer.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { stripHtmlOutsideCodeFences } from "@/lib/note-preview";
import { cn } from "@/lib/utils";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  const clean = stripHtmlOutsideCodeFences(content || "");

  return (
    <div
      className={cn(
        `
          prose prose-sm dark:prose-invert max-w-none
          prose-ul:list-disc prose-ol:list-decimal
          prose-ul:list-outside prose-ol:list-outside
          prose-ul:pl-5 prose-ol:pl-5
          prose-li:my-1 prose-li:marker:text-foreground
          prose-code:before:content-none prose-code:after:content-none
          prose-pre:my-4
          `,
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code: ({ className, children, ...props }) => {
            const isFencedBlock = Boolean(className);

            if (!isFencedBlock) {
              return (
                <code
                  className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },

          pre: ({ children, ...props }) => (
            <pre
              className="my-4 overflow-x-auto rounded-md border bg-muted p-3 text-sm leading-relaxed"
              {...props}
            >
              {children}
            </pre>
          ),
        }}
      >
        {clean}
      </ReactMarkdown>
    </div>
  );
}
