import { useRouter } from 'next/router';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { RichText } from 'prismic-dom';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  reading_time_in_minutes?: number;
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
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>
      <main className={styles.contentContainer}>
        <Header />
        <img
          className={styles.banner}
          src={post.data.banner.url}
          alt="Article photograph"
        />
        <section className={styles.content}>
          <h1>{post.data.title}</h1>
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
            <div className={styles.postInfoSection}>
              <FiClock />
              <span className={styles.iconText}>
                {post.reading_time_in_minutes} Min
              </span>
            </div>
          </div>
          <article>
            {post.data.content.map(section => {
              return (
                <>
                  <h2 key={section.heading}>{section.heading}</h2>
                  {section.body.map(bodySection => {
                    return <p>{bodySection.text}</p>;
                  })}
                </>
              );
            })}
          </article>
        </section>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const reducer = (accumulator, item): string[] => {
    return accumulator
      .concat(` ${RichText.asText(item.body)}`)
      .concat(` ${item.heading}`);
  };
  const allText = response.data.content.reduce(reducer, '');
  const numberOfWords = allText
    .split(' ')
    .filter((word: string) => word !== '').length;

  const post: Post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd LLL yyyy',
      {
        locale: ptBR,
      }
    ),
    reading_time_in_minutes: Math.ceil(numberOfWords / 200),
    data: {
      author: response.data.author,
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
  };
};
