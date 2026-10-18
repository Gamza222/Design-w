import { describe, expect, it } from 'vitest';

import { getPublishedReviews, verifiedReviews, type VerifiedReview } from './reviews';

/** Synthetic fixtures stay in this test module and are never imported by the website. */
function syntheticReview(index: number): VerifiedReview {
  return {
    id: `SYNTHETIC-TEST-${index}`,
    locale: 'ru',
    name: `SYNTHETIC TEST AUTHOR ${index}`,
    text: `SYNTHETIC TEST RECORD ${index}. This is not a customer testimonial.`,
    publishedAt: '2026-10-04',
    sourceUrl: `https://example.invalid/synthetic-test/${index}`,
    verified: true,
    publicationConsent: true,
  };
}

describe('review publication boundary', () => {
  it('ships no testimonials until real approved records are supplied', () => {
    expect(verifiedReviews).toEqual([]);
    for (const locale of ['ru', 'en', 'be'] as const) {
      expect(getPublishedReviews(locale)).toEqual([]);
    }
  });

  it('handles 150 synthetic records without leaking records between locales or changing the source', () => {
    const records = Array.from({ length: 150 }, (_, index) => ({
      ...syntheticReview(index),
      locale: (['ru', 'en', 'be'] as const)[index % 3],
    }));
    const before = structuredClone(records);

    for (const locale of ['ru', 'en', 'be'] as const) {
      const published = getPublishedReviews(locale, records);
      expect(published).toHaveLength(50);
      expect(published.every((record) => record.locale === locale)).toBe(true);
      expect(new Set(published.map((record) => record.id)).size).toBe(50);
    }

    expect(records).toEqual(before);
    expect(verifiedReviews).toEqual([]);
  });

  it.each([
    ['unverified', { verified: false }],
    ['missing publication consent', { publicationConsent: false }],
    ['blank author', { name: '   ' }],
    ['blank testimonial', { text: '\n ' }],
    ['missing source', { sourceUrl: '' }],
    ['unsafe source', { sourceUrl: 'javascript:alert(1)' }],
    ['non-HTTPS source', { sourceUrl: 'http://example.invalid/review' }],
    ['invalid date', { publishedAt: 'unconfirmed' }],
    ['rating below the scale', { rating: 0 }],
    ['rating above the scale', { rating: 6 }],
    ['non-numeric rating', { rating: Number.NaN }],
  ])('rejects an imported record with %s', (_, invalidFields) => {
    // Runtime import validation must also reject records that violate the TypeScript contract.
    const invalid = { ...syntheticReview(1), ...invalidFields } as VerifiedReview;
    const valid = syntheticReview(2);
    expect(getPublishedReviews('ru', [invalid, valid])).toEqual([valid]);
  });

  it('does not require or invent a rating when the source contains none', () => {
    const unrated = syntheticReview(1);
    const rated = { ...syntheticReview(2), rating: 4 };
    expect(getPublishedReviews('ru', [unrated, rated])).toEqual([unrated, rated]);
    expect(getPublishedReviews('ru', [unrated])[0]).not.toHaveProperty('rating');
  });
});
