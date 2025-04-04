import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-risk-assessment',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './risk-assessment.component.html',
  styleUrl: './risk-assessment.component.scss'
})
export class RiskAssessmentComponent {
  @Output() riskAssessmentClick = new EventEmitter<any>();
  isActive:boolean=true
  data:any={}

  riskForm: FormGroup;
  supervisionOptions = ['Yes', 'No', 'May Be', 'Can Be'];

  constructor(private fb: FormBuilder) {
    this.riskForm = this.fb.group({
      supplierLegalName: [{ value: 'Creative Solutions', disabled: true }, Validators.required],
      legalName: [''],
      primaryContactName: [''],
      primaryContactEmail: [''],
      // secondSupplierLegalName: ['', Validators.required],
      supplierPOC: ['', Validators.required],
      supplierPOCEmail: ['', [Validators.required, Validators.email]],
      marketingGarageID: ['', Validators.required],
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


  submitForm() {
    if (this.riskForm.valid) {
      console.log('Form Data:', this.riskForm.value);
    }
  }

  clickNext() {
    this.riskAssessmentClick.emit(this.data);
  }
}
