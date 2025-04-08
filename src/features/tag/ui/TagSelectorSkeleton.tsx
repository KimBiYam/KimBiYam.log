export default function TagSelectorSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex pt-4 overflow-auto md:mx-0 scrollbar-hide main-container">
        {Array.from({ length: 8 }).map((_, index) => (
          <TagButtonSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

function TagButtonSkeleton() {
  return (
    <div className="flex-1 mx-1 mb-2 rounded-xl bg-slate-300 dark:bg-neutral-500 h-7 sm:h-6" />
  );
}
