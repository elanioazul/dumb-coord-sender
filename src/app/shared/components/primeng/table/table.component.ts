import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DOMAIN_FILTERS, DOMAIN_TYPES } from '@core/consts/columns-table-recursos';
import { IRecurso } from '@core/interfaces/reecurso-interfaz';
import { Table } from 'primeng/table';

type dataRequested =
  | IRecurso
  | any

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  @Input() dataDetail!: any;
  @Input() rows!: number;

  @Input() columns: any;

  @Output() selectedResource = new EventEmitter<IRecurso>();
  @Output() anyOther = new EventEmitter<any>();

  @ViewChild('dataTable')
  private table!: Table;

  noElemsMsg: string = "No se han encontrado recursos";

  constructor() {}

  selectProduct(resource: any) {
    console.log(resource);
  }

  getDomains(field: DOMAIN_TYPES) {
    return DOMAIN_FILTERS[field]
  }

  moreInformation(data: dataRequested): void {
    if ("resourceId" in data && "tiporecurso" in data) {
      this.selectedResource.emit(data)
    } else {
      this.anyOther.emit(data)
    }
  }
    
}

