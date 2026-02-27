import Link from "next/link";

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb">
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {item.href ? (
            <Link href={item.href}>
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}

          {index < items.length - 1 && (
            <span className="breadcrumb-separator">
              /
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
