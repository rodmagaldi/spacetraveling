import Link from 'next/link';

import styles from './exit-preview-button.module.scss';

export default function ExitPreviewButton(): JSX.Element {
  return (
    <Link href="/api/exit-preview">
      <div className={styles.button}>
        <a>Sair do modo Preview</a>
      </div>
    </Link>
  );
}
