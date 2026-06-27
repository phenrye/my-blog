import Link from "next/link";
import React from "react";

const tagColors = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
  "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
  "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200",
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export default function ArticleCard({
  article,
}: {
  article: {
    title: string;
    slug: string;
    summary: string;
    date: string;
    tags: string[];
  };
}) {
  return (
    <Link href={`/post/${article.slug}`} className="block">
      <article className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          {article.title}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
          {article.summary}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <time className="text-sm text-zinc-400 dark:text-zinc-500">
            {article.date}
          </time>
          <div className="flex gap-2 flex-wrap">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${
                  tagColors[hashString(tag) % tagColors.length]
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
