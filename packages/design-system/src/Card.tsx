interface CardProps {
  imageUrl: string;
  name: string;
  price: number;
  onAddToCart?: () => void;
}

export default function Card({
  imageUrl,
  name,
  price,
  onAddToCart,
}: CardProps) {
  return (
    <div className="max-w-[240px] overflow-hidden rounded-lg border border-border bg-surface">
      <img
        src={imageUrl}
        alt={name}
        className="aspect-square w-full object-cover"
      />
      <div className="p-3">
        <p className="mb-1 text-body text-text-primary">{name}</p>
        <p className="mb-2 text-price-text text-price">
          {price.toLocaleString()}원
        </p>
        <button
          onClick={onAddToCart}
          className="w-full cursor-pointer rounded-md border-0 bg-primary py-2 text-white"
        >
          담기
        </button>
      </div>
    </div>
  );
}
