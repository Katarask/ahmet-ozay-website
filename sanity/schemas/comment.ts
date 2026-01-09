import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'comment',
  title: 'Kommentar',
  type: 'document',
  fields: [
    defineField({
      name: 'article',
      title: 'Artikel',
      type: 'reference',
      to: [{ type: 'article' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'email',
      title: 'E-Mail',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'content',
      title: 'Kommentar',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(10).max(2000),
    }),
    defineField({
      name: 'approved',
      title: 'Genehmigt',
      type: 'boolean',
      initialValue: false,
      description: 'Kommentar muss genehmigt werden, bevor er angezeigt wird.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Veröffentlicht am',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'ipAddress',
      title: 'IP-Adresse',
      type: 'string',
      description: 'Wird für Spam-Schutz verwendet',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      author: 'author',
      content: 'content',
      approved: 'approved',
      article: 'article.title.de',
    },
    prepare({ author, content, approved, article }) {
      const status = approved ? '✓' : '⏳';
      const preview = content?.substring(0, 50) || 'Kein Kommentar';
      return {
        title: `${status} ${author}`,
        subtitle: `${article || 'Unbekannter Artikel'} - ${preview}...`,
      };
    },
  },
  orderings: [
    {
      title: 'Neueste zuerst',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Älteste zuerst',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
  ],
});
