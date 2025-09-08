import { Component } from '@angular/core';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  constructor(
    private translationService: TranslationService
  ) {}

  t(key: string): string {
    return this.translationService.translate(key);
  }

}
