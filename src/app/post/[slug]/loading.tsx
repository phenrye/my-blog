import { SkeletonDetail } from "@/components/Skeleton";

export default function PostLoading() {
  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-12">
      <SkeletonDetail />
    </main>
  );
}
