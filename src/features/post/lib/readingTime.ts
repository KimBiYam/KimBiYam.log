import RemoveMarkdown from 'remove-markdown';

import { splitFencedCode } from './fencedCode';

const HANGUL_CHARS_PER_MINUTE = 500;
const ENGLISH_WORDS_PER_MINUTE = 200;
const SECONDS_PER_CODE_BLOCK = 10;

const HANGUL_REG_EXP = /[가-힣]/g;
const ENGLISH_WORD_REG_EXP = /[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g;

export const getReadingTimeMinutes = (markdown: string) => {
  const { proseLines, fenceCount } = splitFencedCode(markdown);
  const plainText = RemoveMarkdown(proseLines.join('\n'), { useImgAltText: false });

  const hangulCount = plainText.match(HANGUL_REG_EXP)?.length ?? 0;
  const englishWordCount =
    plainText.replace(HANGUL_REG_EXP, ' ').match(ENGLISH_WORD_REG_EXP)
      ?.length ?? 0;

  const minutes =
    hangulCount / HANGUL_CHARS_PER_MINUTE +
    englishWordCount / ENGLISH_WORDS_PER_MINUTE +
    (fenceCount * SECONDS_PER_CODE_BLOCK) / 60;

  return Math.max(1, Math.ceil(minutes));
};
