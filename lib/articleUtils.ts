/**
 * Hilfsfunktionen für Artikel-Content-Verarbeitung
 * Für Schema.org articleBody und wordCount
 */

/**
 * Extrahiert Plain Text aus PortableText Content für Schema.org articleBody
 * Wichtig für AI-Crawling: Vollständiger Text im strukturierten Format
 */
export function extractPlainTextFromPortableText(content: any[]): string {
  if (!content || !Array.isArray(content)) return '';
  
  const extractText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (node?.text) return node.text;
    
    // PortableText Block-Struktur
    if (node?.children && Array.isArray(node.children)) {
      return node.children.map(extractText).join(' ');
    }
    
    // Array von Nodes
    if (Array.isArray(node)) {
      return node.map(extractText).join(' ');
    }
    
    // Block-Content (z.B. aus Sanity)
    if (node?._type === 'block' && node.children) {
      return node.children.map(extractText).join(' ');
    }
    
    return '';
  };
  
  const plainText = content
    .map(extractText)
    .filter(text => text.trim().length > 0)
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+/g, ' ')
    .trim();
  
  return plainText;
}

/**
 * Berechnet Wortanzahl aus PortableText Content
 * Hilfreich für AI-Systeme zur Einschätzung der Artikel-Tiefe
 */
export function calculateWordCount(content: any[]): number {
  const plainText = extractPlainTextFromPortableText(content);
  if (!plainText) return 0;
  
  // Zähle Wörter (mindestens 1 Zeichen, keine leeren Strings)
  const words = plainText
    .split(/\s+/)
    .filter(word => word.length > 0 && /[a-zA-ZäöüÄÖÜß]/.test(word));
  
  return words.length;
}
