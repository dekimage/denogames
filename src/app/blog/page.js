"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const stripHtml = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const categories = [
  "All",
  "Podcast",
  "Kickstarter",
  "Playthrough",
  "Contest",
  "Advertisement",
  "Review",
  "Creative",
  "How To",
  "Tutorial",
  "Social Media",
  "News",
];

import MobxStore from "@/mobx";
import { observer } from "mobx-react";
import { LoadingSpinner } from "@/reusable-ui/LoadingSpinner";

const BlogCard = ({ blog }) => {
  const [plainExcerpt, setPlainExcerpt] = useState("");
  const [plainTitle, setPlainTitle] = useState("");

  useEffect(() => {
    const strippedContent = stripHtml(blog.content);
    setPlainExcerpt(strippedContent.slice(0, 120) + "...");

    const strippedTitle = stripHtml(blog.title);
    setPlainTitle(strippedTitle);
  }, [blog.content, blog.title]);

  return (
    <div className="box-shadow">
      <div className="box-combined bg-white shadow-md rounded-lg overflow-hidden relative pb-8">
        <div
          className={`absolute flag p-3 w-[150px] bg-green-400 flex pl-6 left-[0px] top-[18px] text-white uppercase text-[14px]`}
        >
          {blog.category}
        </div>
        <Image
          src={blog.thumbnail}
          alt={blog.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h2 className="text-xl mb-2">{plainTitle}</h2>

          <p className="text-sm text-light mb-2">{blog.date}</p>
          <div className="text-sm mb-4">{plainExcerpt}</div>
          <Link href={`/blog/${blog.slug}`}>
            <Button variant="reverse">Read More</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

function BlogGrid({ blogs }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

function BlogFilter({ onCategoryChange }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    onCategoryChange(category.toLowerCase());
  };

  return (
    <div className="mb-8">
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="w-full md:w-64 p-2 border border-gray-300 rounded-md"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

const BlogPage = observer(() => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    MobxStore.fetchBlogs();
  }, []);

  if (MobxStore.blogsLoading) {
    return <LoadingSpinner />;
  }

  const filteredBlogs = MobxStore.blogs.filter(
    (blog) =>
      selectedCategory === "All" ||
      blog.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-strike uppercase mb-4">Deno Games Blog</h1>
      <p className="text-xl uppercase font-strike text-light mb-6">
        {format(new Date(), "MMMM dd yyyy")}
      </p>

      <BlogFilter onCategoryChange={setSelectedCategory} />

      {filteredBlogs.length > 0 ? (
        <BlogGrid blogs={filteredBlogs} />
      ) : (
        <p className="text-center text-xl mt-8">No blogs found.</p>
      )}
    </div>
  );
});

export default BlogPage;
