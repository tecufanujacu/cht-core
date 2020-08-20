import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ResourceIcons } from '@m-services/resource-icons.service';

@Pipe({
  name: 'headerLogo'
})
export class HeaderLogoPipe implements PipeTransform {

  constructor(
    private resourceIcons: ResourceIcons,
    private sanitizer: DomSanitizer
  ) { }

  transform(name: string): SafeHtml {
    const image = this.resourceIcons.getImg(name, 'branding') || '';

    return this.sanitizer.bypassSecurityTrustHtml(image);
  }

}
