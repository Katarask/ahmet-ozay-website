import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

// GET: Kommentare für einen Artikel abrufen
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug ist erforderlich' }, { status: 400 });
    }

    // Artikel-ID über Slug finden
    const articleQuery = `*[_type == "article" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id
    }`;
    const article = await client.fetch(articleQuery, { slug });

    if (!article) {
      return NextResponse.json({ error: 'Artikel nicht gefunden' }, { status: 404 });
    }

    // Nur genehmigte Kommentare abrufen
    const commentsQuery = `*[_type == "comment" && article._ref == $articleId && approved == true] | order(publishedAt desc) {
      _id,
      author,
      content,
      publishedAt
    }`;

    const comments = await client.fetch(commentsQuery, { articleId: article._id });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Fehler beim Abrufen der Kommentare:', error);
    return NextResponse.json({ error: 'Fehler beim Abrufen der Kommentare' }, { status: 500 });
  }
}

// POST: Neuen Kommentar erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleSlug, author, email, content, locale } = body;

    if (!articleSlug || !author || !email || !content) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    // Validierung
    if (author.length < 2 || author.length > 100) {
      return NextResponse.json(
        { error: 'Name muss zwischen 2 und 100 Zeichen lang sein' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse' }, { status: 400 });
    }

    if (content.length < 10 || content.length > 2000) {
      return NextResponse.json(
        { error: 'Kommentar muss zwischen 10 und 2000 Zeichen lang sein' },
        { status: 400 }
      );
    }

    // Artikel-ID über Slug finden
    const articleQuery = `*[_type == "article" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id
    }`;
    const article = await client.fetch(articleQuery, { slug: articleSlug });

    if (!article) {
      return NextResponse.json({ error: 'Artikel nicht gefunden' }, { status: 404 });
    }

    // IP-Adresse extrahieren (für Spam-Schutz)
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';

    // Kommentar erstellen (nicht genehmigt)
    const comment = {
      _type: 'comment',
      article: {
        _type: 'reference',
        _ref: article._id,
      },
      author,
      email,
      content,
      approved: false, // Muss moderiert werden
      publishedAt: new Date().toISOString(),
      ipAddress,
    };

    const created = await client.create(comment);

    // Artikel-Details für E-Mail-Benachrichtigung abrufen
    const articleDetailsQuery = `*[_type == "article" && _id == $articleId][0] {
      title,
      slug
    }`;
    const articleDetails = await client.fetch(articleDetailsQuery, { articleId: article._id });

    // E-Mail-Benachrichtigung an Autor senden (asynchron, nicht blockierend)
    if (process.env.RESEND_API_KEY && articleDetails) {
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/comments/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId: article._id,
          articleTitle: articleDetails.title?.de || articleDetails.title?.en || articleDetails.title?.tr || 'Artikel',
          articleSlug: articleDetails.slug?.current || articleSlug,
          commentAuthor: author,
          commentContent: content,
          locale: locale || 'de',
        }),
      }).catch((err) => {
        console.error('Fehler beim Senden der E-Mail-Benachrichtigung:', err);
        // Nicht blockierend - Kommentar wurde trotzdem erstellt
      });
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Kommentar wurde erfolgreich eingereicht und wartet auf Moderation.',
        id: created._id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Fehler beim Erstellen des Kommentars:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Kommentars' },
      { status: 500 }
    );
  }
}
