import { splitFencedCode } from './fencedCode';

const HEADING_REG_EXP = /^ {0,3}#{2,3}(?:[ \t]|$)/;

// Whether the markdown has an ATX h2/h3 outside fenced code, i.e. whether the
// rendered body will have headings for the table of contents. Known before
// render so the mobile TOC can reserve (or skip) its space on the server.
export const hasPostHeadings = (markdown: string) =>
  splitFencedCode(markdown).proseLines.some((line) =>
    HEADING_REG_EXP.test(line),
  );
