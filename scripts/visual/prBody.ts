import { extractImagePaths } from './markdown.ts';

export const BLOCK_START = '<!-- visual-compare:start -->';
export const BLOCK_END = '<!-- visual-compare:end -->';
/** GitHub 이슈/PR 본문의 최대 글자 수. */
export const MAX_BODY_LENGTH = 65536;

const SCREENSHOTS_HEADING = '### Screenshots';
const IMAGE_BLOCK = /<details><summary><code>[\s\S]*?<\/details>/g;

/** 마커로 감싼 블록. 내용은 개행으로 끝난다. */
export const wrapBlock = (markdown: string): string =>
  `${BLOCK_START}\n${markdown.endsWith('\n') ? markdown : `${markdown}\n`}${BLOCK_END}`;

/**
 * 본문에서 마커 블록만 교체한다. 시작/끝 마커가 순서대로 모두 있을 때만 교체하고,
 * 그렇지 않으면(한쪽만 있어도 작성자 글을 건드리지 않도록) 본문 끝에 덧붙인다.
 * 블록 바깥은 한 바이트도 바꾸지 않는다.
 */
export const replaceBlock = (body: string, block: string): string => {
  const start = body.indexOf(BLOCK_START);
  const end = start === -1 ? -1 : body.indexOf(BLOCK_END, start);
  if (start !== -1 && end !== -1) {
    return body.slice(0, start) + block + body.slice(end + BLOCK_END.length);
  }
  if (body === '') return `${block}\n`;
  const eol = body.includes('\r\n') ? '\r\n' : '\n';
  const trailing = body.match(/(?:\r?\n)*$/)?.[0] ?? '';
  const separator = trailing.includes(eol + eol)
    ? ''
    : trailing.length > 0
      ? eol
      : eol + eol;
  return `${body}${separator}${block}${eol}`;
};

export interface FitResult {
  body: string;
  markdown: string;
  /** 크기 때문에 줄였을 때 블록에 남긴 안내. 줄이지 않았으면 null. */
  degradation: string | null;
  imagesKept: number;
  imagesDropped: number;
}

const note = (text: string) => `\n> ⚠️ Size guard: ${text}\n`;

const withNote = (markdown: string, text: string) =>
  `${markdown.replace(/\n+$/, '\n')}${note(text)}`;

/** 스크린샷 섹션을 앞에서 `keep` 개만 남긴다. 섹션이 없으면 그대로 둔다. */
const capScreenshots = (markdown: string, keep: number): string => {
  const at = markdown.indexOf(SCREENSHOTS_HEADING);
  if (at === -1) return markdown;
  const head = markdown.slice(0, at);
  const rest = markdown.slice(at);
  const blocks = rest.match(IMAGE_BLOCK) ?? [];
  const lastEnd = rest.lastIndexOf('</details>') + '</details>'.length;
  const tail = rest.slice(lastEnd);
  if (keep <= 0)
    return `${head.replace(/\n+$/, '\n\n')}${tail.replace(/^\n+/, '')}`;
  return `${head}${SCREENSHOTS_HEADING}\n\n${blocks.slice(0, keep).join('\n\n')}\n${tail}`;
};

/** 판정 표 이후를 모두 버리고 요약 머리말만 남긴다. */
const headerOnly = (markdown: string): string => {
  const at = markdown.search(/^\|/m);
  return at === -1 ? markdown : markdown.slice(0, at);
};

/**
 * 기존 본문 + 블록이 한도를 넘지 않게 블록을 단계적으로 줄인다.
 * 이미지 개수를 줄이고, 그래도 넘으면 이미지를 모두 빼고, 마지막으로 표도 뺀다.
 * 작성자 본문은 절대 자르지 않으며, 최소 블록도 들어가지 않으면 예외를 던진다.
 */
export const fitBlock = (
  markdown: string,
  existingBody: string,
  limit = MAX_BODY_LENGTH,
): FitResult => {
  const total = extractImagePaths(markdown).length;
  const build = (md: string) => replaceBlock(existingBody, wrapBlock(md));
  const result = (
    md: string,
    degradation: string | null,
    kept: number,
  ): FitResult => ({
    body: build(md),
    markdown: md,
    degradation,
    imagesKept: kept,
    imagesDropped: total - kept,
  });

  if (build(markdown).length <= limit) return result(markdown, null, total);

  const cappedNote = (kept: number, of: number) =>
    `body size limit (${limit} characters) reached; showing screenshots for ${kept} of ${of} changed entries. The table above is complete; run \`pnpm visual:compare\` locally for the rest.`;
  const blockCount = (markdown.match(IMAGE_BLOCK) ?? []).length;
  // 이진 탐색: 한도 안에 들어가는 가장 큰 스크린샷 개수.
  let low = 0;
  let high = blockCount - 1;
  let best = -1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    const candidate = withNote(
      capScreenshots(markdown, mid),
      cappedNote(mid, blockCount),
    );
    if (build(candidate).length <= limit) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  if (best >= 1) {
    const text = cappedNote(best, blockCount);
    const md = withNote(capScreenshots(markdown, best), text);
    return result(md, text, extractImagePaths(md).length);
  }

  const noImages = `body size limit (${limit} characters) reached; screenshots omitted. Run \`pnpm visual:compare\` locally to see them.`;
  const mdNoImages = withNote(capScreenshots(markdown, 0), noImages);
  if (build(mdNoImages).length <= limit) {
    return result(mdNoImages, noImages, 0);
  }

  const minimal = `body size limit (${limit} characters) reached; results table and screenshots omitted. Run \`pnpm visual:compare\` locally for details.`;
  const mdMinimal = withNote(headerOnly(markdown), minimal);
  if (build(mdMinimal).length <= limit) {
    return result(mdMinimal, minimal, 0);
  }

  throw new Error(
    `PR body is too large for even a minimal visual block (${build(mdMinimal).length} > ${limit} characters). Shorten the existing description; it was not modified.`,
  );
};
