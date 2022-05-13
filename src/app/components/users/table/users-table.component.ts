/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { BaseTableComponent } from 'src/app/components/base-table/base-table.component';
import { EditPatchUser, Role, User, Vehicle } from 'src/app/core/models';
import {
  ErrorMessageService,
  LocalStorage,
  SnackerService,
  UserService,
} from 'src/app/core/services';
import { DeleteUserComponent } from '../../dialogs/delete-user/delete-user.component';

interface UserRow {
  id: string;
  fullname: string;
  email: string;
  dateJoined: string;
  role: string;
  allowedVehicleTypes?: Vehicle[];
  isDisabled?: boolean;
}

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css'],
})
export class UsersTableComponent extends BaseTableComponent<User, UserRow> {
  columns = ['fullname', 'email', 'dateJoined', 'allowedTypes', 'isDisabled', 'delete'];

  private myId: string;

  constructor(
    private errorMessage: ErrorMessageService,
    private storage: LocalStorage,
    private snacker: SnackerService,
    private userSrv: UserService,
    private dialog: MatDialog
  ) {
    super();
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit(): void {
    super.ngOnInit();
    this.myId = this.storage.getUserId();
  }

  openDeleteDialog(user: UserRow): void {
    const deleteUserDialog = this.dialog.open(DeleteUserComponent);

    deleteUserDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(user);
      }
    });
  }

  preprocessData(data: User[]): UserRow[] {
    return data.map((user) => ({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      dateJoined: user.date_joined,
      isDisabled: user.is_disabled,
      allowedVehicleTypes: user.allowed_vehicles,
    }));
  }

  fetchDataAndUpdate(): void {
    this.userSrv
      .getAll(true)
      .pipe(finalize(() => this.hideLoadingSpinner()))
      .subscribe((users) => {
        const usersWithOutSuperAdmin = this.removeSuperAdmin(users);
        console.log(usersWithOutSuperAdmin);
        const usersOrdered = this.orderRows(usersWithOutSuperAdmin);
        console.log(usersOrdered);
        this.initTable(usersOrdered);
      });
  }

  changeDisabled(user: UserRow): void {
    const newIsDisabledStatus = !user.isDisabled;
    const data: EditPatchUser = { is_disabled: newIsDisabledStatus };
    this.userSrv.patch(user.id, data).subscribe(
      (response: EditPatchUser) => {
        user.isDisabled = response.is_disabled;
      },
      (errors) => console.error(errors)
    );
  }

  isMe = (u: UserRow) => this.myId === u.id;

  getBadgeColor = (n: number) => (n === 0 ? 'warn' : 'primary');

  private deleteUser(user: UserRow) {
    this.userSrv.delete(user.id).subscribe(
      async () => {
        const newUsers = this.models.filter((u) => u.id !== user.id);
        this.initTable(newUsers);
        this.snacker.showSuccessful(`El usuario ${user.fullname} ha sido eliminado.`);
      },
      async (error) => {
        const message = this.errorMessage.get(error);
        this.snacker.showError(message);
      }
    );
  }

  private removeSuperAdmin(users: User[]) {
    return users.filter((user) => user.role !== Role.SUPER_ADMIN);
  }

  private orderRows(users: User[]) {
    const usersOrderedAlphabetically = users.sort((a, b) => {
      // Admin must appear first
      if (b.role === Role.ADMIN) {
        return 1;
      }

      // Then order alphabetically
      return a.fullname.localeCompare(b.fullname);
    });

    return usersOrderedAlphabetically;
  }
}
