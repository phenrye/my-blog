"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Article } from "@/types";

interface ArticleRow extends Article {
  id: number;
}

export default function AdminPanel({
  initialArticles,
}: {
  initialArticles: ArticleRow[];
}) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [articles, setArticles] = useState<ArticleRow[]>(initialArticles);
  const [modal, setModal] = useState<{
    open: boolean;
    article?: ArticleRow;
  }>({ open: false });
  const [saving, setSaving] = useState(false);
  const [mdContent, setMdContent] = useState("");
  const editRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "1") setAuthed(true);
  }, []);

  useEffect(() => {
    if (modal.open) {
      setMdContent(modal.article?.content || "");
    }
  }, [modal]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "1");
      setAuthed(true);
      setError("");
    } else {
      setError("密码错误");
    }
  }

  const refresh = useCallback(async () => {
    const res = await fetch("/admin?json=1");
    if (res.ok) {
      const data = await res.json();
      setArticles(data);
    }
  }, []);

  function syncScroll(source: "edit" | "preview") {
    if (!editRef.current || !previewRef.current) return;
    if (source === "edit") {
      const pct = editRef.current.scrollTop / (editRef.current.scrollHeight - editRef.current.clientHeight);
      previewRef.current.scrollTop = pct * (previewRef.current.scrollHeight - previewRef.current.clientHeight);
    } else {
      const pct = previewRef.current.scrollTop / (previewRef.current.scrollHeight - previewRef.current.clientHeight);
      editRef.current.scrollTop = pct * (editRef.current.scrollHeight - editRef.current.clientHeight);
    }
  }

  if (!authed) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 w-full max-w-sm"
        >
          <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
            管理员登录
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg py-2 text-sm font-medium"
          >
            登录
          </button>
        </form>
      </div>
    );
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const tags = ((form.get("tags") as string) || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const body = {
      title: form.get("title") as string,
      slug: form.get("slug") as string,
      summary: form.get("summary") as string,
      content: form.get("content") as string,
      tags,
    };

    const isEdit = modal.article?.id;
    const url = isEdit
      ? `/api/admin/articles/${modal.article!.id}`
      : "/api/admin/articles";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setModal({ open: false });
      setSaving(false);
      refresh();
    } else {
      const err = await res.json();
      alert("保存失败: " + err.error);
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("确定删除这篇文章？此操作不可撤销。")) return;
    const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    if (res.ok) {
      refresh();
    } else {
      const err = await res.json();
      alert("删除失败: " + err.error);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          文章管理
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setModal({ open: true })}
            className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg px-4 py-2 text-sm font-medium"
          >
            + 新建文章
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_auth");
              setAuthed(false);
              setPassword("");
            }}
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            退出
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <th className="py-3 pr-4 font-medium text-zinc-500">标题</th>
              <th className="py-3 pr-4 font-medium text-zinc-500">slug</th>
              <th className="py-3 pr-4 font-medium text-zinc-500 hidden md:table-cell">
                摘要
              </th>
              <th className="py-3 pr-4 font-medium text-zinc-500 hidden lg:table-cell">
                标签
              </th>
              <th className="py-3 pr-4 font-medium text-zinc-500 hidden sm:table-cell">
                日期
              </th>
              <th className="py-3 font-medium text-zinc-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr
                key={a.id}
                className="border-b border-zinc-100 dark:border-zinc-800"
              >
                <td className="py-3 pr-4 font-medium text-zinc-900 dark:text-zinc-100 max-w-48 truncate">
                  {a.title}
                </td>
                <td className="py-3 pr-4 text-zinc-500 font-mono text-xs max-w-32 truncate">
                  {a.slug}
                </td>
                <td className="py-3 pr-4 text-zinc-500 hidden md:table-cell max-w-64 truncate">
                  {a.summary}
                </td>
                <td className="py-3 pr-4 hidden lg:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {a.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 pr-4 text-zinc-500 hidden sm:table-cell whitespace-nowrap">
                  {a.date}
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setModal({ open: true, article: a })}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setModal({ open: false })}
          />
          <div className="relative bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto mx-4">
            <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {modal.article ? "编辑文章" : "新建文章"}
              </h2>
              <button
                onClick={() => setModal({ open: false })}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  标题
                </label>
                <input
                  name="title"
                  required
                  defaultValue={modal.article?.title || ""}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Slug
                </label>
                <input
                  name="slug"
                  required
                  defaultValue={modal.article?.slug || ""}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  标签（逗号分隔）
                </label>
                <input
                  name="tags"
                  defaultValue={modal.article?.tags.join(", ") || ""}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  摘要
                </label>
                <input
                  name="summary"
                  required
                  defaultValue={modal.article?.summary || ""}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Markdown 正文
                </label>
                <div className="flex gap-3 h-[420px]">
                  <div className="flex-1 flex flex-col">
                    <div className="text-xs text-zinc-400 mb-1">编辑</div>
                    <textarea
                      ref={editRef}
                      name="content"
                      required
                      value={mdContent}
                      onChange={(e) => setMdContent(e.target.value)}
                      onScroll={() => syncScroll("edit")}
                      className="flex-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100 resize-none"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="text-xs text-zinc-400 mb-1">预览</div>
                    <div
                      ref={previewRef}
                      onScroll={() => syncScroll("preview")}
                      className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 overflow-y-auto"
                    >
                      {mdContent ? (
                        <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none">
                          <ReactMarkdown>{mdContent}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm text-zinc-400">输入 Markdown 即可预览…</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal({ open: false })}
                  className="px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium disabled:opacity-50"
                >
                  {saving ? "保存中..." : "保存"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
