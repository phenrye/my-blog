"use client";

export default function FilterBar({
  tags,
  selectedTag,
  onTagChange,
  keyword,
  onKeywordChange,
}: {
  tags: string[];
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
  keyword: string;
  onKeywordChange: (kw: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onTagChange(null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selectedTag === null
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          全部
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagChange(tag)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedTag === tag
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="搜索文章…"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-2 text-sm w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
      />
    </div>
  );
}
