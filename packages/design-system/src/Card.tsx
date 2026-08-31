interface CardProps {
  imageUrl: string;
  name: string;
  price: number;
  onAddToCart?: () => void;
  onClick?: () => void;
  soldOut?: boolean;
  priority?: boolean;
}

export default function Card({
  imageUrl,
  name,
  price,
  onAddToCart,
  onClick,
  soldOut = false,
  priority = false,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className="w-full overflow-hidden rounded-lg border border-border bg-surface"
    >
      <img
        src={imageUrl}
        alt={name}
        className="aspect-square w-full object-cover"
        fetchPriority={priority ? "high" : "auto"}
      />
      <div className="p-3">
        <p className="mb-1 text-body text-text-primary">{name}</p>
        <p className="mb-2 text-price-text text-price">
          {price.toLocaleString()}원
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.();
          }}
          disabled={soldOut}
          className={`w-full rounded-md border-0 bg-primary py-2 text-white ${soldOut ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
          {soldOut ? "품절" : "담기"}
        </button>
      </div>
    </div>
  );
}
