import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common/common.service';
import { LoaderModalComponent } from '../../../components/shared/loader-modal/loader-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../services/api.service';




@Component({
  selector: 'app-risk-assessment',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './risk-assessment.component.html',
  styleUrl: './risk-assessment.component.scss'
})
export class RiskAssessmentComponent implements OnInit {
  @Output() riskAssessmentClick = new EventEmitter<any>();
  @Input() rowId!: string;
  isActive: boolean = true
  data: any = {}

  riskForm: FormGroup;
  riskData = {};
  dialogRef: any;



  constructor(private fb: FormBuilder, private commonService: CommonService, private dialog: MatDialog, private apiService: ApiService) {

    this.riskForm = this.fb.group({
      supplier_legal_name: [{ value: 'test', disabled: true }, Validators.required],
      legal_name: [''],
      primaryContactName: [''],
      primaryContactEmail: [''],
      supplier_poc_name: ['', Validators.required],
      supplier_poc_email: ['', [Validators.required, Validators.email]],

      serviceLocation: ['', Validators.required],
      supervisionRequired: [[], Validators.required],
      googleBadge: [[], Validators.required],
      deliverablesPublic: [[], Validators.required],
      childrenAccessible: [[], Validators.required],
      supplierType: [[], Validators.required],
      projectInvolve: [[]],
      marketingActivities: [[]],
      signedContract: [''],
      workBegun: [''],
      googlerRelationship: [''],
      govtInteraction: [''],
      googleEquipment: [''],
      extremeContent: [''],
    });

   
  }

  ngOnInit(): void {

    this.commonService.getFormData$().subscribe(data => {
      console.log('Combined Form Data:', data);
      this.riskForm.patchValue({
        supplier_legal_name: data?.extractedSowFormData?.supplier_legal_name || '',
        legal_name: data?.extractedSowFormData?.legal_name || '',
        primaryContactName: data?.extractedSowFormData?.supplier_poc_name || '',
        primaryContactEmail: data?.extractedSowFormData?.supplier_poc_email || '',
        supplier_poc_name: data?.extractedSowFormData?.supplier_poc_name || '',
        supplier_poc_email: data?.extractedSowFormData?.supplier_poc_email || ''
      });
    });

    this.commonService.getMessage().subscribe(data => {

      console.log("risk data", data);
      this.riskPatch(data)

    })
    // const dataaa = [
    //   { map: 'serviceLocation', response: ['Office'] },
    //   { map: 'supervisionRequired', response: ['yes'] },
    //   { map: 'googleBadge', response: ['no'] },
    //   { map: 'deliverablesPublic', response: ['yes'] },
    //   { map: 'childrenAccessible', response: ['no'] },
    //   { map: 'supplierType', response: ['independent_contractor'] },
    //   { map: 'projectInvolve', response: ['software_development'] },
    //   { map: 'marketingActivities', response: ['digital_advertising'] },
    //   { map: 'signedContract', response: ['yes'] },
    //   { map: 'workBegun', response: ['no'] },
    //   { map: 'googlerRelationship', response: ['none'] },
    //   { map: 'govtInteraction', response: ['no'] },
    //   { map: 'googleEquipment', response: ['yes'] },
    //   { map: 'extremeContent', response: ['no'] }
    // ];

  }

riskPatch(data: any){
  // this.openLoader();

  this.populateForm(data)


}


populateForm(jsonData: any): void {
  const riskFormData = jsonData?.risk_form?.risk_fields;
  riskFormData?.forEach((item: any) => {
    const controlName = item.map;
    const response = item.response;

    if (this.riskForm.contains(controlName)) {
      const control = this.riskForm.get(controlName);
      const isArrayControl = Array.isArray(control?.value);

      this.riskForm.patchValue({
        [controlName]: isArrayControl ? response : response[0] || ''
      });
    }
  });

}

submitForm() {
  if (this.riskForm.valid) {
    console.log('Form Data:', this.riskForm.value);
  }
}


clickNext(type: any) {
  if (type === 'continue') {
    // this.onSubmit()
    this.subMitRiskdata();
  } else {
    this.riskAssessmentClick.emit({ data: this.data, type: 'back' });

  }
}

subMitRiskdata(){
  console.log(this.riskForm.value);

    const formValue = this.riskForm.value;
    const sowData = {
      supplier_legal_name: formValue.supplier_legal_name,
      legal_name: formValue.legal_name,
      primaryContactName: formValue.primaryContactName,
      primaryContactEmail: formValue.primaryContactEmail,
      supplier_poc_name:formValue.supplier_poc_name,
      supplier_poc_email: formValue.supplier_poc_email

    }

    const excludedKeys = [
      'supplier_legal_name',
      'legal_name',
      'primaryContactName',
      'primaryContactEmail',
      'supplier_poc_name',
      'supplier_poc_email'
    ];
  
    const fieldMap: { [key: string]: string } = {
      serviceLocation: 'In what type of location will services be performed?',
      supervisionRequired: "Do you need to supervise the worker's activities?",
      googleBadge: 'Do you need a badge or @google account for supplier workers for more than 30 days?',
      deliverablesPublic: 'Will the supplier create deliverables visible to the public?',
      childrenAccessible: 'Is anything in your project accessible by children or minors (age 18 or under)?',
      supplierType: 'Is your supplier any of the following? (Select all that apply)',
      projectInvolve: 'Does your project involve any of the following? (Select all that apply)',
      marketingActivities: 'Which of these marketing activities are part of the purchase? (Select all that apply)',
      signedContract: 'Will a signed contract be required for this purchase regardless of the risk level?',
      workBegun: 'Has work already begun on your purchase?',
      googlerRelationship: 'Does the Googler who decided to hire this supplier have any of the following relationships with the supplier?',
      govtInteraction: 'Is the supplier a government body or official, or will they interact with anyone on Google’s behalf?',
      googleEquipment: 'Will the supplier exclusively use Google equipment and credentials to perform all the project work?',
      extremeContent: 'Will any of the supplier’s workers be exposed to egregious/extreme content while providing their services?'
    };
  
    const risk_fields = Object.keys(formValue)
    .filter((key) => !excludedKeys.includes(key))
    .map((key) => {
      const value = formValue[key];
      return {
        field: fieldMap[key] || '',
        map: key,
        response: Array.isArray(value) ? value : value ? [value] : []
      };
    });
  
    this.apiService.saveRisk(this.rowId, sowData, { risk_fields }).subscribe({
      next: (response) => {
        if (response ) {
          console.log('Risk data saved successfully:', response);
          this.riskAssessmentClick.emit({ data: this.data, type: 'continue' });

        } else {
          console.warn('Risk data save failed or incomplete:', response);
        }
      },
      error: (error) => {
        console.error('Error while saving risk data:', error);
      }
  }
);

}


openLoader(): void {
  this.dialogRef = this.dialog.open(LoaderModalComponent, {
    disableClose: true,
    data: { page: 'tactic' },
  });
}
}
