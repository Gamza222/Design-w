import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { submitLead, type LeadPayload } from './submitLead';

const google = vi.fn();
const yandex = vi.fn();
let payload: LeadPayload;

beforeEach(() => {
  google.mockReset();
  yandex.mockReset();
  window.sessionStorage.clear();
  vi.stubGlobal('gtag', google);
  vi.stubGlobal('ym', yandex);
  payload = {
    kind: 'consultation',
    name: 'Private name',
    phone: '+79991234567',
    comment: 'Private message',
    consent: true,
    submissionId: crypto.randomUUID(),
  };
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(Response.json({ ok: true, leadNumber: 'ABCD23456' })),
  );
});
afterEach(() => vi.unstubAllGlobals());

describe('confirmed lead analytics', () => {
  it('sends only the lead type after delivery, once per attempt', async () => {
    // Fetch returns a fresh response for each retry, like a real HTTP request.
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockImplementation(() =>
          Promise.resolve(Response.json({ ok: true, leadNumber: 'ABCD23456' })),
        ),
    );
    await submitLead(payload);
    await submitLead(payload);
    expect(google).toHaveBeenCalledExactlyOnceWith('event', 'generate_lead', {
      lead_type: 'consultation',
      send_to: 'G-FGETKE5FZQ',
    });
    expect(yandex).toHaveBeenCalledExactlyOnceWith(113598335, 'reachGoal', 'lead_success', {
      lead_type: 'consultation',
    });
  });

  it.each([null, {}, { ok: true }, { ok: false, leadNumber: 'ABCD23456' }])(
    'ignores unconfirmed success: %j',
    async (body) => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(body)));
      await expect(submitLead(payload)).rejects.toThrow();
      expect(google).not.toHaveBeenCalled();
      expect(yandex).not.toHaveBeenCalled();
    },
  );

  it('does not count a failed request', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 502 })));
    await expect(submitLead(payload)).rejects.toThrow();
    expect(google).not.toHaveBeenCalled();
    expect(yandex).not.toHaveBeenCalled();
  });

  it('returns the delivered result when counters are unavailable', async () => {
    vi.stubGlobal('gtag', undefined);
    vi.stubGlobal('ym', undefined);
    await expect(submitLead(payload)).resolves.toEqual({ leadNumber: 'ABCD23456' });
  });

  it('isolates an analytics exception from the other counter and the form', async () => {
    google.mockImplementation(() => {
      throw new Error('blocked');
    });
    await expect(submitLead(payload)).resolves.toEqual({ leadNumber: 'ABCD23456' });
    expect(yandex).toHaveBeenCalledOnce();
  });

  it('respects deduplication saved across a reload', async () => {
    window.sessionStorage.setItem(`designseichas:confirmed-lead:${payload.submissionId}`, '1');
    await submitLead(payload);
    expect(google).not.toHaveBeenCalled();
    expect(yandex).not.toHaveBeenCalled();
  });
});
