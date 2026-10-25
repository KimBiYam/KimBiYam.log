// CommonMark: a code fence may be indented by up to 3 spaces.
const FENCE_REG_EXP = /^ {0,3}(`{3,}|~{3,})/;

// Splits markdown into the lines outside fenced code blocks and the number of
// fenced blocks found.
export const splitFencedCode = (markdown: string) => {
  const proseLines: string[] = [];
  let fenceCount = 0;
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
      fenceCount += 1;
      continue;
    }

    proseLines.push(line);
  }

  return { proseLines, fenceCount };
};
