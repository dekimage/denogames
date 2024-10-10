"use client";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import MobxStore from "@/mobx";
import Image from "next/image";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";

const BlogPost = observer(() => {
  const params = useParams();
  const slug = params.slug;

  useEffect(() => {
    if (slug) {
      MobxStore.fetchBlogDetails(slug);
    }
  }, [slug]);

  const blog = MobxStore.blogDetails.get(slug);
  const loading = MobxStore.isBlogDetailsLoading(slug);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!blog) {
    return <div>Blog post not found</div>;
  }

  return (
    <article className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <div className="mb-4 text-gray-600">
        <span>{blog.date}</span> | <span>{blog.category}</span>
      </div>
      {blog.thumbnail && (
        <Image
          src={blog.thumbnail}
          alt={blog.title}
          width={800}
          height={400}
          className="w-full h-auto mb-6"
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </article>
  );
});

export default BlogPost;
