import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const articleId = searchParams.get("article_id");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "5");

  if (!articleId) {
    return NextResponse.json({ error: "article_id 必填" }, { status: 400 });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("comments")
    .select("*", { count: "exact" })
    .eq("article_id", articleId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    comments: data,
    total: count || 0,
    page,
    pageSize,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { article_id, author, content } = body;

  if (!article_id || !author || !content) {
    return NextResponse.json({ error: "article_id, author, content 必填" }, { status: 400 });
  }

  const date = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("comments")
    .insert({ article_id, author, content, date })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
