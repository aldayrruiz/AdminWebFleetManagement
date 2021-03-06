/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { CreateUser } from 'src/app/core/models';
import {
  ErrorMessageService,
  FleetRouter,
  SnackerService,
  UserService,
} from 'src/app/core/services';
import { MyErrorStateMatcher } from 'src/app/core/utils/my-error-state-matcher';
import { bleUserValidators, emailValidators, fullnameValidators } from 'src/app/core/validators/user';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  credentials: FormGroup;
  sending = false;

  constructor(
    private readonly errorMessage: ErrorMessageService,
    private readonly formBuilder: FormBuilder,
    private readonly snacker: SnackerService,
    private readonly userSrv: UserService,
    private readonly router: FleetRouter
  ) {}

  get fullname(): AbstractControl {
    return this.credentials.get('fullname');
  }

  get email(): AbstractControl {
    return this.credentials.get('email');
  }

  get bleUserId(): AbstractControl {
    return this.credentials.get('bleUserId');
  }

  ngOnInit(): void {
    this.credentials = this.formBuilder.group({
      email: ['', emailValidators],
      fullname: ['', fullnameValidators],
      bleUserId: ['', bleUserValidators],
    });
  }

  createUser(): void {
    const newUser = this.getFormData();
    this.sending = true;
    const msg =
      'Se ha enviado un email al nuevo usuario con sus credenciales para entrar en la app móvil.';
    this.userSrv
      .create(newUser)
      .pipe(finalize(() => (this.sending = false)))
      .subscribe(
        async () => {
          this.router.goToUsers();
          this.snacker.showSuccessful(msg);
        },
        async (error) => {
          const message = this.errorMessage.get(error);
          this.snacker.showError(message);
        }
      );
  }

  private getFormData(): CreateUser {
    const newUser: CreateUser = {
      email: this.email.value,
      fullname: this.fullname.value,
      ble_user_id: this.bleUserId.value,
    };
    return newUser;
  }
}
