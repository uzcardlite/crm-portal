export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-light/30 text-accent-dark">
          <Icon size={22} />
        </span>
      )}
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
    </div>
  );
}
