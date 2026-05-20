import { type ReactNode } from 'react';

/** Removes `**bold**` markers — used where rich text is intentionally disabled. */
export function stripBoldMarkers(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1');
}

/** Parses `**bold**` markers into `<strong>` — safe for trusted copy only. */
export function parseRichText(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  const pattern = /\*\*([^*]+)\*\*/g;
  pattern.lastIndex = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={key++} className="font-semibold text-mk-text">
        {match[1]}
      </strong>,
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length ? parts : [text];
}

interface RichTextProps {
  children: string;
  className?: string;
  as?: 'span' | 'p';
}

export function RichText({ children, className, as: Tag = 'span' }: RichTextProps) {
  if (!children.includes('**')) {
    return <Tag className={className}>{children}</Tag>;
  }
  return <Tag className={className}>{parseRichText(children)}</Tag>;
}

interface RichParagraphsProps {
  text: string;
  className?: string;
  paragraphClassName?: string;
}

/** Splits on blank lines and renders each paragraph with inline bold support. */
export function RichParagraphs({ text, className, paragraphClassName }: RichParagraphsProps) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim());
  return (
    <div className={className}>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={paragraphClassName}>
          {parseRichText(paragraph.replace(/\n/g, ' '))}
        </p>
      ))}
    </div>
  );
}
