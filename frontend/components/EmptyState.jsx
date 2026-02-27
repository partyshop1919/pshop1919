import Link from "next/link";

export default function EmptyState({
  title,
  message,
  actionLabel,
  actionHref
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">🛍️</div>

      <h3>{title}</h3>
      <p>{message}</p>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="btn"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
