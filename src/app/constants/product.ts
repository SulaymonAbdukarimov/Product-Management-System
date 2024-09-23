export interface Product {
  id: number;
  name: string;
  price: number;
  category: ProductCategory;
  description?: string;
  stock: StockStatus;
  sku: string;
}

export enum ProductCategory {
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion',
  BOOKS = 'Books',
  HOME = 'Home',
  TOYS = 'Toys',
}

export enum StockStatus {
  IN_STOCK = 'In Stock',
  OUT_OF_STOCK = 'Out of Stock',
}

export interface ProductFormModel {
  name: string;
  price: number;
  category: ProductCategory;
  description?: string;
  stock: boolean;
  sku: string;
}
