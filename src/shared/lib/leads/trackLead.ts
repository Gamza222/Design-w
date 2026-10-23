import { GOOGLE_TAG_ID } from '../../config';

const recorded = new Set<string>();
const storagePrefix = 'designseichas:confirmed-lead:';

/** Только подтверждённая сервером заявка. Персональные данные в счётчики не передаём. */
export function trackConfirmedLead(submissionId: string, kind: 'project' | 'consultation') {
  if (typeof window === 'undefined' || recorded.has(submissionId)) return;
  try {
    if (window.sessionStorage.getItem(storagePrefix + submissionId)) return;
  } catch {
    // In-memory deduplication remains available when storage is blocked.
  }

  const analytics = window as Window & {
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
  };
  const params = { lead_type: kind };
  let sent = false;
  try {
    if (typeof analytics.gtag === 'function') {
      analytics.gtag('event', 'generate_lead', { ...params, send_to: GOOGLE_TAG_ID });
      sent = true;
    }
  } catch {
    // Analytics must never turn a successfully delivered enquiry into an error.
  }
  try {
    if (typeof analytics.ym === 'function') {
      analytics.ym(113598335, 'reachGoal', 'lead_success', params);
      sent = true;
    }
  } catch {
    // One blocked counter must not prevent the other counter or the form result.
  }
  if (!sent) return;
  recorded.add(submissionId);
  try {
    window.sessionStorage.setItem(storagePrefix + submissionId, '1');
  } catch {
    // The Set still prevents duplicate events during SPA navigation and retries.
  }
}
