import {  GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { RichText } from "prismic-dom";
import { useEffect } from "react";
import { getPrismicClient } from "../../../src/services/prismic";
import styles from "../post.module.scss";
import { useRouter } from "next/router";

interface PostPreviewProps {
    post: {
        slug: string
        title: string
        updatedAt: string
        content: string;
    }
}

export default function PostPreview({ post }: PostPreviewProps) {
    const {data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.activeSubscription) {
            router.push('/posts');
        }
    }, [session, router]);

    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div 
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }} 
                    />
                    <div className={styles.continueReading}>
                        Wanna continue reading?😊
                        <Link href="/">
                            <a href="">Subscribe me</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    );
} 

export const getStaticPaths = () => {
    return {
        paths: [
            { params: { slug: 'o-que-e-arquitetura-serverless' }}
        ],
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const prismic = getPrismicClient();
    
    const { slug} = params
    
    const response = await prismic.getByUID<any>("post", String(slug), {});
    
    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.slice(0, 3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
    };
    
    return { 
        props: {
            post
        },
        redirect: 30 * 60,
    }
}