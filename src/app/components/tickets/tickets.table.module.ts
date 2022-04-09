import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomPipesModule } from 'src/app/core/pipes/custom-pipes.module';
import { TicketsRoutingModule } from 'src/app/pages/tickets/tickets-routing.module';
import { MyAngularMaterialModule } from '../../core/modules/angular-material.module';
import { SolveTicketComponent } from './solve/solve-ticket.component';
import { TicketsTableComponent } from './table/tickets-table.component';

@NgModule({
  declarations: [TicketsTableComponent, SolveTicketComponent],
  imports: [
    CommonModule,
    TicketsRoutingModule /* This component is using tickets routing /admin/tickets */,
    MyAngularMaterialModule,
    CustomPipesModule,
  ],
  exports: [TicketsTableComponent, SolveTicketComponent],
})
export class TicketsComponentsModule {}
