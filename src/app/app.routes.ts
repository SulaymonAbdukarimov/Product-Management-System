import { Route } from '@angular/router';

const loadProductFormComponent = () =>
  import('./pages/products/components/product-form/product-form.component');

export const routes: Route[] = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component'),
  },
  {
    path: 'products/add',
    loadComponent: loadProductFormComponent,
  },
  {
    path: 'products/edit/:id',
    loadComponent: loadProductFormComponent,
  },
  {
    path: 'product-details/:id',
    loadComponent: () =>
      import(
        './pages/products/components/product-details/product-details.component'
      ),
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
