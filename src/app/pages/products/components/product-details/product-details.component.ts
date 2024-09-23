import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../../../constants';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  imports: [NzCardModule, NzButtonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private $productService = inject(ProductService);

  product = signal<Product | undefined>(undefined);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = Number(params['id']);
      this.$productService.getProductById(id).subscribe((product) => {
        this.product.set(product);
        this.loading.set(false);
      });
    });
  }
  backToList() {
    this.router.navigate(['/products']);
  }
}
