import { getArticles } from "@/lib/articles";
import AdminPanel from "@/components/AdminPanel";

export default async function AdminPage() {
  const articles = await getArticles();

  return (
    <main className="max-w-5xl mx-auto w-full px-6 py-12">
      <AdminPanel
        initialArticles={articles.map((a) => ({ ...a, id: (a as unknown as { id: number }).id }))}
      />
    </main>
  );
}
