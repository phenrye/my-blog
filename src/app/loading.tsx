import { SkeletonCardList } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-12">
      <div className="h-8 w-36 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse mb-8" />
      <SkeletonCardList count={6} />
    </main>
  );
}
