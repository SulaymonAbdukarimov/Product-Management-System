import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule } from '@angular/forms';
import { DEFAULT_LANGUAGE, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    TranslateModule,
    NzSelectModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  selectedLang = ''
  languagesOptionList = [
    {
      label: "O'zbek",
      value: 'uz',
    },
    {
      label: "Русский",
      value: 'ru',
    }, {
      label: "English",
      value: 'en',
    },
  ];

  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang('en')
    this.translateService.use('en')
  }


  ngOnInit(): void {
    this.selectedLang = localStorage.getItem('lang') || 'en'
  }

  changeLanguage() {
    this.translateService.use(this.selectedLang)
  }
}
