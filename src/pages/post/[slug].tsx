import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <main>
        <h1>Carregando...</h1>
      </main>
    );
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [time, setTime] = useState<number>();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const reducer = (accumulator, item): string[] => {
      return accumulator
        .concat(` ${RichText.asText(item.body)}`)
        .concat(` ${item.heading}`);
    };
    const allText = post?.data?.content?.reduce(reducer, '');
    const numberOfWords = allText
      ?.split(' ')
      ?.filter((word: string) => word !== '')?.length;

    const readingTime = Math.ceil(numberOfWords / 200);

    setTime(readingTime);
  }, [post?.data?.content]);

  return (
    <>
      <Head>
        <title>{post?.data?.title} | spacetraveling</title>
      </Head>
      <main className={styles.contentContainer}>
        <Header />
        <img
          className={styles.banner}
          src={post?.data?.banner?.url}
          alt="Article photograph"
        />
        <section className={styles.content}>
          <h1>{post?.data?.title}</h1>
          <div className={styles.postInfo}>
            <div className={styles.postInfoSection}>
              <FiCalendar />
              <time className={styles.iconText}>
                {format(new Date(post?.first_publication_date), 'dd LLL yyyy', {
                  locale: ptBR,
                })}
              </time>
            </div>
            <div className={styles.postInfoSection}>
              <FiUser />
              <span className={styles.iconText}>{post?.data?.author}</span>
            </div>
            <div className={styles.postInfoSection}>
              <FiClock />
              <span className={styles.iconText}>{time} min</span>
            </div>
          </div>
          <article>
            {post?.data?.content?.map(section => {
              return (
                <div key={section?.heading}>
                  <h2>{section?.heading}</h2>
                  {section?.body?.map(bodySection => {
                    return <p key={bodySection?.text}>{bodySection?.text}</p>;
                  })}
                </div>
              );
            })}
          </article>
        </section>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author', 'posts.content'],
    }
  );

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  return {
    props: {
      post: response,
    },
    revalidate: 1,
  };
};
