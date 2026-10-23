import 'server-only';

import type { ThemeRegistrationRaw } from 'shiki';

interface CodePalette {
  foreground: string;
  comment: string;
  keyword: string;
  func: string;
  type: string;
  string: string;
  constant: string;
  property: string;
  parameter: string;
  punctuation: string;
  inserted: string;
  deleted: string;
}

const createTheme = (
  name: string,
  type: 'light' | 'dark',
  p: CodePalette,
): ThemeRegistrationRaw => ({
  name,
  type,
  fg: p.foreground,
  bg: 'transparent',
  settings: [
    { settings: { foreground: p.foreground } },
    {
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: p.comment },
    },
    {
      scope: ['string', 'punctuation.definition.string', 'string.regexp'],
      settings: { foreground: p.string },
    },
    {
      scope: [
        'constant',
        'constant.numeric',
        'constant.language',
        'constant.character',
        'constant.other',
        'support.constant',
      ],
      settings: { foreground: p.constant },
    },
    {
      scope: [
        'keyword',
        'keyword.control',
        'storage',
        'storage.type',
        'storage.modifier',
        'variable.language',
        'support.variable',
        'entity.name.tag',
        'entity.name.tag.yaml',
      ],
      settings: { foreground: p.keyword },
    },
    {
      scope: ['keyword.operator', 'keyword.operator.type.annotation'],
      settings: { foreground: p.punctuation },
    },
    {
      scope: [
        'entity.name.function',
        'support.function',
        'meta.function-call entity.name.function',
        'entity.other.attribute-name',
      ],
      settings: { foreground: p.func },
    },
    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'entity.other.inherited-class',
        'support.class',
        'support.type',
        'meta.type.annotation',
      ],
      settings: { foreground: p.type },
    },
    {
      scope: ['variable.parameter'],
      settings: { foreground: p.parameter },
    },
    {
      scope: [
        'variable.other.property',
        'variable.other.object.property',
        'meta.object-literal.key',
        'support.type.property-name',
        'support.type.property-name.json',
      ],
      settings: { foreground: p.property },
    },
    {
      scope: ['punctuation', 'meta.brace', 'meta.delimiter'],
      settings: { foreground: p.punctuation },
    },
    {
      scope: ['markup.heading', 'markup.bold', 'markup.italic'],
      settings: { foreground: p.keyword },
    },
    {
      scope: ['markup.inline.raw', 'markup.fenced_code'],
      settings: { foreground: p.string },
    },
    {
      scope: ['markup.inserted'],
      settings: { foreground: p.inserted },
    },
    {
      scope: ['markup.deleted', 'invalid'],
      settings: { foreground: p.deleted },
    },
  ],
});

// Colors are checked for >= 4.5:1 against the code block surface and the
// highlighted-line background in each theme.
export const CODE_THEMES = {
  light: createTheme('blog-light', 'light', {
    foreground: '#2A2A40',
    comment: '#5A5D76',
    keyword: '#5B21B6',
    func: '#0B6B63',
    type: '#075985',
    string: '#9A3412',
    constant: '#9F1239',
    property: '#1E40AF',
    parameter: '#9A3412',
    punctuation: '#4B4E66',
    inserted: '#166534',
    deleted: '#991B1B',
  }),
  dark: createTheme('blog-dark', 'dark', {
    foreground: '#D8D9E6',
    comment: '#8B8DA3',
    keyword: '#A78BFA',
    func: '#5EEAD4',
    type: '#7DD3FC',
    string: '#FBBF77',
    constant: '#FDA4AF',
    property: '#93C5FD',
    parameter: '#FFC799',
    punctuation: '#A5A6BC',
    inserted: '#86EFAC',
    deleted: '#FCA5A5',
  }),
};
