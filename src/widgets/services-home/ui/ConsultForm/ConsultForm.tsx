import { type FormEvent, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createLeadSubmissionId, submitLead } from '@shared/lib';
import { Button, Checkbox, Field, IconCheck, Input } from '@shared/ui';

import styles from './ConsultForm.module.scss';

type Errors = Partial<Record<'name' | 'phone' | 'consent', string>>;

/** Телефон валиден при ≥10 цифрах (допускаем +, скобки, пробелы, дефисы) — как в ContactForm. */
function isValidPhone(value: string): boolean {
  return (value.match(/\d/g) ?? []).length >= 10;
}

/** Компактная форма «Получить консультацию» с серверной доставкой заявки в два канала. */
export function ConsultForm() {
  const { t, i18n } = useTranslation();
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  const [values, setValues] = useState({ name: '', phone: '' });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  const submissionIdRef = useRef<string | null>(null);

  // Форма размонтируется вместе со сфокусированной кнопкой — переводим фокус на success-блок,
  // иначе клавиатурный пользователь падает на body, а скринридер не озвучивает результат.
  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const set = (name: 'name' | 'phone') => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
    setSubmitError(false);
  };

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = t('home.services.cta.form.errorRequired');
    if (!values.phone.trim()) next.phone = t('home.services.cta.form.errorRequired');
    else if (!isValidPhone(values.phone)) next.phone = t('home.services.cta.form.errorPhone');
    if (!consent) next.consent = t('home.services.cta.form.errorRequired');
    return next;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const website = String(new FormData(e.currentTarget).get('website') ?? '');
    setSubmitting(true);
    setSubmitError(false);

    try {
      submissionIdRef.current ??= createLeadSubmissionId();
      await submitLead({
        kind: 'consultation',
        ...values,
        consent: true,
        submissionId: submissionIdRef.current,
        locale: i18n.resolvedLanguage ?? i18n.language,
        page: window.location.pathname,
        website,
      });
      setSent(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className={styles.success} role="status" tabIndex={-1} ref={successRef}>
        <span className={styles.successIcon} aria-hidden="true">
          <IconCheck />
        </span>
        <p>{t('home.services.cta.form.success')}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate aria-busy={submitting}>
      <input
        className={styles.trap}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className={styles.row}>
        <Field
          id={fid('name')}
          label={t('home.services.cta.form.name.label')}
          error={errors.name}
          required
        >
          <Input
            id={fid('name')}
            name="name"
            autoComplete="name"
            maxLength={120}
            value={values.name}
            onChange={set('name')}
            invalid={!!errors.name}
            aria-required="true"
            aria-describedby={errors.name ? `${fid('name')}-error` : undefined}
            placeholder={t('home.services.cta.form.name.placeholder')}
          />
        </Field>
        <Field
          id={fid('phone')}
          label={t('home.services.cta.form.phone.label')}
          error={errors.phone}
          required
        >
          <Input
            id={fid('phone')}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={80}
            value={values.phone}
            onChange={set('phone')}
            invalid={!!errors.phone}
            aria-required="true"
            aria-describedby={errors.phone ? `${fid('phone')}-error` : undefined}
            placeholder={t('home.services.cta.form.phone.placeholder')}
          />
        </Field>
      </div>

      <div className={styles.consent}>
        <Checkbox
          id={fid('consent')}
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            setErrors((current) =>
              current.consent ? { ...current, consent: undefined } : current,
            );
            setSubmitError(false);
          }}
          label={t('home.services.cta.form.consent')}
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? `${fid('consent')}-error` : undefined}
        />
        {errors.consent && (
          <p role="alert" id={`${fid('consent')}-error`} className={styles.consentError}>
            {errors.consent}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className={styles.submit} disabled={submitting}>
        {submitting
          ? t('home.services.cta.form.submitting')
          : t('home.services.cta.form.submit')}
      </Button>

      {submitError && (
        <p className={styles.submitError} role="alert">
          {t('home.services.cta.form.errorSubmit')}
        </p>
      )}
    </form>
  );
}
