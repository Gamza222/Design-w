import { type FormEvent, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createLeadSubmissionId, submitLead, useHydrated } from '@shared/lib';
import { Button, Checkbox, Field, IconCheck, IconLock, Input, Textarea } from '@shared/ui';

import { TARIFF_IDS, getTariff, type TariffId } from '@entities/package';
import { useLocale } from '@shared/lib';
import { getLeadAttribution, type LeadContext } from '@shared/lib';

import styles from './ContactForm.module.scss';

type FieldName = 'name' | 'phone' | 'area' | 'premises' | 'package' | 'comment';
type Errors = Partial<Record<FieldName | 'consent', string>>;

interface ContactFormProps {
  /** Preselects the service that opened the order dialog. */
  initialPackage?: string;
  context?: LeadContext;
}

interface Values {
  name: string;
  phone: string;
  area: string;
  premises: string;
  package: string;
  comment: string;
}

const PACKAGE_ID_SET = new Set<string>(TARIFF_IDS);

/** Match the delivery endpoint's phone limits while allowing familiar formatting. */
function isValidPhone(value: string): boolean {
  const digits = (value.match(/\d/g) ?? []).length;
  return digits >= 10 && digits <= 18;
}

function initialValues(initialPackage?: string): Values {
  return {
    name: '',
    phone: '',
    area: '',
    premises: '',
    package: initialPackage && PACKAGE_ID_SET.has(initialPackage) ? initialPackage : '',
    comment: '',
  };
}

