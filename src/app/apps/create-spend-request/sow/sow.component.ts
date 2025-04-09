import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { GoogleDriveService } from '../../../services/googleDrive/google-drive.service';
import { SowFormComponent } from "../sow-form/sow-form.component";
import { CommonService } from '../../../services/common/common.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { LoaderModalComponent } from '../../../components/shared/loader-modal/loader-modal.component';
import moment from 'moment';

@Component({
  selector: 'app-sow',
  imports: [CommonModule, SowFormComponent,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,

  ],
  templateUrl: './sow.component.html',
  styleUrl: './sow.component.scss'
})
export class SowComponent {
  @Output() sowClick = new EventEmitter<any>();
  @ViewChild(SowFormComponent) sowForm!: SowFormComponent;
  @Input() rowId!: string;
  @Output() sowFormDataChange = new EventEmitter<any>();
  @Input() formData!: any;

  isActive: boolean = true
  data: any = {}
  public user = localStorage.getItem('user')
  public userData = JSON.parse(this.user ? this.user : '');
  public accessType: any = 'writer'
  selectedFiles: any[] = [];
  oauthToken: string = this.userData?.token?.client_id;
  showSowForm: boolean = false;
  extractedData: any = this.formData
  userName: string = 'John Doe';
  firstLetter: string = this.userData?.email.charAt(0).toUpperCase();
  dialogRef: any;
  allExtractedData: any;
  constructor(public authService: AuthService, private googleDriveService: GoogleDriveService, public commonService: CommonService, private dialog: MatDialog) {
    // console.log(this.formData);

  }
  ngOnInit() {
    this.selectedFiles = []
    this.googleDriveService.fileSelected.subscribe((files) => {
      this.selectedFiles = files;
      console.log("fileeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", this.selectedFiles);
    });
    this.commonService.getFormData$().subscribe(data => {
      let isFormFilled = this.isObjectFilled(data?.sowFormData)
      if (isFormFilled) {
        this.showSowForm = true
      }
    });
  }
  isObjectFilled = (obj: Record<string, any>): boolean => {
    if (!obj || typeof obj !== 'object') return false;
  
    return Object.values(obj).every(value =>
      Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined && value !== ''
    );
  };
  
  openGoogleDrivePicker() {
    this.googleDriveService.openPicker();
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  clickNext(type: any) {
    if (type === 'extract') {
      // this.sowClick.emit({data:this.sowForm.sowForm,type:'extract'});
      if (this.selectedFiles.length === 0) {
        this.showSowForm = true // after extracting data
        window.setTimeout(() => {
          this.sowClick.emit({ data: this.sowForm?.sowForm?.value, type: 'extract' });
        }, 500);
      } else {
        this.shareAccess()
      }
    } else if (type === 'submit') {
      this.sowForm.onSubmit();
      // const extractedData = localStorage.getItem("extractedData");
      // const parsedData = JSON.parse(extractedData);
      if (this.sowForm.isFormValid) {
        this.submitSowForm()
      }
    } else {
      this.sowClick.emit({ data: this.sowForm?.sowForm, type: 'back' });
    }
  }
  submitSowForm() {
    try {
      // this.commonService.getFormData$
      let extData:any ={}
      const extractedData = localStorage.getItem("extractedData");
      if (extractedData) {
        const parsedData = JSON.parse(extractedData);
        extData = parsedData
      }
      let dataExtract = {
        purchase_name: this.sowForm?.sowForm?.value?.purchase_name,
        spend_category: this.sowForm?.sowForm?.value['spend_category'],
        purchase_description: this.sowForm?.sowForm?.value['purchase_description'],
        work_start_date: moment(this.sowForm?.sowForm?.value['work_start_date']).format('DD-MM-YYYY'),
        work_end_date:  moment(this.sowForm?.sowForm?.value['work_end_date']).format('DD-MM-YYYY'),
        currency: this.sowForm?.sowForm?.value['currency'],
        markets_benifited_from_the_serviece: this.sowForm?.sowForm?.value['country']
      }
      if(extData?.total_processing_time){
        delete extData?.total_processing_time
      }
      let selectedCountryCode = this.getselectedCountryCode(this.sowForm?.sowForm?.value['country'].filter((item:any) => Array.isArray(item) ? item.length > 0 : true))
      let payload = {
        ...extData, extraction_results: [
          {
            ...extData?.results[0],
            ...dataExtract
          }
        ], 
        country_name: this.sowForm?.sowForm?.value['country'].filter((item:any) => Array.isArray(item) ? item.length > 0 : true), 
        country_code: selectedCountryCode
      }
      if(payload?.results){
        delete payload?.results
      }
      // this.openLoader()
      this.authService.postData('/ingest_sow_page', payload).subscribe((res: any) => {
        console.log("response on saving sow fom", res);
        // this.dialogRef.close()
        this.sowClick.emit({ data: this.sowForm?.sowForm, type: 'submit' });
      })
    } catch (error) {
      console.error('error', error)
    }
  }
  getselectedCountryCode(country: any) {
    let code: any = []
    this.commonService.getFormData$().subscribe(data => {
      country.map((c: any) => {
        if(data?.countryCurrencyCode.length > 0 ){
          data?.countryCurrencyCode.filter((el: any) => {
            if (el?.country_name === c) {
              code.push(el.country_code)
            }
          })
        }
      })
    })
    return code.filter((item:any, index:any, arr:any) => arr.indexOf(item) === arr.lastIndexOf(item));

  }
  shareAccess() {
    try {
      let id = this.selectedFiles[0].id
      const payload = {
        "doc_links": [`https://docs.google.com/document/d/${id}/`],
        "roles": [this.accessType]
      }
      this.openLoader()
      this.authService.postData('/share', payload).subscribe(
        {
          next: (res) => {
            let processPayload = {
              urls: [res.shared_links[0].shared_link],
              row_id: this.rowId
            }
            this.extractData(processPayload)
          },
          error: (error) => {
            console.error('Error Status:', error.status);
            console.error('Error Message:', error.message);
          }
        })
    } catch (error) {
      console.error('error', error)
    }
  }

  extractData(payload: any) {
    try {
      this.authService.postData('/process_urls_for_extraction', payload).subscribe(proRes => {
        this.dialogRef.close()
        this.allExtractedData = proRes
        this.extractedData = proRes?.results[0]?.spend_request[0]
        this.commonService.setFormData({ extractedSowFormData: proRes?.results[0]?.spend_request[0] })
        this.showSowForm = true // after extracting data
        localStorage.setItem("extractedData", JSON.stringify(proRes));
        this.pushToBigQuery({ ...proRes, extraction_results: proRes?.results })
        window.setTimeout(() => {
          this.sowClick.emit({ data: this.sowForm?.sowForm?.value, type: 'extract' });
        }, 500);
      })
    } catch (error) {
      console.error('error', error)
    }
  }
  pushToBigQuery(data: any) {
    if(data?.total_processing_time && data.results){
      delete data.total_processing_time
      delete data.results
    }
    let payload = data;
    this.authService.postData('/ingest_to_log_table', payload).subscribe((res) => {
      console.log('Res', res);

    })
  }
  openLoader(): void {
    this.dialogRef = this.dialog.open(LoaderModalComponent, {
      disableClose: true,
      data: { page: 'sow' },
    });
  }
  onFormChange(data: any) {
    this.notifycreateSpendRequest(data);
  }
  notifycreateSpendRequest(data: any) {
    this.sowFormDataChange.emit(data);
  }
}
