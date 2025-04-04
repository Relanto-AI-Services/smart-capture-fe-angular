import { CommonModule} from '@angular/common';
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




@Component({
  selector: 'app-risk-assessment',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './risk-assessment.component.html',
  styleUrl: './risk-assessment.component.scss'
})
export class RiskAssessmentComponent implements OnInit {
  @Output() riskAssessmentClick = new EventEmitter<any>();
  isActive:boolean=true
  data:any={}

  riskForm: FormGroup;
  riskData = {};
  dialogRef: any;


  constructor(private fb: FormBuilder, private commonService: CommonService, private dialog: MatDialog) {
   
    this.riskForm = this.fb.group({
      supplier_legal_name: [{ value: 'test', disabled: true }, Validators.required],
      legal_name: [''],
      primaryContactName: [''],
      primaryContactEmail: [''],
      supplier_poc_name: ['', Validators.required],
      supplier_poc_email: ['', [Validators.required, Validators.email]],
      
      // marketingGarageID: ['', Validators.required],
      serviceLocation: ['', Validators.required],
      supervisionRequired: [[], Validators.required],
      googleBadge: [''],
      deliverablesPublic: [''],
      childrenAccessible: [''],
      supplierType: [[]],
      projectInvolve:[[]],
      marketingActivities: [[]], // Multi-select
      signedContract: [''],
      workBegun: [''],
      googlerRelationship: [''],
      govtInteraction: [''],
      googleEquipment: [''],
      extremeContent: [''],
    });
  }

  ngOnInit(): void {
    this.openLoader();
    this.commonService.getFormData$().subscribe(data => {
      console.log('Combined Form Data:', data);
    });

    this.riskPatch();
   
 
  }

  riskPatch(){

    this.commonService.messages$.subscribe(data => {
     
      console.log("risk data", data);
      this.populateForm(data)
      this.dialogRef.close()
    })
    


  }


  populateForm(jsonData: any) {
    const result = jsonData.context.results[0];
    const riskFormData = jsonData.risk_form.risk_form;
  
    // Fill static fields from context
    this.riskForm.patchValue({
      supplier_legal_name: result.supplier_legal_name || '',
      legal_name: result.legal_name || '',
      primaryContactName: result.supplier_poc_name || '',
      primaryContactEmail: result.supplier_poc_email || '',
      supplier_poc_name: result.supplier_poc_name || '',
      supplier_poc_email: result.supplier_poc_email || ''
    });
  
    // Fill dynamic fields from risk_form using map
    riskFormData.forEach((item: any) => {
      const controlName = item.map;
      const response = item.response;
  
      if (this.riskForm.contains(controlName)) {
        this.riskForm.patchValue({
          [controlName]: Array.isArray(response) ? response : [response]
        });
      }
    });
  }
  


  
  

  submitForm() {
    if (this.riskForm.valid) {
      console.log('Form Data:', this.riskForm.value);
    }
  }

  // clickNext() {
  //   this.riskAssessmentClick.emit(this.data);
  // }

  clickNext(type:any) {
    if(type === 'continue'){
      // this.onSubmit()
      this.riskAssessmentClick.emit({data:this.data,type:'continue'});
    }else{
      this.riskAssessmentClick.emit({data:this.data,type:'back'} );

    }


  }

  openLoader(): void {
    this.dialogRef = this.dialog.open(LoaderModalComponent, {
      disableClose: true,
      data: { page: 'tactic' },
    });
  }
}
