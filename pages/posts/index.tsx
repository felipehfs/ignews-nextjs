import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { getPrismicClient } from "../../src/services/prismic";
import styles from "./styles.module.scss";
import Prismic from "@prismicio/client";
import {  RichText } from "prismic-dom";

interface Post {
    slug: string;
    title: string;
    except: string;
    upatedAt: string;
}

interface PostsProps {
    posts: Post[];
}

export default function Posts({
    posts
}: PostsProps) {
    return (
        <>
            <Head>
                <title>Posts | ignews</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts}>
                    {
                        posts.map(post => (
                            <Link href={`/posts/${post.slug}`} key={post.slug}>
                                <a key={post.slug}>
                                    <time>{post.upatedAt}</time>
                                    <strong>{post.title}</strong>
                                    <p>{post.except}</p>
                                </a>
                            </Link>
                        ))
                    }
                   
                </div>
            </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = await getPrismicClient();

    const response = await prismic.query<any>(
        Prismic.predicates.at('document.type', 'post'),
        {
            fetch: ['post.title', 'post.content'],
            pageSize: 100,
        }
    );

    // console.log(JSON.stringify(response, null, " "));

    const posts = response.results.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            except: post.data.content.find(content => content.type === "paragraph")?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })
        }
    })


    return {
        props: {
            posts
        }
    }
}