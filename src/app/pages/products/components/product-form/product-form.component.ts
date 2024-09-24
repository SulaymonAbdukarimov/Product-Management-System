import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product, ProductCategory } from '../../../../constants';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { positivePriceValidator } from './validators/positive-price';
import { catchError, EMPTY, tap } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TranslateModule } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

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
    NzIconModule
  ],
  providers: [NzNotificationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notification = inject(NzNotificationService);

  productForm!: FormGroup;
  editingProduct: Product | null = null;
  categories = Object.values(ProductCategory);
  editingProductId!: number;

  ngOnInit(): void {
    this.initForm();
    this.loadProduct();
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    const product: Product = this.productForm.value;
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
        this.productService
          .getProductById(this.editingProductId)
          .pipe(
            tap((product) => {
              if (product) {
                this.editingProduct = product;
                this.productForm.patchValue(product);
              } else {
                this.navigateToProducts()
              }
            }),
            catchError(() => {
              this.navigateToProducts()
              return EMPTY;
            })
          )
          .subscribe();
      }
      if (!this.editingProductId && this.router.url.includes('edit')) {
        this.navigateToProducts()
      }
    });
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [
        null,
        [Validators.required, Validators.min(0), positivePriceValidator],
      ],
      category: ['', Validators.required],
      description: [''],
      stock: [false, Validators.required],
      sku: ['', Validators.required],
    });
  }

  private updateProduct(product: Product): void {
    this.productService
      .editProduct(this.editingProductId, product)
      .subscribe(() => {
        this.notification.create(
          'success',
          'Successfully edited!',
          'You can check edited product.'
        );
        this.navigateToProducts();
      });
  }

  private addProduct(product: Product): void {
    this.productService.addProduct(product).subscribe(() => {
      this.notification.create(
        'success',
        'Successfully added!',
        'Please look at the beginning of the list.New added product added at the beginning of the list.'
      );
      this.navigateToProducts();
    });
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}
