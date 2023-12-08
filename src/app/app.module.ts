import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { AppComponent } from './app.component';
import { PrivateTutoring } from './app.pt';
import { ProductListComponent } from './products/product-list.component';
import { TeacherList } from './products/teacher.pt';
import { CTSpipe } from './shared/c-t-s.pipe';
import { PhonePipe } from './shared/phone-pipe';


@NgModule({
  declarations: [
    AppComponent ,
    ProductListComponent,
    TeacherList,
    PrivateTutoring,
    CTSpipe,
    PhonePipe
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  bootstrap: [AppComponent ,
    PrivateTutoring,
  ]
})
export class AppModule { }
