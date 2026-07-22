// ui/PageHeader is not used here: this app has no admin `mb-6`/`text-lg`
// page rhythm — the portal uses its own `space-y-4` column instead.
export default function PortalPageHeader({ title, subtitle, children }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-0.5 truncate text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
