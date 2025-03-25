import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, AbstractControl, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ViewEncapsulation } from '@angular/core';
import { CommonService } from '../../../services/common/common.service';

@Component({
  selector: 'app-sow-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatCardModule
  ],
  templateUrl: './sow-form.component.html',
  styleUrl: './sow-form.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SowFormComponent { 
  sowForm!: FormGroup;
  autoFilledFields: any = {};
  @Output() sendFormdata = new EventEmitter<any>();
  isFormValid: boolean= true;

  constructor(private fb: FormBuilder, public commonService:CommonService) {}

  ngOnInit(): void {
    // this.commonService.resetTabs()
    const jsonData = {
      purchaseName: 'Print Production Service',
      spendCategory: 'Learning',
      spendSubCategory: 'Software Licensing',
      purchaseDescription: 'Annual license for office productivity software (Word, Excel, PowerPoint).',
      mediaPlan: '',
      mrfid: '2025-SOFTWARE-12345',
      workStartDate: '',
      workEndDate: 'Mon Mar 17 2025 00:00:00',
      selectCountry: 'USA',
      selectCurrency: 'USD',
      selectRole: 'Project Manager',
      supplierLegalName: 'Tech Innovations LLC',
      legalName: 'Tech Innovations LLC',
      supplierPOC: 'John Doe, Account Manager'
    };

    this.sowForm = this.fb.group({
      purchaseName: [jsonData.purchaseName, Validators.required],
      spendCategory: [jsonData.spendCategory, Validators.required],
      spendSubCategory: [jsonData.spendSubCategory, Validators.required],
      purchaseDescription: [jsonData.purchaseDescription, Validators.required],
      mediaPlan: [jsonData.mediaPlan],
      mrfid: [jsonData.mrfid, Validators.required],
      workStartDate: [jsonData.workStartDate, Validators.required],
      workEndDate: [jsonData.workEndDate, Validators.required],
      selectCountry: [jsonData.selectCountry, Validators.required],
      selectCurrency: [jsonData.selectCurrency, Validators.required],
      selectRole: [jsonData.selectRole, Validators.required],
      supplierLegalName: [jsonData.supplierLegalName, Validators.required],
      legalName: [jsonData.legalName, Validators.required],
      supplierPOC: [jsonData.supplierPOC, Validators.required]
    });

    Object.keys(jsonData).forEach((key: string) => {
      if ((jsonData as Record<string, string>)[key]) {
        this.autoFilledFields[key] = true;
      }
    });
    this.logFormStatus()
  }

  isAutoFilled(field: string): boolean {
    return !!this.autoFilledFields[field];
  }

  isFieldInvalid(field: string): boolean {
    return this.sowForm.controls[field].invalid && (this.sowForm.controls[field].dirty || this.sowForm.controls[field].touched);
  }

  onSubmit(): void {
    if (this.sowForm.valid) {
      this.isFormValid= true
      this.sendFormdata.emit(this.sowForm.value)
    } else {
      this.isFormValid= false
      this.sowForm.markAllAsTouched();
      this.logFormStatus()
    }
  }
  getFilledFieldsCount(): number {
    return Object.values(this.sowForm.controls).filter(control => control.value && control.value !== '').length;
  }
  
  getErrorFieldsCount(): number {
    return Object.values(this.sowForm.controls).filter(control => control.invalid).length;
  }
  getTotalFieldsCount(): number {
    return Object.keys(this.sowForm.controls).length;
  }
  logFormStatus(): void {
    let totalFieldCount = this.getTotalFieldsCount()
    let errorCount = this.getErrorFieldsCount()
    let filledCount =  this.getFilledFieldsCount()
    console.log('Filled Fields:', filledCount);
    console.log('Errors in Form:', errorCount);
    console.log('Total input in Form:', totalFieldCount);
    this.commonService.updateTabsValue(localStorage.getItem('activeTab'),`AI pre-filled ${filledCount} of ${totalFieldCount} questions`,this.isFormValid?false: true,`${errorCount} error`)

  }
  
}