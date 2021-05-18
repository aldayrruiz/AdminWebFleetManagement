import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateUserComponent } from 'src/app/shared/components/users/create-user/create-user.component';
import { EditUserComponent } from 'src/app/shared/components/users/edit-user/edit-user.component';
import { UserResolver } from 'src/app/shared/components/users/edit-user/user.resolver';
import { UsersTableComponent } from 'src/app/shared/components/users/users-table/users-table.component';
import { UsersResolver } from 'src/app/shared/components/users/users-table/users.resolver';
import { UsersComponent } from './users.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'table',
    pathMatch: 'full',
  },
  {
    path: '',
    component: UsersComponent,
    children: [
      { path: 'create', component: CreateUserComponent },
      {
        path: 'table',
        component: UsersTableComponent,
        resolve: { users: UsersResolver },
      },
      {
        path: 'edit/:userId',
        component: EditUserComponent,
        resolve: { user: UserResolver },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
