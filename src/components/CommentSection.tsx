"use client";

import { useState, useEffect, useCallback } from "react";
import { SkeletonComments } from "@/components/Skeleton";

interface Comment {
  id: number;
  article_id: number;
  author: string;
  content: string;
  date: string;
  created_at: string;
}

export default function CommentSection({ articleId }: { articleId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const fetchComments = useCallback(
    async (p: number) => {
      setLoading(true);
      const res = await fetch(
        `/api/comments?article_id=${articleId}&page=${p}&pageSize=${pageSize}`
      );
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
        setTotal(data.total);
      }
      setLoading(false);
    },
    [articleId]
  );

  useEffect(() => {
    fetchComments(page);
  }, [page, fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    setSubmitting(true);

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        article_id: articleId,
        author: author.trim(),
        content: content.trim(),
      }),
    });

    if (res.ok) {
      setAuthor("");
      setContent("");
      setPage(1);
      await fetchComments(1);
    }
    setSubmitting(false);
  }

  return (
    <div className="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-8">
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">
        评论 ({total})
      </h3>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="昵称"
          required
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下你的想法…"
          required
          rows={3}
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100 resize-y"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 text-sm rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium disabled:opacity-50"
        >
          {submitting ? "提交中..." : "发表评论"}
        </button>
      </form>

      {loading ? (
        <SkeletonComments count={3} />
      ) : comments.length === 0 ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">暂无评论，来说两句吧</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className="border-b border-zinc-100 dark:border-zinc-800 pb-4"
            >
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                  {c.author}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {c.date}
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                {c.content}
              </p>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-30 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            上一页
          </button>
          <span className="text-sm text-zinc-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-30 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
