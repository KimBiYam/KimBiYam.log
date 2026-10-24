import { Children, isValidElement } from 'react';

import CodeCopyButton from './CodeCopyButton';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { ExtraProps } from 'react-markdown';

type HastNode = NonNullable<ExtraProps['node']>;
type HastChild = HastNode['children'][number];
type HastElement = Extract<HastChild, { type: 'element' }>;

const isHastElement = (node: HastChild): node is HastElement =>
  node.type === 'element';

const getHastText = (node: HastChild): string => {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(getHastText).join('');
  return '';
};

const getCodeBlockLabel = (node?: HastNode) => {
  const elements = node?.children.filter(isHastElement) ?? [];
  const title = elements.find(({ tagName }) => tagName === 'figcaption');
  const pre = elements.find(({ tagName }) => tagName === 'pre');

  const language =
    pre?.properties['data-language'] ?? pre?.properties.dataLanguage;
  const label = title ? getHastText(title) : language;

  return typeof label === 'string' && label ? label : 'text';
};

type MarkdownCodeBlockProps = ComponentPropsWithoutRef<'figure'> &
  ExtraProps & { children?: ReactNode };

// Wraps rehype-pretty-code's <figure>: the title (or language) and the copy
// button share one header row; the highlighted <pre> stays server-rendered.
const MarkdownCodeBlock = ({
  node,
  children,
  ...props
}: MarkdownCodeBlockProps) => {
  if (!('data-rehype-pretty-code-figure' in props)) {
    return <figure {...props}>{children}</figure>;
  }

  const body = Children.toArray(children).filter(
    (child) => !(isValidElement(child) && child.type === 'figcaption'),
  );

  return (
    <figure {...props}>
      <div data-code-header="">
        <span data-code-title="">{getCodeBlockLabel(node)}</span>
        <CodeCopyButton />
      </div>
      {body}
    </figure>
  );
};

export default MarkdownCodeBlock;
