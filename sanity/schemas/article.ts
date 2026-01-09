import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'article',
  title: 'Artikel',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'object',
      fields: [
        { name: 'de', type: 'string', title: 'Deutsch' },
        { name: 'en', type: 'string', title: 'English' },
        { name: 'tr', type: 'string', title: 'Türkçe' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title.de',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Kurzbeschreibung',
      type: 'object',
      fields: [
        { name: 'de', type: 'text', title: 'Deutsch', rows: 3 },
        { name: 'en', type: 'text', title: 'English', rows: 3 },
        { name: 'tr', type: 'text', title: 'Türkçe', rows: 3 },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Inhalt',
      type: 'object',
      fields: [
        {
          name: 'de',
          type: 'array',
          title: 'Deutsch',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'Zitat', value: 'blockquote' },
              ],
              marks: {
                decorators: [
                  { title: 'Fett', value: 'strong' },
                  { title: 'Kursiv', value: 'em' },
                  { title: 'Unterstrichen', value: 'underline' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [
                      {
                        name: 'href',
                        type: 'url',
                        title: 'URL',
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                },
                {
                  name: 'caption',
                  type: 'string',
                  title: 'Bildunterschrift',
                },
              ],
            },
          ],
        },
        {
          name: 'en',
          type: 'array',
          title: 'English',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'Quote', value: 'blockquote' },
              ],
              marks: {
                decorators: [
                  { title: 'Bold', value: 'strong' },
                  { title: 'Italic', value: 'em' },
                  { title: 'Underline', value: 'underline' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [
                      {
                        name: 'href',
                        type: 'url',
                        title: 'URL',
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                },
                {
                  name: 'caption',
                  type: 'string',
                  title: 'Caption',
                },
              ],
            },
          ],
        },
        {
          name: 'tr',
          type: 'array',
          title: 'Türkçe',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'Alıntı', value: 'blockquote' },
              ],
              marks: {
                decorators: [
                  { title: 'Kalın', value: 'strong' },
                  { title: 'İtalik', value: 'em' },
                  { title: 'Altı Çizili', value: 'underline' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [
                      {
                        name: 'href',
                        type: 'url',
                        title: 'URL',
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                },
                {
                  name: 'caption',
                  type: 'string',
                  title: 'Resim Açıklaması',
                },
              ],
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategorie',
      type: 'string',
      options: {
        list: [
          { title: 'Politik', value: 'politik' },
          { title: 'Gesellschaft', value: 'gesellschaft' },
          { title: 'Medien', value: 'medien' },
          { title: 'Geschichte', value: 'geschichte' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Veröffentlichungsdatum',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
      initialValue: 'Ahmet Özay',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readTime',
      title: 'Lesezeit (Minuten)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(60),
    }),
    defineField({
      name: 'featured',
      title: 'Hervorgehoben',
      type: 'boolean',
      initialValue: false,
      description: 'Soll dieser Artikel auf der Startseite hervorgehoben werden?',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'image',
      title: 'Titelbild',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
      ],
    }),
    defineField({
      name: 'originalUrl',
      title: 'Original-Link',
      type: 'url',
      description: 'URL des ursprünglichen Artikels (falls von externer Quelle)',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }),
    }),
  ],
  preview: {
    select: {
      title: 'title.de',
      subtitle: 'category',
      media: 'image',
    },
  },
});

