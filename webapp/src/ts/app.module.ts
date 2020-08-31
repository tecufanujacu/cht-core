import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";
import { StoreModule } from '@ngrx/store';
import { storeLogger } from 'ngrx-store-logger';
import { CookieModule } from "ngx-cookie";
import { TranslateModule } from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { PipesModule } from './pipes/pipes.module';
import { TranslationLoaderProvider } from './providers/translation-loader.provider';

import { environment } from './environments/environment';

import { reducers } from "./reducers";

const logger = reducer => {
  // default, no options
  return storeLogger()(reducer);
}
const metaReducers = environment.production ? [] : [logger];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentsModule,
    PipesModule,
    RouterModule,
    CookieModule.forRoot(),
    HttpClientModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslationLoaderProvider,
      }
    }),
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
