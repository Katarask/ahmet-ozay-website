/**
 * Helper-Funktion für sichere Behandlung von params in Next.js 14 App Router
 * params kann beim Prerendering ein Promise oder direkt ein Objekt sein
 * 
 * WICHTIG: Beim Prerendering kann params manchmal undefined sein, auch wenn generateStaticParams vorhanden ist.
 * Dies passiert, wenn Next.js versucht, die Komponente zu serialisieren (z.B. für den Export).
 * In diesem Fall verwenden wir einen Fallback-Wert.
 */
export async function resolveParams<T extends Record<string, string>>(
  params: Promise<T> | T | undefined,
  fallback?: T
): Promise<T> {
  if (!params) {
    if (fallback) {
      return fallback;
    }
    
    // Wenn kein Fallback vorhanden ist, werfen wir einen Fehler
    // Dies sollte nicht passieren, wenn generateStaticParams korrekt implementiert ist
    throw new Error('Params is undefined and no fallback provided');
  }
  
  const resolved = params instanceof Promise ? await params : params;
  return resolved;
}
