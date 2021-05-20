import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyAngularMaterialModule } from '../../../shared/angular-material.module';
import { UsersTableComponent } from './users-table.component';
import { UsersRoutingModule } from 'src/app/pages/users/users-routing.module';


@NgModule({
  declarations: [
    UsersTableComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule, /* This component is using users routing /admin/users */
    MyAngularMaterialModule,
  ],
  exports: [UsersTableComponent]
})
export class UsersTableModule { }