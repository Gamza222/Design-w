export interface LeadContext {
  source: string;
  service?: string;
  project?: string;
  area?: number;
  packageId?: string;
  packageName?: string;
  extras?: string[];
  estimate?: number;
  currency?: 'RUB' | 'BYN';
  preliminary?: boolean;
}

export const LEAD_DIALOG_EVENT = 'designseichas:lead';

/** Opens the enquiry at its trigger, without navigation or changing scroll position. */
export interface LeadDialogRequest {
  context: LeadContext;
  returnFocus: HTMLElement | null;
}

export function openLeadDialog(context: LeadContext, returnFocus?: HTMLElement | null) {
  window.dispatchEvent(
    new CustomEvent<LeadDialogRequest>(LEAD_DIALOG_EVENT, {
      detail: {
        context,
        returnFocus: returnFocus ?? null,
      },
    }),
  );
}

export type LeadAttribution = Partial<
  Record<
    'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term' | 'referrer',
    string
  >
>;

let attribution: LeadAttribution = {};

/** In-memory attribution only; no tracking cookie or storage before consent. */
export function captureLeadAttribution() {
  const params = new URLSearchParams(window.location.search);
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
  if (keys.some((key) => params.has(key))) {
    attribution = Object.fromEntries(
      keys.flatMap((key) => (params.get(key) ? [[key, params.get(key)!.slice(0, 200)]] : [])),
    );
  }
  if (!attribution.referrer && document.referrer) {
    try {
      attribution.referrer = new URL(document.referrer).origin;
    } catch {
      /* An invalid referrer is not needed to deliver an enquiry. */
    }
  }
}

export function getLeadAttribution(): LeadAttribution {
  return { ...attribution };
}
