import { afterEach, describe, expect, it, vi } from 'vitest';

import { createLeadSubmissionId, submitLead, type LeadPayload } from './submitLead';

const payload: LeadPayload = {
  kind: 'consultation',
  name: 'Анна',
  phone: '+7 999 123-45-67',
  consent: true,
  submissionId: '6bb51683-d236-4a8f-a580-986a495964d5',
  locale: 'ru',
  page: '/',
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('lead submission', () => {
  it('posts the complete lead to the REG.RU PHP endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);

    await submitLead(payload);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/lead.php',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
    );
    expect(fetchMock.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal);
  });

  it('rejects when the server cannot confirm both delivery channels', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 502 }));

    await expect(submitLead(payload)).rejects.toThrow('status 502');
  });

  it('creates an id suitable for safe retry deduplication', () => {
    expect(createLeadSubmissionId()).toMatch(/^[A-Za-z0-9-]{16,80}$/);
  });
});
