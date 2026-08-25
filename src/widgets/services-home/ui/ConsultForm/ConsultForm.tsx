import { type FormEvent, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Checkbox, Field, IconCheck, Input } from '@shared/ui';

import styles from './ConsultForm.module.scss';

type Errors = Partial<Record<'name' | 'phone' | 'consent', string>>;

/** Телефон валиден при ≥10 цифрах (допускаем +, скобки, пробелы, дефисы) — как в ContactForm. */
function isValidPhone(value: string): boolean {
  return (value.match(/\d/g) ?? []).length >= 10;
}

/** Компактная форма «Получить консультацию» (имя + телефон + согласие) для тёмной панели
 *  блока услуг. Отправка — заглушка, как в @features/contact-form: валидация и success. */
export function ConsultForm() {
  const { t } = useTranslation();
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  const [values, setValues] = useState({ name: '', phone: '' });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  // Форма размонтируется вместе со сфокусированной кнопкой — переводим фокус на success-блок,
  // иначе клавиатурный пользователь падает на body, а скринридер не озвучивает результат.
  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const set = (name: 'name' | 'phone') => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [name]: e.target.value }));

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = t('home.services.cta.form.errorRequired');
    if (!values.phone.trim()) next.phone = t('home.services.cta.form.errorRequired');
    else if (!isValidPhone(values.phone)) next.phone = t('home.services.cta.form.errorPhone');
    if (!consent) next.consent = t('home.services.cta.form.errorRequired');
    return next;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true); // заглушка: реального запроса нет
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
    <form className={styles.form} onSubmit={onSubmit} noValidate>
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
          onChange={(e) => setConsent(e.target.checked)}
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

      <Button type="submit" size="lg" className={styles.submit}>
        {t('home.services.cta.form.submit')}
      </Button>
    </form>
  );
}