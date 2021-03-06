/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { EditVehicle, InsuranceCompany, Vehicle } from 'src/app/core/models';
import {
  ErrorMessageService,
  FleetRouter,
  SnackerService,
  VehicleService,
} from 'src/app/core/services';
import { VehicleIcon, VehicleIconProvider } from 'src/app/core/services/view/vehicle-icon.service';
import { MyErrorStateMatcher } from 'src/app/core/utils/my-error-state-matcher';
import {
  brandValidators,
  fuelValidators,
  imeiValidators,
  modelValidators,
  numberPlateValidators,
  policyNumberValidators,
} from 'src/app/core/validators/vehicle';

@Component({
  selector: 'app-edit-vehicle',
  templateUrl: './edit-vehicle.component.html',
  styleUrls: ['./edit-vehicle.component.css'],
})
export class EditVehicleComponent implements OnInit {
  insuranceCompanies: InsuranceCompany[] = [];
  matcher = new MyErrorStateMatcher();
  icons: VehicleIcon[];
  iconSelected: VehicleIcon;
  vehicle: Vehicle;
  formGroup: FormGroup;
  sending = false;

  constructor(
    private readonly vehicleIconProvider: VehicleIconProvider,
    private readonly errorMessage: ErrorMessageService,
    private readonly vehicleSrv: VehicleService,
    private readonly formBuilder: FormBuilder,
    private readonly snacker: SnackerService,
    private readonly route: ActivatedRoute,
    private readonly router: FleetRouter
  ) {
    this.icons = this.vehicleIconProvider.getIcons();
  }

  get brand(): AbstractControl {
    return this.formGroup.get('brand');
  }

  get model(): AbstractControl {
    return this.formGroup.get('model');
  }

  get numberPlate(): AbstractControl {
    return this.formGroup.get('numberPlate');
  }

  get imei(): AbstractControl {
    return this.formGroup.get('imei');
  }

  get isDisabled(): AbstractControl {
    return this.formGroup.get('isDisabled');
  }

  get fuel(): AbstractControl {
    return this.formGroup.get('fuel');
  }

  get insuranceCompany(): AbstractControl {
    return this.formGroup.get('insuranceCompany');
  }

  get policyNumber(): AbstractControl {
    return this.formGroup.get('policyNumber');
  }

  get icon(): AbstractControl {
    return this.formGroup.get('icon');
  }

  ngOnInit(): void {
    this.resolve();
    this.iconSelected = this.getIconFromVehicle(this.vehicle);
    this.setFormGroup(this.vehicle);
  }

  async edit() {
    const vehicle = this.getUpdatedData();
    this.sending = true;
    this.vehicleSrv
      .update(this.vehicle.id, vehicle)
      .pipe(finalize(() => (this.sending = false)))
      .subscribe(
        async () => {
          this.router.goToVehicles();
          const message = 'Veh??culo editado con ??xito!';
          this.snacker.showSuccessful(message);
        },
        async (error) => {
          const message = this.errorMessage.get(error);
          this.snacker.showError(message);
        }
      );
  }

  resolve(): void {
    this.route.data.subscribe((response) => {
      this.vehicle = response.vehicle;
      this.insuranceCompanies = response.insuranceCompanies;
    });
  }

  private setFormGroup(vehicle: Vehicle) {
    this.formGroup = this.formBuilder.group({
      brand: [vehicle.brand, brandValidators],
      model: [vehicle.model, modelValidators],
      numberPlate: [vehicle.number_plate, numberPlateValidators],
      imei: [vehicle.gps_device.imei, imeiValidators],
      isDisabled: [vehicle.is_disabled],
      fuel: [vehicle.fuel, fuelValidators],
      insuranceCompany: [vehicle?.insurance_company?.id, []],
      policyNumber: [vehicle.policy_number, policyNumberValidators],
      icon: [this.iconSelected, []],
    });
  }

  private getIconFromVehicle(vehicle: Vehicle) {
    const icon = this.icons.filter((i) => i.value === vehicle.icon)[0];
    return icon;
  }

  private getUpdatedData(): EditVehicle {
    const insuranceCompany = this.insuranceCompany.value || null;
    return {
      model: this.model.value,
      brand: this.brand.value,
      number_plate: this.numberPlate.value,
      gps_device: this.imei.value,
      is_disabled: this.isDisabled.value,
      fuel: this.fuel.value,
      insurance_company: insuranceCompany,
      policy_number: this.policyNumber.value,
      icon: this.icon.value.value,
    };
  }
}
