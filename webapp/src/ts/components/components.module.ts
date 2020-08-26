import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { PipesModule } from "../pipes/pipes.module";

@NgModule({
  declarations: [
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule
  ],
  exports: [
    HeaderComponent,
  ]
})
export class ComponentsModule { }
