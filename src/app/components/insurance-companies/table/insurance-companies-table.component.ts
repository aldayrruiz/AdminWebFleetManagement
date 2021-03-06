import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { InsuranceCompany } from 'src/app/core/models';
import {
  ErrorMessageService,
  InsuranceCompanyService,
  SnackerService,
} from 'src/app/core/services';
import { BaseTableComponent } from '../../base-table/base-table.component';
import { DeleteInsuranceCompanyComponent } from '../../dialogs/delete-insurance-company/delete-insurance-company.component';

export interface InsuranceCompanyRow {
  id: string;
  name: string;
  phone: string;
}

@Component({
  selector: 'app-insurance-companies-table',
  templateUrl: './insurance-companies-table.component.html',
  styleUrls: ['./insurance-companies-table.component.css'],
})
export class InsuranceCompaniesTableComponent
  extends BaseTableComponent<InsuranceCompany, InsuranceCompanyRow>
  implements OnInit
{
  columns = ['name', 'phone', 'edit', 'delete'];

  constructor(
    private readonly insuranceCompanyService: InsuranceCompanyService,
    private readonly errorMessage: ErrorMessageService,
    private readonly snacker: SnackerService,
    private readonly dialog: MatDialog
  ) {
    super();
  }

  openDeleteDialog(company: InsuranceCompany): void {
    const dialog = this.dialog.open(DeleteInsuranceCompanyComponent);

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteInsuranceCompany(company);
      }
    });
  }

  preprocessData(companies: InsuranceCompany[]): InsuranceCompanyRow[] {
    return companies.map((company) => ({
      id: company.id,
      name: company.name,
      phone: company.phone,
    }));
  }

  fetchDataAndUpdate(): void {
    this.insuranceCompanyService
      .getAll()
      .pipe(finalize(() => this.hideLoadingSpinner()))
      .subscribe((companies) => this.initTable(companies));
  }

  private deleteInsuranceCompany(company: InsuranceCompanyRow) {
    this.insuranceCompanyService.delete(company.id).subscribe(
      async () => {
        const newCompanies = this.models.filter((v) => v.id !== company.id);
        this.initTable(newCompanies);
        const msg = `La compa????a aseguradora ${company.name} ha sido eliminada.`;
        this.snacker.showSuccessful(msg);
      },
      async (error) => {
        const message = this.errorMessage.get(error);
        this.snacker.showError(message);
      }
    );
  }
}
