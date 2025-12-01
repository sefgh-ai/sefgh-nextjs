/**
 * Generic empty state component
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.title - Title text
 * @param {string} props.description - Description text
 * @param {React.ReactNode} [props.action] - Optional action button
 * @param {string} [props.className] - Additional CSS classes
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      {Icon && (
        <div className="h-16 w-16 text-muted-foreground/50 mb-4">{Icon}</div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
