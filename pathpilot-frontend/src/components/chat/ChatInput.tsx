import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Mic, Square, Sparkles, X, FileText, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
  onStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

interface AttachedFile {
  name: string;
  text: string;
}

const ACCEPTED = '.txt,.md,.pdf,.doc,.docx';

async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'txt' || ext === 'md') {
    return await file.text();
  }

  if (ext === 'pdf') {
    // npm install pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return text.trim();
  }

  if (ext === 'doc' || ext === 'docx') {
    // npm install mammoth
    const mammoth = await import('mammoth');
    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value.trim();
  }

  throw new Error(`Unsupported file type: .${ext}`);
}

export function ChatInput({
  onSend,
  isStreaming,
  onStop,
  disabled = false,
  placeholder = 'Ask about your career, skills, resume, or anything...',
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 180) + 'px';
  }, [value]);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    setParseError(null);
    setIsParsing(true);
    try {
      const text = await extractTextFromFile(file);
      setAttachedFile({ name: file.name, text });
    } catch (err) {
      setParseError(
        err instanceof Error ? err.message : 'Could not read that file.'
      );
      setAttachedFile(null);
    } finally {
      setIsParsing(false);
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    setParseError(null);
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (isStreaming || disabled || isParsing) return;
    if (!trimmed && !attachedFile) return;

    let finalMessage = trimmed;
    if (attachedFile) {
      const label = trimmed || 'Please review this document.';
      finalMessage = `${label}\n\n[Attached file: ${attachedFile.name}]\n${attachedFile.text}`;
    }

    onSend(finalMessage);
    setValue('');
    setAttachedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend =
    (value.trim().length > 0 || !!attachedFile) && !isStreaming && !disabled && !isParsing;

  return (
    <div className="relative">
      {/* Gradient glow behind input */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/20 via-violet-500/20 to-primary/20 opacity-0 focus-within:opacity-100 transition-opacity duration-300 blur-sm" />

      <div className="relative glass rounded-2xl border border-border/60 focus-within:border-primary/40 transition-colors duration-200">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Attached file chip / parse error */}
        {(attachedFile || isParsing || parseError) && (
          <div className="flex items-center gap-2 px-4 pt-3">
            {isParsing && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/60 rounded-lg px-2.5 py-1.5">
                <Loader2 size={13} className="animate-spin" />
                Reading file...
              </div>
            )}
            {attachedFile && !isParsing && (
              <div className="flex items-center gap-2 text-xs text-foreground bg-accent/60 rounded-lg px-2.5 py-1.5">
                <FileText size={13} className="text-primary" />
                <span className="max-w-[200px] truncate">{attachedFile.name}</span>
                <button
                  onClick={removeAttachment}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remove attached file"
                >
                  <X size={13} />
                </button>
              </div>
            )}
            {parseError && !isParsing && (
              <div className="text-xs text-destructive bg-destructive/10 rounded-lg px-2.5 py-1.5">
                {parseError}
              </div>
            )}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            'w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-foreground placeholder:text-muted-foreground/50',
            'focus:outline-none disabled:opacity-50',
            'max-h-[180px] leading-relaxed'
          )}
          aria-label="Chat input"
          id="chat-input"
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-3 pb-3">
          {/* Left: hints */}
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent transition-colors"
              title="Attach resume or document"
              aria-label="Attach file"
              onClick={handleAttachClick}
              disabled={disabled || isStreaming}
            >
              <Paperclip size={15} />
            </button>
            <button
              className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent transition-colors"
              title="Voice input (coming soon)"
              aria-label="Voice input"
              disabled
            >
              <Mic size={15} />
            </button>
            <span className="text-xs text-muted-foreground/30 ml-2 hidden sm:block">
              Shift+Enter for new line
            </span>
          </div>

          {/* Right: send / stop */}
          <div className="flex items-center gap-2">
            {isStreaming ? (
              <Button
                size="icon-sm"
                variant="outline"
                onClick={onStop}
                className="rounded-lg border-destructive/40 text-destructive hover:bg-destructive/10"
                aria-label="Stop generation"
              >
                <Square size={12} fill="currentColor" />
              </Button>
            ) : (
              <motion.div
                initial={false}
                animate={{ scale: canSend ? 1 : 0.9, opacity: canSend ? 1 : 0.4 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  size="icon-sm"
                  onClick={handleSubmit}
                  disabled={!canSend}
                  className="rounded-lg bg-primary hover:bg-primary/90 shadow-glow-sm"
                  aria-label="Send message"
                >
                  <Send size={13} />
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        {/* AI hint badge */}
        {!value && !isStreaming && !attachedFile && (
          <div className="absolute top-3.5 right-14 flex items-center gap-1 text-muted-foreground/30 pointer-events-none">
            <Sparkles size={11} />
            <span className="text-xs">AI-powered</span>
          </div>
        )}
      </div>
    </div>
  );
}
