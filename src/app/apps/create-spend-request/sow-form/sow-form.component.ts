import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-sow-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './sow-form.component.html',
  styleUrl: './sow-form.component.scss'
})
export class SowFormComponent { 
  sowForm: FormGroup;

  fiscalYears = ['Q1 FY25', 'FY25', 'All Periods'];
  availableBudget = 1200;
  countries = ['United States', 'Canada', 'United Kingdom'];
  currencies = ['USD', 'CAD', 'GBP'];
  roles = ['Project Manager', 'Analyst', 'Consultant'];
  spendCategories = ['Learning', 'Software Licensing', 'IT Services'];
  spendSubCategories = ['Cloud Services', 'Enterprise Software', 'Security Software'];

  constructor(private fb: FormBuilder) {
    this.sowForm = this.fb.group({
      purchaseName: ['', Validators.required],
      spendCategory: ['', Validators.required],
      spendSubCategory: ['', Validators.required],
      purchaseDescription: ['', Validators.required],
      mediaPlan: [''],
      mprId: ['', Validators.required],
      workStartDate: ['', Validators.required],
      workEndDate: ['', Validators.required],
      country: ['', Validators.required],
      currency: ['', Validators.required],
      role: ['', Validators.required],
      totalSpendRequest: ['', Validators.required],
      cloudSummitQ1: ['', Validators.required],
      cloudSummitFY: ['', Validators.required],
      cloudSummitTotal: [{ value: '', disabled: true }],
      nextGlobalQ1: ['', Validators.required],
      nextGlobalFY: ['', Validators.required],
      nextGlobalTotal: [{ value: '', disabled: true }],
      supplierLegalName: ['', Validators.required],
      legalName: ['', Validators.required],
      supplierPOC: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.sowForm.valid) {
      console.log('Form Submitted', this.sowForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  calculateTotal(): void {
    const cloudSummitTotal = Number(this.sowForm.value.cloudSummitQ1) + Number(this.sowForm.value.cloudSummitFY);
    const nextGlobalTotal = Number(this.sowForm.value.nextGlobalQ1) + Number(this.sowForm.value.nextGlobalFY);
    this.sowForm.patchValue({
      cloudSummitTotal,
      nextGlobalTotal
    });
  }
}
