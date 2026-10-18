import { beforeEach, describe, expect, it } from 'vitest';

import { LOCALE_PREFERENCE_COOKIE, saveLocalePreference } from './localePreference';

describe('locale preference', () => {
  beforeEach(() => {
    document.cookie = `${LOCALE_PREFERENCE_COOKIE}=; Path=/; Max-Age=0`;
  });

  it('stores an explicit locale in a first-party cookie', () => {
    saveLocalePreference('be');

    expect(document.cookie).toContain(`${LOCALE_PREFERENCE_COOKIE}=be`);
  });
});
