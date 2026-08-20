import { Card } from "@mfe/design-system";
interface Product {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
}

const products: Product[] = [
  {
    id: 1,
    imageUrl: "https://placehold.co/240x240",
    name: "기본 반팔 티셔츠",
    price: 15000,
  },
  {
    id: 2,
    imageUrl: "https://placehold.co/240x240",
    name: "데님 팬츠",
    price: 39000,
  },
  {
    id: 3,
    imageUrl: "https://placehold.co/240x240",
    name: "캔버스 스니커즈",
    price: 52000,
  },
  {
    id: 4,
    imageUrl: "https://placehold.co/240x240",
    name: "니트 가디건",
    price: 45000,
  },
  {
    id: 5,
    imageUrl: "https://placehold.co/240x240",
    name: "체크 셔츠",
    price: 32000,
  },
];

export default function CatalogPage() {
  return (
    <div className="p-6">
      <h1 className="text-heading text-text-primary">상품 목록</h1>
      <div className="mt-4 grid grid-cols-4 gap-4">
        {products.map((p) => (
          <Card
            key={p.id}
            imageUrl={p.imageUrl}
            name={p.name}
            price={p.price}
            onAddToCart={() => alert(`${p.name}담기 클릭됨`)}
          />
        ))}
      </div>
    </div>
  );
}
