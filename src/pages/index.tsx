import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { FiCalendar } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import logoImg from '../../public/images/logo.svg';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  return (
    <>
      <Head>
        <title>home | spacetraveling</title>
      </Head>
      <main className={styles.contentContainer}>
        <div className={styles.logo}>
          <Image src={logoImg} height={25} width={240} alt="logo" />
        </div>

        <section className={styles.content}>
          <article>
            <h1>Como utilizar Hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.postInfo}>
              <div className={styles.postInfoSection}>
                <FiCalendar />
                <time className={styles.iconText}>15 Mar 2021</time>
              </div>
              <div className={styles.postInfoSection}>
                <FiUser />
                <span className={styles.iconText}>Diego Fernandes</span>
              </div>
            </div>
          </article>

          <article>
            <h1>Como utilizar Hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.postInfo}>
              <div className={styles.postInfoSection}>
                <FiCalendar />
                <time className={styles.iconText}>15 Mar 2021</time>
              </div>
              <div className={styles.postInfoSection}>
                <FiUser />
                <span className={styles.iconText}>Diego Fernandes</span>
              </div>
            </div>
          </article>

          <article>
            <h1>Como utilizar Hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.postInfo}>
              <div className={styles.postInfoSection}>
                <FiCalendar />
                <time className={styles.iconText}>15 Mar 2021</time>
              </div>
              <div className={styles.postInfoSection}>
                <FiUser />
                <span className={styles.iconText}>Diego Fernandes</span>
              </div>
            </div>
          </article>

          <article>
            <h1>Como utilizar Hooks</h1>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div className={styles.postInfo}>
              <div className={styles.postInfoSection}>
                <FiCalendar />
                <time className={styles.iconText}>15 Mar 2021</time>
              </div>
              <div className={styles.postInfoSection}>
                <FiUser />
                <span className={styles.iconText}>Diego Fernandes</span>
              </div>
            </div>
          </article>

          <span className={styles.loadMore}>Carregar mais posts</span>
        </section>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
