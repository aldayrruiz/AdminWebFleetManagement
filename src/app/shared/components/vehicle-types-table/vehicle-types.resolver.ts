import { Injectable } from '@angular/core';
import {
  Resolve,
} from '@angular/router';
import { Observable } from 'rxjs';
import { VehicleType } from 'src/app/core';
import { VehicleTypeService } from 'src/app/core/services/vehicle-type.service';

@Injectable({
  providedIn: 'root',
})
export class VehicleTypesResolver implements Resolve<VehicleType[]> {
  constructor(private vehicleTypeSrv: VehicleTypeService) {}

  resolve(): Observable<VehicleType[]> {
    return this.vehicleTypeSrv.getVehicleTypes();
  }
}
