import Link from "next/link";
import { FunctionComponent } from "react";
import Image from "next/image";
import { BlogPost } from "../@types/schema"

type BlogCardProps = {
    post: BlogPost
}


const BlogCard: FunctionComponent<BlogCardProps> = ({post}) => {
    return (
        <Link href={`/post/${post.slug}`}>
            <a  className="transition duration-300 hover:scale-105" href="">
                <div className="flex flex-col rounded-xl shadow-lg overflow-hidden">
                    <div className="flex flex-shrink-0">
                        {/* image */}
                        <img className="h-64 w-full object-cover"  src={post.cover} alt="Blog post cover"/> 
                    </div>
                        {/* text */}
                    <div className="flex-1 bg-gray-50 pt-2 pb-6 px-4 flex flex-col justify-between">
                        <div className="flex-1">
                            {/* date */}
                            <span className="block mt-2">
                                <h4 className="text-xs font-medium text-gray-600">{post.date}</h4>
                            </span>
                            {/* title */}
                            <span className="block mt-2">
                                <h4 className="text-xl font-medium text-gray-900">{post.title}</h4>
                            </span>
                            {/* description */}
                            <span className="block mt-2">
                                <h4 className="text-xs text-gray-600">{post.description}</h4>
                            </span>
                            {/* tags */}
                            <span className="block mt-2 space-x-4">
                                {
                                    post.tags.map(tag => (
                                        <span key={tag.id} className="bg-green-300 text-green-800 px-2 py-1 text-xs rounded-lg">
                                            #{tag.name}
                                        </span>
                                    ))
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    )
}

export default BlogCard