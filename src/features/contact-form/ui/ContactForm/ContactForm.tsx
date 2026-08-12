import { type FormEvent, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Checkbox, Field, IconCheck, IconLock, Input, Textarea } from '@shared/ui';

import styles from './ContactForm.module.scss';

type FieldName = 'name' | 'phone' | 'area' | 'comment';
type Errors = Partial<Record<FieldName | 'consent', string>>;

/** Считаем телефон корректным, если в нём ≥10 цифр (допускаем +, скобки, пробелы, дефисы). */
function isValidPhone(value: string): boolean {
  return (value.match(/\d/g) ?? []).length >= 10;
}

/**
 * Форма заявки (Имя/Телефон/Площадь/Комментарий + согласие). Отправка — заглушка (бэкенда нет):
 * валидируем и показываем успех. Переиспользуется в блоке «Давайте обсудим ваш проект» и на /contact.
 */
export function ContactForm() {
  const { t } = useTranslation();
  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  const [values, setValues] = useState({ name: '', phone: '', area: '', comment: '' });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  // После успеха форма (вместе со сфокусированным submit) размонтируется —
  // переносим фокус на блок успеха, иначе он падает на body (как в ConsultForm).
  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const set = (name: FieldName) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [name]: e.target.value }));

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = t('home.contactCta.form.errorRequired');
    if (!values.phone.trim()) next.phone = t('home.contactCta.form.errorRequired');
    else if (!isValidPhone(values.phone)) next.phone = t('home.contactCta.form.errorPhone');
    if (!consent) next.consent = t('home.contactCta.form.errorRequired');
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
        <p>{t('home.contactCta.form.success')}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <Field id={fid('name')} label={t('home.contactCta.form.name.label')} error={errors.name} required>
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

      <Field id={fid('area')} label={t('home.contactCta.form.area.label')}>
        <Input
          id={fid('area')}
          name="area"
          inputMode="numeric"
          value={values.area}
          onChange={set('area')}
          placeholder={t('home.contactCta.form.area.placeholder')}
        />
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
          onChange={(e) => setConsent(e.target.checked)}
          label={t('home.contactCta.form.consent')}
        />
        {errors.consent && (
          <p role="alert" className={styles.consentError}>
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
