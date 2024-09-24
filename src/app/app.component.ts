import {
  Component,
  HostListener,
  inject,
  Injector,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AVAILABLE_LANGS } from './constants';
import { StorageService } from './shared/services';

export let AppInjector: Injector;

const MOBILE_BREAKPOINT = 768;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    TranslateModule,
    NzSelectModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private translateService = inject(TranslateService);
  private storageService = inject(StorageService);

  readonly languagesOptionList = AVAILABLE_LANGS;
  isCollapsed = false;
  selectedLanguage = '';
  isMobile = signal<boolean>(false);

  constructor(injector: Injector) {
    AppInjector = injector;
  }

  ngOnInit(): void {
    this.isMobile.set(window.innerWidth < MOBILE_BREAKPOINT);
    const currentLanguage = this.storageService.lang;
    this.translateService.setDefaultLang(currentLanguage);
    this.translateService.use(currentLanguage);
    this.selectedLanguage = currentLanguage;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile.set(window.innerWidth < MOBILE_BREAKPOINT);
  }

  changeLanguage() {
    this.storageService.lang = this.selectedLanguage;
    this.translateService.use(this.selectedLanguage);
  }
}
