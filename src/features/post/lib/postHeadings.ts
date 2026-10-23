const FENCE_REG_EXP = /^ {0,3}(`{3,}|~{3,})/;
const HEADING_REG_EXP = /^ {0,3}#{2,3}(?:[ \t]|$)/;

// Whether the markdown has an ATX h2/h3 outside fenced code, i.e. whether the
// rendered body will have headings for the table of contents. Known before
// render so the mobile TOC can reserve (or skip) its space on the server.
export const hasPostHeadings = (markdown: string) => {
  let openFence: string | null = null;

  for (const line of markdown.split('\n')) {
    const fence = line.match(FENCE_REG_EXP)?.[1];

    if (openFence) {
      if (
        fence !== undefined &&
        fence[0] === openFence[0] &&
        fence.length >= openFence.length &&
        line.trim() === fence
      ) {
        openFence = null;
      }
      continue;
    }

    if (fence) {
      openFence = fence;
      continue;
    }

    if (HEADING_REG_EXP.test(line)) return true;
  }

  return false;
};
