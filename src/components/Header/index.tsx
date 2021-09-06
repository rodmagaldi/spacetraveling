import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';

import logoImg from '../../../public/images/logo.svg';

export default function Header(): JSX.Element {
  return (
    <Link href="/">
      <a>
        <div className={styles.logo}>
          <Image src={logoImg} height={25} width={240} alt="logo" />
        </div>
      </a>
    </Link>
  );
}
