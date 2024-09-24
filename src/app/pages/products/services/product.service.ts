import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../../constants';
import { products } from './data/product.data';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = products;
  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  private products$ = this.productsSubject.asObservable();

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.products$.pipe(
      map((products) => products.find((product) => product.id === id))
    );
  }

  addProduct(product: Product): Observable<Product> {
    const newProduct = { ...product, id: this.generateId() };
    const updatedProducts = [newProduct, ...this.productsSubject.getValue()];
    this.productsSubject.next(updatedProducts);
    return of(newProduct);
  }

  editProduct(id: number, updatedProduct: Product): Observable<Product> {
    const updatedProducts = this.productsSubject
      .getValue()
      .map((product) =>
        product.id === id ? { ...updatedProduct, id } : product
      );
    this.productsSubject.next(updatedProducts);
    return of(updatedProduct);
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
