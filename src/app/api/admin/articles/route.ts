import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, slug, summary, tags, content } = body;

  const { data, error } = await supabaseAdmin
    .from("articles")
    .insert({ title, slug, summary, tags, content, date: new Date().toISOString().split("T")[0] })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}
