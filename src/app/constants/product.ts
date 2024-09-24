export interface IProduct {
  id?: number;
  name: string;
  price: number;
  category: ProductCategory;
  description?: string;
  stock: boolean;
  sku: string;
}

export interface Product extends IProduct {
  id: number;
}

export enum ProductCategory {
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion',
  BOOKS = 'Books',
  HOME = 'Home',
  TOYS = 'Toys',
}
export interface ProductFormModel {
  name: string;
  price: number;
  category: ProductCategory;
  description?: string;
  stock: boolean;
  sku: string;
}
