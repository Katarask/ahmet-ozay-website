import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { client } from '@/lib/sanity';

// E-Mail-Benachrichtigung an Autor senden, wenn neuer Kommentar eingereicht wird
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, articleTitle, commentAuthor, commentContent, articleSlug, locale } = body;

    if (!articleId || !articleTitle || !commentAuthor || !commentContent) {
      return NextResponse.json(
        { error: 'Fehlende erforderliche Felder' },
        { status: 400 }
      );
    }

    // Autor-E-Mail aus Environment-Variablen (oder später aus Sanity)
    const authorEmail = process.env.AUTHOR_EMAIL || process.env.NEXT_PUBLIC_AUTHOR_EMAIL;
    
    if (!authorEmail) {
      console.warn('AUTHOR_EMAIL nicht gesetzt - E-Mail-Benachrichtigung wird nicht gesendet');
      return NextResponse.json(
        { success: false, message: 'E-Mail-Konfiguration fehlt' },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ahmetoezay.de';
    const articleUrl = `${baseUrl}/${locale || 'de'}/artikel/${articleSlug}`;
    const studioUrl = `${baseUrl}/studio`;

    // E-Mail-Vorlage
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; }
            .comment-box { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0; border-radius: 4px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px; margin-top: 20px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e9ecef; font-size: 12px; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0; color: #212529;">Neuer Kommentar auf Ihrem Artikel</h2>
            </div>
            <div class="content">
              <p>Hallo Ahmet,</p>
              <p>Es wurde ein neuer Kommentar auf Ihren Artikel <strong>"${articleTitle}"</strong> eingereicht.</p>
              
              <div class="comment-box">
                <p style="margin: 0 0 10px 0;"><strong>Von:</strong> ${commentAuthor}</p>
                <p style="margin: 0; white-space: pre-wrap;">${commentContent}</p>
              </div>

              <p>Der Kommentar wartet auf Ihre Moderation. Sie können ihn in Sanity Studio genehmigen oder ablehnen.</p>
              
              <a href="${studioUrl}" class="button">Zu Sanity Studio</a>
              <br>
              <a href="${articleUrl}" style="color: #007bff; text-decoration: none; margin-top: 10px; display: inline-block;">Artikel ansehen</a>
            </div>
            <div class="footer">
              <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese E-Mail.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
Neuer Kommentar auf Ihrem Artikel

Hallo Ahmet,

Es wurde ein neuer Kommentar auf Ihren Artikel "${articleTitle}" eingereicht.

Von: ${commentAuthor}

${commentContent}

Der Kommentar wartet auf Ihre Moderation. Sie können ihn in Sanity Studio genehmigen oder ablehnen.

Artikel ansehen: ${articleUrl}
Sanity Studio: ${studioUrl}
    `;

    // Resend nur initialisieren, wenn API Key vorhanden
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY nicht gesetzt - E-Mail-Benachrichtigung wird nicht gesendet');
      return NextResponse.json(
        { success: false, message: 'E-Mail-Konfiguration fehlt' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // E-Mail senden
    // Falls keine Domain verifiziert: Verwende Resend Test-Domain (onboarding@resend.dev)
    // Oder: Eigene Domain in Resend verifizieren und dann z.B. noreply@ahmetoezay.de verwenden
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: authorEmail,
      subject: `Neuer Kommentar: ${articleTitle}`,
      html: emailHtml,
      text: emailText,
    });

    if (error) {
      console.error('Fehler beim Senden der E-Mail:', error);
      return NextResponse.json(
        { success: false, error: 'Fehler beim Senden der E-Mail' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error('Fehler in notify route:', error);
    return NextResponse.json(
      { success: false, error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
