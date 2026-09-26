export type LeadKind = 'project' | 'consultation';

export interface LeadPayload {
  kind: LeadKind;
  name: string;
  phone: string;
  consent: true;
  submissionId: string;
  area?: string;
  premises?: string;
  package?: string;
  comment?: string;
  locale?: string;
  page?: string;
  website?: string;
}

/** Stable per-attempt id: retries can finish only the delivery channel that previously failed. */
export function createLeadSubmissionId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** Sends a lead to the same-origin server function. Delivery credentials stay server-side. */
export async function submitLead(payload: LeadPayload): Promise<void> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 30_000);
  try {
    const response = await fetch('/api/lead.php', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Lead delivery failed with status ${response.status}`);
    }

    const confirmation: unknown = await response.json();
    if (
      typeof confirmation !== 'object' ||
      confirmation === null ||
      !('ok' in confirmation) ||
      confirmation.ok !== true
    ) {
      throw new Error('The server did not confirm lead delivery');
    }
  } finally {
    globalThis.clearTimeout(timeout);
  }
}
