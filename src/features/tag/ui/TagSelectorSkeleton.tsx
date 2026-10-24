export default function TagSelectorSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex gap-2 pt-2 pb-8 overflow-auto md:mx-0 scrollbar-hide">
        {Array.from({ length: 5 }).map((_, index) => (
          <TagButtonSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

function TagButtonSkeleton() {
  return (
    <div className="w-20 h-[33px] border rounded-full border-line bg-glass" />
  );
}
