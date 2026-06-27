import { getArticlesPaginated } from "@/lib/articles";
import HomeContent from "@/components/HomeContent";

const PAGE_SIZE = 6;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1") || 1);
  const { articles, total } = await getArticlesPaginated(page, PAGE_SIZE);

  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
        最新文章
      </h1>
      <HomeContent
        articles={articles}
        currentPage={page}
        total={total}
        pageSize={PAGE_SIZE}
      />
    </main>
  );
}
