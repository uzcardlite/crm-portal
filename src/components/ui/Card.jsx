import { cn } from "../../utils/cn";

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn("rounded-card border border-gray-100 bg-white p-4 shadow-card", className)}
      {...props}
    >
      {children}
    </div>
  );
}
