import type { GetStaticProps, InferGetStaticPropsType} from 'next'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import Head from 'next/head';
import NotionService from "../../services/notion-service";

export async function getStaticPaths() {
    const notionService = new NotionService()

    const posts = await notionService.getPublishedBlogPosts()

    const paths = posts.map(post => {
        return `/post/${post.slug}`
    })
    
    return {
        paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const notionService = new NotionService()


    // @ts-ignore
    const p = await notionService.getSinglePost(context.params?.slug)

    if (!p) {
        throw 'Error'
    }

    return {
        props: {
            markdown: p.markdown,
            post: p.post
        },
        revalidate: 10
    }
}

const Post = ({markdown, post}: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <>
            <Head>
                <title>{post.title}</title>
                <meta name={"description"} title={"description"} content={post.description}/>
                <meta name={"og:description"} title={"og:description"} content={post.description}/>
                <meta name={"og:image"} title={"og:title"} content={post.cover}/>
            </Head>

            <div className='min-h-screen'>
                <div className='max-w-4xl mx-auto'>
                    <article className='flex flex-col items-center justify-center'>
                        <ReactMarkdown>{markdown}</ReactMarkdown>
                    </article>
                </div>
            </div>
        </>
    )
}

export default Post