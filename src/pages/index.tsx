import { useState } from 'react';

import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

import logoImg from '../../public/images/logo.svg';

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

const mapPostsPagination = (response: any): PostPagination => {
  const postsPagination: PostPagination = {
    next_page: response.next_page,
    results: response.results.map(post => ({
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd LLL yyyy',
        {
          locale: ptBR,
        }
      ),
      data: {
        author: post.data.author,
        subtitle: post.data.subtitle,
        title: post.data.title,
      },
    })),
  };

  return postsPagination;
};

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState(postsPagination);

  const handleLoadMore = async (): Promise<void> => {
    setPage(page + 1);
    const newPosts = mapPostsPagination(await fetchPosts(page + 1));
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
        <div className={styles.logo}>
          <Image src={logoImg} height={25} width={240} alt="logo" />
        </div>

        <section className={styles.content}>
          {posts?.results?.map(post => (
            <article key={post.uid}>
              <h1>{post.data.title}</h1>
              <p>{post.data.subtitle}</p>
              <div className={styles.postInfo}>
                <div className={styles.postInfoSection}>
                  <FiCalendar />
                  <time className={styles.iconText}>
                    {post.first_publication_date}
                  </time>
                </div>
                <div className={styles.postInfoSection}>
                  <FiUser />
                  <span className={styles.iconText}>{post.data.author}</span>
                </div>
              </div>
            </article>
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

  const postsPagination = mapPostsPagination(response);

  return {
    props: { postsPagination },
  };
};
