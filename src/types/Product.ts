export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  images?: string[];
  unit: number;
  smallestSellingUnit: number;
  isForSale: boolean;
  farmer: {
    id: string;
    name: string;
  };
}






