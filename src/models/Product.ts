export interface Product {
  id: number;
  title: string;
  images?: string[];
  price: number;
  imageUrl?: string;
  description?: string;
  category: string;
  brand?: string;
  stock?: number;
  discountPercentage?: number;
}
