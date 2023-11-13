import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DOMAIN_FILTERS, DOMAIN_TYPES } from '@core/consts/columns-table-recursos';
import { IRecurso } from '@core/interfaces/reecurso-interfaz';
import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
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
  //@Input() rowsPerPageOptions!: number[];
  @Input() isLoading!: boolean;
  @Input() first!: number;
  @Input() totalRecords!: number;

  @Output() selectedResource = new EventEmitter<IRecurso>();
  @Output() selectedRow = new EventEmitter<any>();
  @Output() anyOther = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<any>();
  @Output() lazyLoad = new EventEmitter<any>();

  @ViewChild('dataTable')
  private table!: Table;

  _selectedRowElement: any;
  @Input()
  set selectedRowElement(value: any) {
    this._selectedRowElement = value;
  }

  get selectedRowElement(): any {
    return this._selectedRowElement;
  }

  noElemsMsg: string = "No se han encontrado recursos";

  constructor() {}

  selectProduct(resource: any) {
    console.log(resource);
  }

  getDomains(field: DOMAIN_TYPES) {
    return DOMAIN_FILTERS[field]
  }

  shouldSelectRow(rowData: any): boolean {
    return this.selectedRowElement && this.selectedRowElement.childNodes[0].innerText === rowData.resourceId.toString();
  }

  moreInformation(data: dataRequested, rowElement: any): void {
    if ("resourceId" in data && "tiporecurso" in data) {
      this.selectedResource.emit(data);
      if (this.selectedRowElement  === rowElement) {
        this.selectedRowElement  = null;
      } else {
          this.selectedRowElement  = rowElement;
          this.selectedRow.emit(rowElement)
      }
    } else {
      this.anyOther.emit(data)
    }
  }

  onPageChange(event: any): void {
    this.pageChange.emit(event);
    
  }

  onLazyLoad(event: LazyLoadEvent): void {
    this.lazyLoad.emit(event);
  }
    
}

