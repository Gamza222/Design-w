import { type FormEvent, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Checkbox, Field, IconCheck, IconLock, Input, Textarea } from '@shared/ui';

import styles from './ContactForm.module.scss';

const PACKAGE_IDS = [
  'planning',
  'collages',
  'full',
  'planViz',
  'electric',
  'viz3d',
  'procurement',
  'supervision',
  'ergonomics',
  'prelaunch',
] as const;

type FieldName = 'name' | 'phone' | 'area' | 'premises' | 'package' | 'comment';
type Errors = Partial<Record<FieldName | 'consent', string>>;

interface ContactFormProps {
  /** Preselects the service that opened the order dialog. */
  initialPackage?: string;
}

interface Values {
  name: string;
  phone: string;
  area: string;
  premises: string;
  package: string;
  comment: string;
}

const PACKAGE_ID_SET = new Set<string>(PACKAGE_IDS);

/** A phone is valid when it contains at least ten digits. Formatting is intentionally flexible. */
function isValidPhone(value: string): boolean {
  return (value.match(/\d/g) ?? []).length >= 10;
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

/** Full project enquiry form. Submission is local until a mail delivery endpoint is connected. */
export function ContactForm({ initialPackage }: ContactFormProps) {
  const { t } = useTranslation();
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  const [values, setValues] = useState<Values>(() => initialValues(initialPackage));
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const set = (name: FieldName) => (e: { target: { value: string } }) => {
    const value = e.target.value;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  };

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = t('home.contactCta.form.errorRequired');
    if (!values.phone.trim()) next.phone = t('home.contactCta.form.errorRequired');
    else if (!isValidPhone(values.phone)) next.phone = t('home.contactCta.form.errorPhone');
    if (!values.premises) next.premises = t('home.contactCta.form.errorRequired');
    if (!values.area || Number(values.area) <= 0) {
      next.area = t('home.contactCta.form.errorRequired');
    }
    if (!values.package) next.package = t('home.contactCta.form.errorRequired');
    if (!consent) next.consent = t('home.contactCta.form.errorRequired');
    return next;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  }

  if (sent) {
    return (
      <div className={styles.success} role="status" tabIndex={-1} ref={successRef}>
        <span className={styles.successIcon} aria-hidden="true">
          <IconCheck />
        </span>
        <p>{t('home.contactCta.form.success')}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
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
            autoComplete="name"
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
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={set('phone')}
            invalid={!!errors.phone}
            aria-describedby={errors.phone ? `${fid('phone')}-error` : undefined}
            placeholder={t('home.contactCta.form.phone.placeholder')}
          />
        </Field>
      </div>

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
            type="number"
            inputMode="numeric"
            min={1}
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
          {PACKAGE_IDS.map((packageId) => (
            <option key={packageId} value={packageId}>
              {t(`home.services.items.${packageId}.name`)}
            </option>
          ))}
        </select>
      </Field>

      <Field id={fid('comment')} label={t('home.contactCta.form.comment.label')}>
        <Textarea
          id={fid('comment')}
          name="comment"
          rows={3}
          value={values.comment}
          onChange={set('comment')}
          placeholder={t('home.contactCta.form.comment.placeholder')}
        />
      </Field>

      <div className={styles.consent}>
        <Checkbox
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
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

      <Button type="submit" size="lg" className={styles.submit}>
        {t('home.contactCta.form.submit')}
      </Button>

      <p className={styles.privacy}>
        <IconLock aria-hidden="true" />
        <span>{t('home.contactCta.form.privacy')}</span>
      </p>
    </form>
  );
}
