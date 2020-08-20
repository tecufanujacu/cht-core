import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HeaderComponent } from './components/header/header.component';
import { HeaderLogoPipe } from './pipes/header-logo.pipe';


@NgModule({
  declarations: [
    HeaderComponent,
    HeaderLogoPipe
  ],
  imports: [
    CommonModule,
    NgbModule
  ],
  exports: [
    HeaderComponent,
    HeaderLogoPipe
  ]
})
export class SharedModule { }
