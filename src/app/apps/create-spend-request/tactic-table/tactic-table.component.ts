import { CommonModule,  } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonService } from '../../../services/common/common.service';
import { ApiService } from '../../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderModalComponent } from '../../../components/shared/loader-modal/loader-modal.component';


@Component({
  selector: 'app-tactic-table',
  imports: [FormsModule, ReactiveFormsModule, CommonModule,
     DragDropModule 
    ],
  templateUrl: './tactic-table.component.html',
  styleUrl: './tactic-table.component.scss',
})
export class TacticTableComponent implements OnInit {

  // test
  @Output() tacticClick = new EventEmitter<any>();
  @Input() rowId!: string;
  selectedFilter = 'Cost Center';
  searchText = '';
  filters = ['Name', 'ID', 'Cost Center', 'Type', 'Program'];
  isActive: boolean = false;
  // private dialog = inject(MatDialog);
  private cdr= inject(ChangeDetectorRef);
  cs = inject(CommonService)

  data : any[] = []
  droppedItems: any[] = [];

  filteredData : any[] = [];

  selectedData: any[] = [];
  conceptValue: boolean = false;
  editPopUp: boolean = false;
  dialogRef: any;
  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cs.value$.subscribe((newValue) => {
      this.conceptValue = true; 
    });
    this. fetchSpendRequestData()
  }

  refreshTactic(){

    this.refreshSpendRequestData();
  }

  refreshSpendRequestData() {
    this.openLoader()
    this.apiService.refreshSpendRequest().subscribe({
      next: (response: any) => {
        console.log("Raw API Response:", response);
  
        // Ensure response.data exists and is an array
        if (!response?.data || !Array.isArray(response.data)) {
          console.error("API response does not contain a valid data array:", response);
          return;
        }
  
        this.data = response.data.map((item: any) => ({
          id: item["Tactic_ID"] || "N/A",
          tacticName: item["Tactic_title"] || "No Title",
          program: item["PV"] || "Unknown",
          type: item["Tactic_Type"] || "N/A",
          startDate: item["Start_date"] || "N/A",
          endDate: item["End_date"] || "N/A",
          costCenter: item["Primary_CC"] || "N/A",
          warning: item["Priority"] || "",
        }));
  
        this.filteredData = [...this.data]; 
        console.log("Processed Data:", this.filteredData);
        this.dialogRef.close()
      },
      error: (error) => {
        console.error("Error fetching spend request data:", error);
      },
    
    });
   
  }

  fetchSpendRequestData() {
    this.openLoader()
    this.apiService.getSpendRequest().subscribe({
      next: (response: any) => {
        console.log("Raw API Response:", response);
  
        // Ensure response.data exists and is an array
        if (!response?.data || !Array.isArray(response.data)) {
          console.error("API response does not contain a valid data array:", response);
          return;
        }
  
        this.data = response.data.map((item: any) => ({
          id: item["Tactic_ID"] || "N/A",
          tacticName: item["Tactic_title"] || "No Title",
          program: item["PV"] || "Unknown",
          type: item["Tactic_Type"] || "N/A",
          startDate: item["Start_date"] || "N/A",
          endDate: item["End_date"] || "N/A",
          costCenter: item["Primary_CC"] || "N/A",
          warning: item["Priority"] || "",
        }));
  
        this.filteredData = [...this.data]; 
        console.log("Processed Data:", this.filteredData);
        this.dialogRef.close()
      },
      error: (error) => {
        console.error("Error fetching spend request data:", error);
      },
    
    });
   
  }
  
  

  // toggleSelection(event: any, row: any) {
  //   this.isActive = true;
  //   if (event.target.checked) {
  //     this.selectedData.push(row);
  //   } else {
  //     this.selectedData = this.selectedData.filter((item) => item !== row);
  //   }
  // }

  toggleSelection(event: any, row: any) {
    this.isActive = true;
  
    if (event.target.checked) {
      this.selectedData.push(row);
  
      this.filteredData = this.filteredData.filter(item => item !== row);
      this.droppedItems.push(row);
    } else {
      this.selectedData = this.selectedData.filter(item => item !== row);
      this.droppedItems = this.droppedItems.filter(item => item !== row);
      this.filteredData.push(row);
    }
  }
  

  performAction(action: string) {
    this.editPopUp  = true;
  }

  applyFilter(): void {
    const filterMap: Record<string, keyof (typeof this.data)[0]> = {
      Name: 'tacticName',
      ID: 'id',
      'Cost Center': 'costCenter',
      Type: 'type',
      Program: 'program'
    };

    const filterKey = filterMap[this.selectedFilter];

    if (!filterKey) {
      this.filteredData = [...this.data];
      return;
    }

    this.filteredData = this.data.filter((row) =>
      row[filterKey]
        ?.toString()
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }

  resetIfEmpty(): void {
    console.log('hello');
    if (!this.searchText.trim()) {
      this.filteredData = [...this.data]; // Restore full table
    }
  }

  //   editDetails(row:any){
  //     console.log(row);
  //   }
  clickNext(type: any) {
    if(type === 'continue' && this.droppedItems.length){
      this.sendRequest([...this.droppedItems])
      this.tacticClick.emit({ ...this.droppedItems, type: type });
    }else{
      this.tacticClick.emit({ ...this.droppedItems, type: type });
    }
  }
 

  sendRequest(arr: Array<any>) {
    console.log(arr)
    const spendRequestId = this.rowId || this.generateRandomString(10);
    const tacticDetails = this.droppedItems.map((dt) => {
      let obj = {
        "tactic_id": "",
      "tactic_name": "",
      "tactic_type": "",
      "tactic_code": "",
      "primary_cost_center": "",
      "cost_center_code":"12"
      }
      obj['tactic_id'] = dt.id;
      obj['tactic_name'] = dt.tacticName;
      obj['tactic_type'] = dt.type;
      obj['tactic_code'] = '';
      obj['primary_cost_center'] = dt.costCenter;
      obj['cost_center_code'] = '';


      return obj
    })

   
   

    this.apiService.saveSpendRequestTactic(spendRequestId, tacticDetails).subscribe({
      next: (response) => console.log('Success:', response),
      error: (error) => console.error('Error:', error)
    });
  }


   generateRandomString(length: number) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }


 

  closePopup() {
    this.editPopUp = false;
  }


   openLoader(): void {
      this.dialogRef = this.dialog.open(LoaderModalComponent, {
        disableClose: true,
        data: { page: 'tactic' },
      });
    }

    tableDropListId = 'tableDropList';
  sidePanelDropListId = 'sidePanelDropList';

  onDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      // Reorder within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Transfer between lists
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  returnItem(item: any) {
    const index = this.droppedItems.indexOf(item);
    if (index > -1) {
      this.droppedItems.splice(index, 1);
      this.filteredData.push(item);
      // this.filteredData.sort((a, b) => a.id - b.id);
    }
  }

  trackById(index: number, item: any): number {
    return item.id;
  }


}
