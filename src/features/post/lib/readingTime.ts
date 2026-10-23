import RemoveMarkdown from 'remove-markdown';

const HANGUL_CHARS_PER_MINUTE = 500;
const ENGLISH_WORDS_PER_MINUTE = 200;
const SECONDS_PER_CODE_BLOCK = 10;

const FENCE_REG_EXP = /^\s*(`{3,}|~{3,})/;
const HANGUL_REG_EXP = /[가-힣]/g;
const ENGLISH_WORD_REG_EXP = /[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g;

// Splits markdown into prose lines and a fenced code block count.
const splitCodeBlocks = (markdown: string) => {
  const textLines: string[] = [];
  let codeBlockCount = 0;
  let openFence: string | null = null;

  for (const line of markdown.split('\n')) {
    const fence = line.match(FENCE_REG_EXP)?.[1];

    if (openFence) {
      const isClosingFence =
        fence !== undefined &&
        fence[0] === openFence[0] &&
        fence.length >= openFence.length &&
        line.trim() === fence;

      if (isClosingFence) openFence = null;
      continue;
    }

    if (fence) {
      openFence = fence;
      codeBlockCount += 1;
      continue;
    }

    textLines.push(line);
  }

  return { text: textLines.join('\n'), codeBlockCount };
};

export const getReadingTimeMinutes = (markdown: string) => {
  const { text, codeBlockCount } = splitCodeBlocks(markdown);
  const plainText = RemoveMarkdown(text, { useImgAltText: false });

  const hangulCount = plainText.match(HANGUL_REG_EXP)?.length ?? 0;
  const englishWordCount =
    plainText.replace(HANGUL_REG_EXP, ' ').match(ENGLISH_WORD_REG_EXP)
      ?.length ?? 0;

  const minutes =
    hangulCount / HANGUL_CHARS_PER_MINUTE +
    englishWordCount / ENGLISH_WORDS_PER_MINUTE +
    (codeBlockCount * SECONDS_PER_CODE_BLOCK) / 60;

  return Math.max(1, Math.ceil(minutes));
};
