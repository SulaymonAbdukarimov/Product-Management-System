import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IProduct, Product } from '../../../constants';
import { PRODUCTS } from './data/product.data';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = PRODUCTS;
  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  public get products$(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.products$.pipe(
      map((products) => products.find((product) => product.id === id))
    );
  }

  addProduct(product: IProduct): Observable<Product> {
    const newProduct = { ...product, id: this.generateId() };
    const updatedProducts = [newProduct, ...this.productsSubject.getValue()];
    this.productsSubject.next(updatedProducts);
    return of(newProduct);
  }

  editProduct(id: number, updatedProduct: IProduct): Observable<Product> {
    const updatedProducts = this.productsSubject
      .getValue()
      .map((product) =>
        product.id === id ? { ...updatedProduct, id } : product
      );
    this.productsSubject.next(updatedProducts);
    return of({ ...updatedProduct, id });
  }

  deleteProduct(id: number): Observable<boolean> {
    const updatedProducts = this.productsSubject
      .getValue()
      .filter((product) => product.id !== id);
    this.productsSubject.next(updatedProducts);
    return of(true);
  }

  private generateId(): number {
    const currentProducts = this.productsSubject.getValue();
    return currentProducts.length
      ? Math.max(...currentProducts.map((p) => p.id)) + 1
      : 1;
  }
}
