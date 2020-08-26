import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderLogoPipe } from './resource-icon.pipe';


@NgModule({
  declarations: [
    HeaderLogoPipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    HeaderLogoPipe,
  ]
})
export class PipesModule { }
