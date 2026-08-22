export interface Product {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  stock: number;
}

export const products: Product[] = [
  {
    id: "1",
    imageUrl: "https://placehold.co/240x240",
    name: "기본 반팔 티셔츠",
    price: 15000,
    stock: 8,
  },
  {
    id: "2",
    imageUrl: "https://placehold.co/240x240",
    name: "데님 팬츠",
    price: 39000,
    stock: 3,
  },
  {
    id: "3",
    imageUrl: "https://placehold.co/240x240",
    name: "캔버스 스니커즈",
    price: 52000,
    stock: 5,
  },
  {
    id: "4",
    imageUrl: "https://placehold.co/240x240",
    name: "니트 가디건",
    price: 45000,
    stock: 11,
  },
  {
    id: "5",
    imageUrl: "https://placehold.co/240x240",
    name: "체크 셔츠",
    price: 32000,
    stock: 7,
  },
];
