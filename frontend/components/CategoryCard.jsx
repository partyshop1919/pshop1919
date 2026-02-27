import Link from "next/link";

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="category-card"
    >
      <div className="category-image">
        <img
          src={category.image || "/images/placeholder.jpg"}
          alt={category.name}
          loading="lazy"
        />
      </div>

      <div className="category-content">
        <h3>{category.name}</h3>

        {category.intro && (
          <p>{category.intro}</p>
        )}
      </div>
    </Link>
  );
}
