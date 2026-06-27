import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import { getArticleBySlug } from "@/lib/articles";
import CommentSection from "@/components/CommentSection";

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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return (
      <main className="max-w-3xl mx-auto w-full px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">文章不存在</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">找不到 slug 为「{slug}」的文章。</p>
        <Link
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium underline underline-offset-4"
        >
          ← 返回首页
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-12">
      <Link
        href="/"
        className="inline-block text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 mb-6 transition-colors"
      >
        ← 返回首页
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <time className="text-sm text-zinc-400 dark:text-zinc-500">{article.date}</time>
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
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </article>

        <CommentSection articleId={(article as unknown as { id: number }).id} />
    </main>
  );
}
