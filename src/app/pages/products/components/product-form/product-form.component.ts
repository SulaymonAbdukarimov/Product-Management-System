import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProduct, Product, ProductCategory } from '../../../../constants';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { positivePriceValidator } from './validators/positive-price';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Notification } from '../../../../shared/decorators';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    TranslateModule,
    NzIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  productForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    price: [
      0,
      [Validators.required, Validators.min(0), positivePriceValidator],
    ],
    category: [ProductCategory.BOOKS, Validators.required],
    description: [''],
    stock: [false, Validators.required],
    sku: ['', Validators.required],
  });

  editingProduct: Product | null = null;
  categories = Object.values(ProductCategory);
  editingProductId!: number;

  ngOnInit(): void {
    this.loadProduct();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const product: IProduct = this.productForm.getRawValue();
    if (this.editingProduct) {
      this.updateProduct(product);
    } else {
      this.addProduct(product);
    }
  }

  private loadProduct(): void {
    this.route.params.subscribe((params) => {
      this.editingProductId = Number(params['id']);
      if (this.editingProductId) {
        this.handleEditProduct();
      }
      if (!this.editingProductId && this.router.url.includes('edit')) {
        this.navigateToProducts();
      }
    });
  }

  private handleEditProduct(): void {
    this.productService
      .getProductById(this.editingProductId)
      .pipe(
        tap((product) => {
          if (product) {
            this.editingProduct = product;
            this.productForm.patchValue(product);
          } else {
            this.navigateToProducts();
          }
        }),
        catchError(() => {
          this.navigateToProducts();
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  @Notification(
    'success',
    'Successfully edited the product!',
    'Failed to edit the product'
  )
  private updateProduct(product: IProduct): Observable<Product> {
    return this.productService.editProduct(this.editingProductId, product).pipe(
      tap(() => {
        this.navigateToProducts();
      })
    );
  }

  @Notification(
    'success',
    'Successfully edited the product! Please look at the beginning of the list.New added product added at the beginning of the list.',
    'Failed to add the product'
  )
  private addProduct(product: IProduct): Observable<Product> {
    return this.productService.addProduct(product).pipe(
      tap(() => {
        this.navigateToProducts();
      })
    );
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}
