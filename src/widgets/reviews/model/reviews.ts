import type { Locale } from '@shared/config';

/** Only approved public fields belong here; keep verification evidence outside the bundle. */
export interface VerifiedReview {
  id: string;
  locale: Locale;
  name: string;
  text: string;
  publishedAt: string;
  sourceUrl: string;
  verified: true;
  publicationConsent: true;
  city?: string;
  rating?: number;
}

// No client reviews have been supplied with verification and publication consent.
export const verifiedReviews: readonly VerifiedReview[] = [];

export function getPublishedReviews(locale: Locale, records = verifiedReviews): VerifiedReview[] {
  return records.filter(
    (review) =>
      review.locale === locale &&
      review.verified === true &&
      review.publicationConsent === true &&
      review.name.trim().length > 0 &&
      review.text.trim().length > 0 &&
      /^https:\/\//.test(review.sourceUrl) &&
      Number.isFinite(Date.parse(review.publishedAt)) &&
      (review.rating === undefined || (review.rating >= 1 && review.rating <= 5)),
  );
}
