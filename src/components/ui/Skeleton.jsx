import { cn } from "../../utils/cn";

// Every loading state in the app is a skeleton — never a spinner (DIZAYN.md §9).
export default function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-[10px] bg-white/[.06]", className)} />;
}
