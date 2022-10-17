import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { BlogPost, PostPage } from "../@types/schema";

export default class NotionService {
    client: Client
    n2m: NotionToMarkdown

    constructor() {
        this.client = new Client({auth: process.env.NOTION_ACCESS_TOKEN})
        this.n2m = new NotionToMarkdown({notionClient: this.client})
    }

    async getPublishedBlogPosts(): Promise<BlogPost[]> {
        const database = process.env.NOTION_BLOG_DB_ID ?? ''

        const response = await this.client.databases.query({
            database_id: database,
            filter: {
                property: 'Published',
                checkbox: {
                    equals: true
                }
            },
            sorts: [
                {
                    property: 'Created',
                    direction: 'descending'
                }
            ]
        })

        return response.results.map(res => {
            return NotionService.pageTransformer(res)
        })
    }

    async getSinglePost(slug: string): Promise<PostPage> {
        let post, markdown

        const database = process.env.NOTION_BLOG_DB_ID ?? ''

        const response = await this.client.databases.query({
            database_id: database,
            filter: {
                property: 'Slug',
                formula: {
                    string: {
                        equals: slug
                    }
                }
            }
        })

        if (!response.results[0]) {
            throw 'No results'
        }

        const page = response.results[0];

        const mdBlocks = await this.n2m.pageToMarkdown(page.id)
        markdown = this.n2m.toMarkdownString(mdBlocks)
        post = NotionService.pageTransformer(page)

        return {
            post,
            markdown
        }

    }

    private static pageTransformer(page: any): BlogPost {
        let cover = page.cover
        

        if (cover != null) {
            switch (cover.type) {
                case 'file': 
                    cover = page.cover.file
                    break
                case 'external':
                    cover = page.cover.external.url
                    break
                default:
                    cover = ''
            }
        } else {
            cover = ''
        }

        
        return {
            id: page.id,
            cover: cover,
            title: page.properties.Name.title[0]?.plain_text || 'Нет названия',
            tags: page.properties.Tags.multi_select,
            description: page.properties.Description.rich_text[0]?.plain_text || null,
            date: page.properties.Updated.last_edited_time,
            slug: page.properties.Slug.formula.string
        }
    }   
}