/** Enquiry delivered to both studio Telegram recipients by the PHP endpoint. */
export function ContactForm({ initialPackage, context }: ContactFormProps) {
  const hydrated = useHydrated();
  const locale = useLocale();
  const { t, i18n } = useTranslation();
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  const [values, setValues] = useState<Values>(() => initialValues(initialPackage));
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [leadNumber, setLeadNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  const submissionIdRef = useRef<string | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const set = (name: FieldName) => (e: { target: { value: string } }) => {
    const value = e.target.value;
    submissionIdRef.current = null;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
    setSubmitError(false);
  };

  function validate(): Errors {
    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = t('home.contactCta.form.errorRequired');
    if (!values.phone.trim()) next.phone = t('home.contactCta.form.errorRequired');
    else if (!isValidPhone(values.phone)) next.phone = t('home.contactCta.form.errorPhone');
    if (!context && !values.premises) next.premises = t('home.contactCta.form.errorRequired');
    if (
      !context &&
      (!values.area ||
        !Number.isFinite(Number(values.area)) ||
        Number(values.area) <= 0 ||
        Number(values.area) > 100000)
    ) {
      next.area = t('home.contactCta.form.errorRequired');
    }
    if (!context && !values.package) next.package = t('home.contactCta.form.errorRequired');
    if (!consent) next.consent = t('home.contactCta.form.errorRequired');
    return next;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const form = e.currentTarget;
      requestAnimationFrame(() =>
        form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }

    const website = String(new FormData(e.currentTarget).get('website') ?? '');
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError(false);

    try {
      submissionIdRef.current ??= createLeadSubmissionId();
      const result = await submitLead({
        kind: context ? 'consultation' : 'project',
        ...values,
        consent: true,
        submissionId: submissionIdRef.current,
        locale: i18n.resolvedLanguage ?? i18n.language,
        page: window.location.pathname,
        website,
        context: context ?? {
          source: 'contact-form',
          area: Number(values.area),
          ...(PACKAGE_ID_SET.has(values.package)
            ? {
                packageId: values.package,
                packageName: getTariff(values.package as TariffId, locale).name,
              }
            : {}),
        },
        attribution: getLeadAttribution(),
      });
      setLeadNumber(result.leadNumber);
      setSent(true);
    } catch {
      setSubmitError(true);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className={styles.success} role="status" tabIndex={-1} ref={successRef}>
        <span className={styles.successIcon} aria-hidden="true">
          <IconCheck />
        </span>
        <p>{t('home.contactCta.form.success')}</p>
        {leadNumber && <p>№ {leadNumber}</p>}
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={onSubmit}
      noValidate
      aria-busy={!hydrated || submitting}
    >
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
          label={t('home.contactCta.form.name.label')}
          error={errors.name}
          required
        >
          <Input
            id={fid('name')}
            name="name"
            disabled={!hydrated || submitting}
            aria-required="true"
            autoComplete="name"
            maxLength={120}
            value={values.name}
            onChange={set('name')}
            invalid={!!errors.name}
            aria-describedby={errors.name ? `${fid('name')}-error` : undefined}
            placeholder={t('home.contactCta.form.name.placeholder')}
          />
        </Field>
        <Field
          id={fid('phone')}
          label={t('home.contactCta.form.phone.label')}
          error={errors.phone}
          required
        >
          <Input
            id={fid('phone')}
            name="phone"
            disabled={!hydrated || submitting}
            aria-required="true"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={80}
            value={values.phone}
            onChange={set('phone')}
            invalid={!!errors.phone}
            aria-describedby={errors.phone ? `${fid('phone')}-error` : undefined}
            placeholder={t('home.contactCta.form.phone.placeholder')}
          />
        </Field>
      </div>

      {!context && (
        <>
          <div className={styles.row}>
            <Field
              id={fid('premises')}
              label={t('home.contactCta.form.premises.label')}
              error={errors.premises}
              required
            >
              <select
                id={fid('premises')}
                name="premises"
                disabled={!hydrated || submitting}
                aria-required="true"
                className={styles.select}
                value={values.premises}
                onChange={set('premises')}
                aria-invalid={!!errors.premises || undefined}
                aria-describedby={errors.premises ? `${fid('premises')}-error` : undefined}
              >
                <option value="" disabled>
                  {t('home.contactCta.form.premises.placeholder')}
                </option>
                <option value="apartment">{t('home.contactCta.form.premises.apartment')}</option>
                <option value="house">{t('home.contactCta.form.premises.house')}</option>
                <option value="office">{t('home.contactCta.form.premises.office')}</option>
              </select>
            </Field>

            <Field
              id={fid('area')}
              label={t('home.contactCta.form.area.label')}
              error={errors.area}
              required
            >
              <Input
                id={fid('area')}
                name="area"
                disabled={!hydrated || submitting}
                aria-required="true"
                type="number"
                inputMode="numeric"
                min={1}
                max={100000}
                value={values.area}
                onChange={set('area')}
                invalid={!!errors.area}
                aria-describedby={errors.area ? `${fid('area')}-error` : undefined}
                placeholder={t('home.contactCta.form.area.placeholder')}
              />
            </Field>
          </div>

          <Field
            id={fid('package')}
            label={t('home.contactCta.form.package.label')}
            error={errors.package}
            required
          >
            <select
              id={fid('package')}
              name="package"
              disabled={!hydrated || submitting}
              aria-required="true"
              className={styles.select}
              value={values.package}
              onChange={set('package')}
              aria-invalid={!!errors.package || undefined}
              aria-describedby={errors.package ? `${fid('package')}-error` : undefined}
            >
              <option value="" disabled>
                {t('home.contactCta.form.package.placeholder')}
              </option>
              <option value="unknown">{t('home.contactCta.form.package.unknown')}</option>
              {TARIFF_IDS.map((packageId) => (
                <option key={packageId} value={packageId}>
                  {getTariff(packageId as TariffId, locale).name}
                </option>
              ))}
            </select>
          </Field>
        </>
      )}

      <Field id={fid('comment')} label={t('home.contactCta.form.comment.label')}>
        <Textarea
          id={fid('comment')}
          name="comment"
          disabled={!hydrated || submitting}
          rows={3}
          maxLength={2800}
          value={values.comment}
          onChange={set('comment')}
          placeholder={t('home.contactCta.form.comment.placeholder')}
        />
      </Field>

      <div className={styles.consent}>
        <Checkbox
          id={fid('consent')}
          disabled={!hydrated || submitting}
          aria-required="true"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            setSubmitError(false);
            if (e.target.checked) {
              setErrors((current) =>
                current.consent ? { ...current, consent: undefined } : current,
              );
            }
          }}
          label={t('home.contactCta.form.consent')}
          aria-invalid={!!errors.consent || undefined}
          aria-describedby={errors.consent ? `${fid('consent')}-error` : undefined}
        />
        {errors.consent && (
          <p id={`${fid('consent')}-error`} role="alert" className={styles.consentError}>
            {errors.consent}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className={styles.submit} disabled={!hydrated || submitting}>
        {submitting ? t('home.contactCta.form.submitting') : t('home.contactCta.form.submit')}
      </Button>

      {submitError && (
        <p className={styles.submitError} role="alert">
          {t('home.contactCta.form.errorSubmit')}
        </p>
      )}

      <p className={styles.privacy}>
        <IconLock aria-hidden="true" />
        <span>{t('home.contactCta.form.privacy')}</span>
      </p>
    </form>
  );
}
