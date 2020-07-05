import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';



@NgModule({
  declarations: [HeaderBarComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    HeaderBarComponent
  ]
})
export class SharedModule { }
