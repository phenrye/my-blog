import { supabase } from "@/lib/supabase";
import { Article } from "@/types";

export async function getArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("获取文章列表失败:", error);
    return [];
  }

  return data as Article[];
}

export async function getArticlesPaginated(
  page: number,
  pageSize: number
): Promise<{ articles: Article[]; total: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("articles")
    .select("*", { count: "exact" })
    .order("date", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("获取文章列表失败:", error);
    return { articles: [], total: 0 };
  }

  return { articles: (data as Article[]) || [], total: count || 0 };
}

export async function getArticleBySlug(
  slug: string
): Promise<Article | null> {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("获取文章详情失败:", error);
    return null;
  }

  return data as Article;
}
