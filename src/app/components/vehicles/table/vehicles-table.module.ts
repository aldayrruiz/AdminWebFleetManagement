import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyAngularMaterialModule } from '../../../shared/angular-material.module';
import { VehiclesTableComponent } from './vehicles-table.component';
import { VehiclesPageRoutingModule } from 'src/app/pages/vehicles/vehicles-routing.module';

@NgModule({
  declarations: [VehiclesTableComponent],
  imports: [
    CommonModule,
    VehiclesPageRoutingModule /* This component is using vehicle types routing /admin/vehicle-types */,
    MyAngularMaterialModule,
  ],
  exports: [VehiclesTableComponent],
})
export class VehiclesTableModule {}
