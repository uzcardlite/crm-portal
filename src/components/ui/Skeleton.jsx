import { cn } from "../../utils/cn";

export default function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded bg-gray-100", className)} />;
}
