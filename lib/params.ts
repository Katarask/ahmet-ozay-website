/**
 * Helper-Funktion für sichere Behandlung von params in Next.js 14 App Router
 * params kann beim Prerendering ein Promise oder direkt ein Objekt sein
 */
export async function resolveParams<T extends Record<string, string>>(
  params: Promise<T> | T | undefined
): Promise<T> {
  if (!params) {
    throw new Error('Params is undefined');
  }
  return params instanceof Promise ? await params : params;
}
