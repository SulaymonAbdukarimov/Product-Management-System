import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ProductService } from './services/product.service';
import { Product } from '../../constants';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  Subject,
  switchMap,
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TranslateModule } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DeleteConfirmation, Notification } from '../../shared/decorators';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  imports: [
    NzTableModule,
    CurrencyPipe,
    NzButtonModule,
    RouterLink,
    NzInputModule,
    FormsModule,
    TranslateModule,
    NzIconModule,
    NzCardModule,
  ],
  providers: [NzNotificationService],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductsComponents implements OnInit {
  //#region PRIVATE PROPERTIES
  private productService = inject(ProductService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  //#endregion

  //#region PUBLIC PROPERTIES
  allProducts = signal<Product[]>([]);
  searchInput$ = new Subject<string>();
  isMobile = signal<boolean>(false);
  //#endregion

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile.set(window.innerWidth < 768);
  }

  ngOnInit(): void {
    this.isMobile.set(window.innerWidth < 768);
    this.getProductsList();
    this.initializeSearchListener();
  }

  deleteProduct(event: Event, id: number): void {
    event.stopPropagation();
    this.confirmToDelete(id);
  }

  @DeleteConfirmation()
  @Notification(
    'success',
    'Product successfully deleted!',
    'Failed to delete the product'
  )
  confirmToDelete(id: number): Observable<boolean> {
    return this.productService.deleteProduct(id);
  }

  editProduct(event: Event, id: number): void {
    event.stopPropagation();
    this.router.navigate(['/products/edit/', id]);
  }

  updateProductSearchTerm(searchTerm: string) {
    this.searchInput$.next(searchTerm);
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
    return this.productService.products$.pipe(
      map((products) =>
        products.filter((product) =>
          product.name.toLowerCase().includes(term.toLowerCase())
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  private getProductsList() {
    this.productService.products$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((products) => {
        this.allProducts.set(products);
      });
  }
}
