import React from 'react';

interface RenderRichTextProps {
  content: string;
  className?: string;
}

// Unified styling configuration for both SSR and CSR
const HTML_ELEMENT_STYLES = {
  h1: 'text-display-1 font-bold text-neutral-950 mt-12 mb-6',
  h2: 'text-display-3 font-bold text-neutral-950 mt-12 mb-6',
  h3: 'text-xl font-bold text-neutral-950 mb-2',
  h4: 'text-lg font-bold text-neutral-950 mb-2',
  h5: 'text-base font-bold text-neutral-950 mb-2',
  h6: 'text-sm font-bold text-neutral-950 mb-2',
  p: 'text-base text-neutral-700 mb-6',
  ul: 'list-disc list-inside mb-4 space-y-2',
  ol: 'list-decimal list-inside mb-4 space-y-2',
  li: 'text-neutral-600',
  blockquote: 'border-l-4 border-primary-500 pl-4 py-2 my-4 bg-neutral-50 italic text-neutral-700',
  a: 'text-primary-500 hover:text-primary-600 underline',
  strong: 'font-bold',
  b: 'font-bold',
  em: 'italic',
  i: 'italic',
  code: 'bg-neutral-100 px-1 py-0.5 rounded text-sm font-mono',
  pre: 'bg-neutral-100 p-4 rounded-lg overflow-x-auto mb-4',
  hr: 'border-neutral-200 my-8'
} as const;

export function renderRichText(content: string, className?: string): React.ReactNode {
  if (!content) return null;

  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    // Server-side rendering - use dangerouslySetInnerHTML with pre-processed classes
    let processedContent = content;
    
    // Apply unified styling to each tag type
    Object.entries(HTML_ELEMENT_STYLES).forEach(([tag, classes]) => {
      const regex = new RegExp(`<${tag}([^>]*)>`, 'g');
      processedContent = processedContent.replace(regex, `<${tag}$1 class="${classes}">`);
    });
    
    return (
      <div className={className} dangerouslySetInnerHTML={{ __html: processedContent }} />
    );
  }

  // Client-side rendering - Parse the HTML content and convert to React components
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  
  const elements: React.ReactNode[] = [];
  
  function processNode(node: Node, depth: number = 0): React.ReactNode {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }
    
    const element = node as Element;
    const tagName = element.tagName.toLowerCase();
    
    // Process child nodes
    const children = Array.from(element.childNodes).map(child => processNode(child, depth + 1));
    
    // Handle different HTML elements using unified styling
    const styles = HTML_ELEMENT_STYLES[tagName as keyof typeof HTML_ELEMENT_STYLES];
    
    if (styles) {
      return React.createElement(
        tagName,
        { key: Math.random(), className: styles },
        ...children
      );
    }
    
    // Handle elements that need special processing
    switch (tagName) {
      case 'img':
        const imgElement = element as HTMLImageElement;
        return (
          <img 
            key={Math.random()} 
            src={imgElement.src} 
            alt={imgElement.alt || ''} 
            className="w-full h-auto rounded-lg my-4" 
          />
        );
      
      case 'br':
        return <br key={Math.random()} />;
      
      default:
        // For any other elements, render them as-is with basic styling
        return (
          <div key={Math.random()} className="mb-4">
            {children}
          </div>
        );
    }
  }
  
  // Process all child nodes of the body
  Array.from(doc.body.childNodes).forEach(node => {
    elements.push(processNode(node));
  });
  
  return (
    <div className={className}>
      {elements}
    </div>
  );
}

// Fallback function for server-side rendering where DOMParser might not be available
export function renderRichTextSSR(content: string, className?: string): string {
  if (!content) return '';

  // Simple regex-based parsing for server-side
  let processedContent = content;
  
  // Convert WordPress blockquotes with proper styling
  processedContent = processedContent.replace(
    /<blockquote class="wp-block-quote[^"]*">([\s\S]*?)<\/blockquote>/g,
    (match, innerContent) => {
      // Extract the text content from inside the blockquote
      const textMatch = innerContent.match(/<p[^>]*>([\s\S]*?)<\/p>/);
      const textContent = textMatch ? textMatch[1].replace(/<[^>]*>/g, '').trim() : innerContent.replace(/<[^>]*>/g, '').trim();
      
      return `<blockquote class="my-12 py-10 px-8 bg-primary-50 border-t-2 border-b-2 border-primary-500 text-center"><p class="text-display-4 font-bold text-neutral-950 mb-4 italic">${textContent}</p><cite class="text-xs font-bold uppercase tracking-widest text-primary-500">— Matt Cheshier, Co-Owner</cite></blockquote>`;
    }
  );
  
  // Convert headings
  processedContent = processedContent.replace(
    /<h2[^>]*>(.*?)<\/h2>/g,
    '<h2 class="text-display-3 font-bold text-neutral-950 mt-12 mb-6">$1</h2>'
  );
  
  processedContent = processedContent.replace(
    /<h3[^>]*>(.*?)<\/h3>/g,
    '<h3 class="text-display-4 font-bold text-neutral-950 mt-8 mb-4">$1</h3>'
  );
  
  // Convert paragraphs
  processedContent = processedContent.replace(
    /<p[^>]*>(.*?)<\/p>/g,
    '<p class="text-base text-neutral-700 mb-6">$1</p>'
  );
  
  // Convert lists
  processedContent = processedContent.replace(
    /<ul[^>]*class="[^"]*wp-block-list[^"]*"[^>]*>(.*?)<\/ul>/g,
    '<ul class="list-disc list-inside text-base text-neutral-700 mb-6 space-y-2">$1</ul>'
  );
  
  processedContent = processedContent.replace(
    /<li[^>]*>(.*?)<\/li>/g,
    '<li class="mb-2">$1</li>'
  );
  
  // Convert strong tags
  processedContent = processedContent.replace(
    /<strong[^>]*>(.*?)<\/strong>/g,
    '<strong class="font-bold">$1</strong>'
  );
  
  // Convert line breaks
  processedContent = processedContent.replace(/<br\s*\/?>/gi, '<br />');
  
  return processedContent;
}
