import { describe, expect, it } from 'vitest';

import { CODE_THEMES } from '@src/features/post/lib/codeTheme';

const HEX_COLOR_REG_EXP = /^#[0-9A-Fa-f]{6}$/;

describe('CODE_THEMES', () => {
  it.each([
    ['light', 'blog-light'],
    ['dark', 'blog-dark'],
  ] as const)('defines the %s theme', (key, name) => {
    const theme = CODE_THEMES[key];

    expect(theme.name).toBe(name);
    expect(theme.type).toBe(key);
    expect(theme.bg).toBe('transparent');
    expect(theme.fg).toMatch(HEX_COLOR_REG_EXP);
  });

  it.each(['light', 'dark'] as const)(
    'has a default foreground and scoped settings in %s theme',
    (key) => {
      const { settings, fg } = CODE_THEMES[key];

      expect(settings?.[0].scope).toBeUndefined();
      expect(settings?.[0].settings?.foreground).toBe(fg);

      for (const rule of settings?.slice(1) ?? []) {
        expect(rule.scope).not.toHaveLength(0);
        expect(rule.settings?.foreground).toMatch(HEX_COLOR_REG_EXP);
      }
    },
  );

  it('uses different palettes for light and dark', () => {
    expect(CODE_THEMES.light.fg).not.toBe(CODE_THEMES.dark.fg);
  });

  it('colors comments with the palette comment color', () => {
    const rule = CODE_THEMES.dark.settings?.find((r) =>
      (r.scope as string[] | undefined)?.includes('comment'),
    );

    expect(rule?.settings?.foreground).toBe('#8B8DA3');
  });
});
