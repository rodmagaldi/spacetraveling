import Link from 'next/link';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.container}>
      <Link href="/">
        <a>
          <img
            className={styles.logo}
            src="/images/logo.svg"
            height={25}
            width={240}
            alt="logo"
          />
        </a>
      </Link>
    </header>
  );
}
