export function SkeletonLine({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse ${className}`}
    />
  );
}

/** 模拟文章卡片的骨架 */
export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 space-y-3">
      <SkeletonLine className="h-5 w-3/4" />
      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-5/6" />
      <div className="flex gap-2 pt-1">
        <SkeletonLine className="h-5 w-16 rounded-full" />
        <SkeletonLine className="h-5 w-12 rounded-full" />
      </div>
      <SkeletonLine className="h-3 w-24" />
    </div>
  );
}

/** 首页列表：N 个骨架卡片 */
export function SkeletonCardList({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="animate-fade-in"
          style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}
        >
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}

/** 文章详情页骨架 */
export function SkeletonDetail() {
  return (
    <div className="space-y-4 animate-pulse">
      <SkeletonLine className="h-4 w-20" />
      <SkeletonLine className="h-8 w-2/3" />
      <div className="flex gap-2">
        <SkeletonLine className="h-5 w-16 rounded-full" />
        <SkeletonLine className="h-5 w-12 rounded-full" />
      </div>
      <SkeletonLine className="h-3 w-28" />
      <div className="space-y-3 pt-6">
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-11/12" />
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-3/4" />
        <SkeletonLine className="h-4 w-full" />
        <SkeletonLine className="h-4 w-5/6" />
      </div>
    </div>
  );
}

/** 评论区骨架 */
export function SkeletonComments({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="border-b border-zinc-100 dark:border-zinc-800 pb-4 space-y-2">
          <div className="flex gap-2">
            <SkeletonLine className="h-4 w-20" />
            <SkeletonLine className="h-4 w-16" />
          </div>
          <SkeletonLine className="h-4 w-full" />
          <SkeletonLine className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}
