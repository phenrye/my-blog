"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Article } from "@/types";
import ArticleCard from "@/components/ArticleCard";
import FilterBar from "@/components/FilterBar";

interface Props {
  articles: Article[];
  currentPage: number;
  total: number;
  pageSize: number;
}

export default function HomeContent({ articles, currentPage, total, pageSize }: Props) {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");

  const allTags = useMemo(
    () => [...new Set(articles.flatMap((a) => a.tags))],
    [articles]
  );

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return articles.filter((a) => {
      if (selectedTag && !a.tags.includes(selectedTag)) return false;
      if (kw) {
        const inTitle = a.title.toLowerCase().includes(kw);
        const inSummary = a.summary.toLowerCase().includes(kw);
        if (!inTitle && !inSummary) return false;
      }
      return true;
    });
  }, [articles, selectedTag, keyword]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function goToPage(p: number) {
    const url = p === 1 ? "/" : `/?page=${p}`;
    router.push(url);
  }

  return (
    <>
      <FilterBar
        tags={allTags}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        keyword={keyword}
        onKeywordChange={setKeyword}
      />

      {filtered.length === 0 ? (
        <p className="text-center text-zinc-400 dark:text-zinc-500 py-16">
          没有找到匹配的文章
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((article, i) => (
            <div
              key={article.slug}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-30 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            ← 上一页
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
            p === currentPage ? (
              <span
                key={p}
                className="px-3 py-1.5 text-sm rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium"
              >
                {p}
              </span>
            ) : (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className="px-3 py-1.5 text-sm rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-30 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            下一页 →
          </button>
        </div>
      )}
    </>
  );
}
