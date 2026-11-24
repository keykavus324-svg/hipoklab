import React from 'react';

/* ---------------------------------------------------------------------------
   Hafif Markdown İşleme (dış bağımlılık olmadan)
   - **kalın**, *italik*, `kod`, başlıklar (# ## ###), listeler (-, 1.),
     alıntı (>), yatay çizgi (---)
--------------------------------------------------------------------------- */

function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Kalın, italik ve kod kalıplarını sırayla ayrıştır
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(<strong key={`b${key++}`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      nodes.push(<code key={`c${key++}`}>{token.slice(1, -1)}</code>);
    } else {
      nodes.push(<em key={`i${key++}`}>{token.slice(1, -1)}</em>);
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function MarkdownPreview({ text }: { text: string }): JSX.Element {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const elements: React.ReactNode[] = [];
  let listBuffer: { ordered: boolean; items: string[] } | null = null;
  let key = 0;

  const flushList = () => {
    if (listBuffer && listBuffer.items.length > 0) {
      const Tag = listBuffer.ordered ? 'ol' : 'ul';
      elements.push(
        <Tag key={`l${key++}`}>
          {listBuffer.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </Tag>,
      );
    }
    listBuffer = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^#{3}\s+/.test(trimmed)) {
      flushList();
      elements.push(<h3 key={`h${key++}`}>{renderInline(trimmed.replace(/^#{3}\s+/, ''))}</h3>);
    } else if (/^#{2}\s+/.test(trimmed)) {
      flushList();
      elements.push(<h2 key={`h${key++}`}>{renderInline(trimmed.replace(/^#{2}\s+/, ''))}</h2>);
    } else if (/^#{1}\s+/.test(trimmed)) {
      flushList();
      elements.push(<h1 key={`h${key++}`}>{renderInline(trimmed.replace(/^#{1}\s+/, ''))}</h1>);
    } else if (trimmed === '---' || trimmed === '***') {
      flushList();
      elements.push(<hr key={`r${key++}`} />);
    } else if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(<blockquote key={`q${key++}`}>{renderInline(trimmed.slice(2))}</blockquote>);
    } else if (/^[-*]\s+/.test(trimmed)) {
      if (!listBuffer || listBuffer.ordered) {
        flushList();
        listBuffer = { ordered: false, items: [] };
      }
      listBuffer.items.push(trimmed.replace(/^[-*]\s+/, ''));
    } else if (/^\d+\.\s+/.test(trimmed)) {
      if (!listBuffer || !listBuffer.ordered) {
        flushList();
        listBuffer = { ordered: true, items: [] };
      }
      listBuffer.items.push(trimmed.replace(/^\d+\.\s+/, ''));
    } else if (trimmed === '') {
      flushList();
    } else {
      flushList();
      elements.push(<p key={`p${key++}`}>{renderInline(trimmed)}</p>);
    }
  }
  flushList();
  return <div className="md-preview">{elements}</div>;
}

/** Düz metni (paragraf içi) zenginleştirerek render eder. */
export function RichText({ text }: { text: string }): JSX.Element {
  return <>{renderInline(text)}</>;
}
