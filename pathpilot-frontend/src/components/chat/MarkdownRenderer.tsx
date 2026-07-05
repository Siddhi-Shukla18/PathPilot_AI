import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { copyToClipboard } from '../../utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      className={`prose prose-invert prose-sm max-w-none ${className}`}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code(props) {
          const { children, className, ...rest } = props;
          const match = /language-(\w+)/.exec(className || '');
          const codeString = String(children).replace(/\n$/, '');

          if (match) {
            return (
              <CodeBlock language={match[1]} code={codeString} />
            );
          }

          return (
            <code
              className="rounded-md bg-muted/80 px-1.5 py-0.5 text-xs font-mono text-foreground/90 border border-border/40"
              {...rest}
            >
              {children}
            </code>
          );
        },
        pre({ children }) {
          return <>{children}</>;
        },
        table({ children }) {
          return (
            <div className="my-4 overflow-x-auto rounded-xl border border-border/60">
              <table className="w-full text-sm">{children}</table>
            </div>
          );
        },
        th({ children }) {
          return (
            <th className="border-b border-border/60 bg-muted/50 px-4 py-2.5 text-left font-semibold text-foreground/80">
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="border-b border-border/40 px-4 py-2.5 text-foreground/70">
              {children}
            </td>
          );
        },
        tr({ children }) {
          return <tr className="hover:bg-muted/30 transition-colors">{children}</tr>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="my-3 border-l-4 border-primary/40 pl-4 text-muted-foreground italic">
              {children}
            </blockquote>
          );
        },
        ul({ children }) {
          return <ul className="my-3 ml-4 space-y-1.5 list-disc marker:text-primary/60">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="my-3 ml-4 space-y-1.5 list-decimal marker:text-primary/60">{children}</ol>;
        },
        li({ children }) {
          return <li className="text-foreground/80 leading-relaxed">{children}</li>;
        },
        h1({ children }) {
          return <h1 className="mt-6 mb-3 text-xl font-bold text-foreground">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="mt-5 mb-2.5 text-lg font-semibold text-foreground">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="mt-4 mb-2 text-base font-semibold text-foreground/90">{children}</h3>;
        },
        p({ children }) {
          return <p className="my-2 leading-relaxed text-foreground/80">{children}</p>;
        },
        a({ children, href }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-2 hover:underline transition-colors"
            >
              {children}
            </a>
          );
        },
        hr() {
          return <hr className="my-4 border-border/40" />;
        },
        strong({ children }) {
          return <strong className="font-semibold text-foreground">{children}</strong>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

interface CodeBlockProps {
  language: string;
  code: string;
}

function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-border/60">
      {/* Header */}
      <div className="flex items-center justify-between bg-muted/60 px-4 py-2 border-b border-border/40">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md px-2 py-1 hover:bg-accent"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code */}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: 'hsl(224 18% 10%)',
          fontSize: '0.8125rem',
          lineHeight: '1.6',
          padding: '1rem 1.25rem',
        }}
        showLineNumbers
        lineNumberStyle={{ color: 'hsl(215 20% 35%)', minWidth: '2.5em' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
