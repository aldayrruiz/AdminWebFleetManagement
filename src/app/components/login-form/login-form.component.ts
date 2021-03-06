import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Role, Tenant } from 'src/app/core/models';
import {
  AssetsService,
  ErrorMessageService,
  FleetRouter,
  LoginService,
  SnackerService,
  TenantService,
} from 'src/app/core/services';
import { MyErrorStateMatcher } from 'src/app/core/utils/my-error-state-matcher';
import { emailValidators, passwordValidators } from 'src/app/core/validators/user';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  blueDriversLogo = '';
  matcher = new MyErrorStateMatcher();
  tenants: Tenant[] = [];
  isSuperAdmin = false;
  tenantToChange: string;
  credentials: FormGroup;
  hide = true;
  sending = false;

  constructor(
    private readonly errorMessage: ErrorMessageService,
    private readonly tenantService: TenantService,
    private readonly assetsService: AssetsService,
    private readonly loginService: LoginService,
    private readonly formBuilder: FormBuilder,
    private readonly snacker: SnackerService,
    private readonly fleetRouter: FleetRouter
  ) {
    this.blueDriversLogo = this.assetsService.getUrl('background/icon.png');
  }

  get email(): AbstractControl {
    return this.credentials.get('email');
  }

  get password(): AbstractControl {
    return this.credentials.get('password');
  }

  ngOnInit(): void {
    this.credentials = this.formBuilder.group({
      email: ['', emailValidators],
      password: ['', passwordValidators],
      tenant: [],
    });
  }

  async login() {
    this.sending = true;
    const credentials = this.getFormData();

    this.loginService
      .login(credentials)
      .pipe(finalize(() => (this.sending = false)))
      .subscribe(
        async (response) => {
          if (response.role === Role.SUPER_ADMIN) {
            this.isSuperAdmin = true;
            this.tenantToChange = response.tenant;
            this.getTenants();
          } else if (response.role === Role.ADMIN) {
            this.fleetRouter.goToHome();
          } else {
            this.snacker.showError('No eres administrador');
          }
        },
        async (error) => {
          const message = this.errorMessage.get(error);
          this.snacker.showError(message);
        }
      );
  }

  getTenants() {
    this.tenantService.getAll().subscribe((tenants) => (this.tenants = tenants));
  }

  async changeTenant() {
    this.tenantService
      .changeTenant(this.tenantToChange)
      .subscribe(() => this.fleetRouter.goToHome());
  }

  private getFormData() {
    // username is used instead of email because of server convert username to email by default at login.
    return {
      username: this.email.value,
      password: this.password.value,
    };
  }
}
