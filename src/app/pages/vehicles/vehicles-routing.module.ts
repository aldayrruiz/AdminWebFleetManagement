import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclesResolver } from './vehicles-resolver.service';
import { VehiclesPage } from './vehicles.page';

const routes: Routes = [
  {
    path: '',
    component: VehiclesPage,
    resolve: {
      vehicles: VehiclesResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehiclesPageRoutingModule {}