import { Inject, Injectable } from '@angular/core';
import { STORAGE_KEY } from '../../constants';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: Storage;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.storage = this.document.defaultView?.localStorage!;
  }

  get lang(): string {
    return this.storage?.getItem(STORAGE_KEY.language) ?? 'uz';
  }

  set lang(activeLang: string) {
    this.storage?.setItem(STORAGE_KEY.language, activeLang);
  }
}
