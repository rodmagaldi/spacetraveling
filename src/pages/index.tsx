import { useState } from 'react';

import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';

import Prismic from '@prismicio/client';
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const fetchPosts = async (page = 1) => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
      page,
    }
  );

  return response;
};

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postsPagination);

  const handleLoadMore = async (): Promise<void> => {
    const response = await fetch(posts.next_page);
    const newPosts = await response.json();

    setPosts({
      next_page: newPosts.next_page,
      results: [...posts.results, ...newPosts.results],
    });
  };

  return (
    <>
      <Head>
        <title>home | spacetraveling</title>
      </Head>

      <main className={styles.contentContainer}>
        <img
          className={styles.logo}
          src="/images/logo.svg"
          height={25}
          width={240}
          alt="logo"
        />
        <section className={styles.content}>
          {posts?.results?.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <article>
                  <h1>{post.data.title}</h1>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.postInfo}>
                    <div className={styles.postInfoSection}>
                      <FiCalendar />
                      <time className={styles.iconText}>
                        {format(
                          new Date(post.first_publication_date),
                          'dd LLL yyyy',
                          {
                            locale: ptBR,
                          }
                        )}
                      </time>
                    </div>
                    <div className={styles.postInfoSection}>
                      <FiUser />
                      <span className={styles.iconText}>
                        {post.data.author}
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            </Link>
          ))}

          {posts.next_page && (
            <span
              className={styles.loadMore}
              role="button"
              tabIndex={0}
              onClick={handleLoadMore}
              onKeyDown={handleLoadMore}
            >
              Carregar mais posts
            </span>
          )}
        </section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetchPosts();

  return {
    props: { postsPagination: response },
  };
};
