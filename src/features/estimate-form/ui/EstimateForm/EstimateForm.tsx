import { useTranslation } from 'react-i18next';

import styles from './EstimateForm.module.scss';

/**
 * STUB. Structural placeholder for the estimate/consultation request form.
 * The real implementation (fields, validation, submission target) lands in a
 * dedicated task — see CLAUDE.md.
 */
export function EstimateForm() {
  const { t } = useTranslation();

  return (
    <div className={styles.placeholder} role="note">
      {t('contact.formSoon')}
    </div>
  );
}
