import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ProductService } from './services/product.service';
import { Product } from '../../constants';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CurrencyPipe, NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  imports: [
    NzTableModule,
    NgFor,
    CurrencyPipe,
    NzButtonModule,
    RouterLink,
    NzInputModule,
    FormsModule,
  ],
  providers: [NzModalService, NzNotificationService],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponents implements OnInit {
  private productService = inject(ProductService);
  private modalService = inject(NzModalService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private notification = inject(NzNotificationService);

  allProducts = signal<Product[]>([]);
  searchInput$ = new Subject<string>();

  ngOnInit(): void {
    this.getProductsList();
    this.initializeSearchListener();
  }

  deleteProduct(event: Event, id: number): void {
    event.stopPropagation();
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this product?',
      nzOnOk: () => {
        this.productService.deleteProduct(id).subscribe(() => {
          let productsValue = this.allProducts();
          productsValue.filter((product) => product.id !== id);
          this.allProducts.set(productsValue);
          this.notification.create(
            'success',
            'Successfully deleted!',
            'You can see deleted product is not exist in the list.'
          );
        });
      },
    });
  }

  editProduct(event: Event, id: number): void {
    event.stopPropagation();
    this.router.navigate(['/products/edit/', id]);
  }

  updateProductSearchTerm(searchTerm: string) {
    this.searchInput$.next(searchTerm);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  private initializeSearchListener() {
    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => this.filterProductsByName(term)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((filteredProducts) => {
        this.allProducts.set(filteredProducts);
      });
  }

  private filterProductsByName(term: string) {
    return this.productService.getProducts().pipe(
      map((products) =>
        products.filter((product) =>
          product.name.toLowerCase().includes(term.toLowerCase())
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  private getProductsList() {
    this.productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        this.allProducts.set(products);
      });
  }
}
