import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-tactic-table',
  imports: [FormsModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './tactic-table.component.html',
  styleUrl: './tactic-table.component.scss'
})
export class TacticTableComponent {
  @Output() tacticClick = new EventEmitter<any>();
  selectedFilter = 'Cost Center';
  searchText = '';
  filters = ['Name', 'ID', 'Cost Center', 'Category'];
  isActive:boolean=false
  data = [
    { id: 'SCA12696', tacticName: 'Event & Experience', subTitle: 'Multiple Events - Central: 1P SMB Webinars', program: 'Program', type: 'Events & Experiences: Multiple Events', startDate: '1/1/2025', endDate: '12/29/2025', costCenter: '1P8: Touched Center - Traditional', warning: '', warningAction: '' },
    { id: 'GLO24352', tacticName: 'Event & Experience', subTitle: 'Single Event - Cloud Summit JAPAC', program: 'Program', type: 'Events & Experiences: Single Event', startDate: '1/1/2025', endDate: '12/29/2025', costCenter: '095: Cloud Summit - JAPAC', warning: '', warningAction: '' },
    { id: 'GLO63746', tacticName: 'Event & Experience', subTitle: 'Multiple Events', program: 'Program', type: 'Events & Experiences: Multiple Events', startDate: '1/1/2025', endDate: '12/29/2025', costCenter: '095: Cloud Summit - JAPAC APAC', warning: 'Missing Basic Details', warningAction: 'Edit Tactic' },
    { id: 'SCA12696', tacticName: 'Event & Experience', subTitle: 'Multiple Events - Mumbai Leaders Connect', program: 'Program', type: 'Events & Experiences: Multiple Events', startDate: '1/1/2025', endDate: '12/29/2025', costCenter: '095: Cloud Summit - EMEA', warning: '', warningAction: '' },
    { id: 'GLO34526', tacticName: 'Event & Experience', subTitle: 'Single Event', program: 'Program', type: 'Events & Experiences: Single Event', startDate: '1/1/2025', endDate: '12/29/2025', costCenter: '095: Cloud Summit - JAPAC', warning: 'Missing Basic Details', warningAction: 'Edit Tactic' },
    { id: 'SCA23432', tacticName: 'Event & Experience', subTitle: 'Single Event - Sydney Summit', program: 'Program', type: 'Events & Experiences: Multiple Events', startDate: '1/1/2025', endDate: '12/29/2025', costCenter: '095: Cloud Summit - JAPAC APAC', warning: '', warningAction: '' }
  ];
  
  filteredData = [...this.data];
  
  selectedData: any[] = [];

  toggleSelection(event: any, row: any) {
    this.isActive = true
    if (event.target.checked) {
      this.selectedData.push(row);
    } else {
      this.selectedData = this.selectedData.filter(item => item !== row);
    }
  }

  performAction(action: string) {
    console.log('Action triggered:', action);
  }

  applyFilter(): void {
    const filterMap: Record<string, keyof (typeof this.data)[0]> = {
      'Name': 'tacticName',
      'ID': 'id',
      'Cost Center': 'costCenter',
      'Category': 'type'
    };
  
    const filterKey = filterMap[this.selectedFilter];
  
    if (!filterKey) {
      this.filteredData = [...this.data];
      return;
    }
  
    this.filteredData = this.data.filter((row) =>
      row[filterKey]?.toString().toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  
  //   editDetails(row:any){
  //     console.log(row);
  //   }
    clickNext(type:any) {
      this.tacticClick.emit({...this.selectedData,type:type});
    }

}

