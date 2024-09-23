import { Route } from '@angular/router';
import { ROOT_ROUTE } from './constants';

const loadProductComponent = () =>
  import('./pages/products/products.component');

const loadProductDetailsComponent = () =>
  import(
    './pages/products/components/product-details/product-details.component'
  );

const loadProductFormComponent = () =>
  import('./pages/products/components/product-form/product-form.component');

export const routes: Route[] = [
  {
    path: '',
    redirectTo: ROOT_ROUTE.products,
    pathMatch: 'full',
  },
  {
    path: ROOT_ROUTE.products,
    loadComponent: loadProductComponent,
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
    loadComponent: loadProductDetailsComponent,
  },
  {
    path: '**',
    redirectTo: ROOT_ROUTE.products,
  },
];
