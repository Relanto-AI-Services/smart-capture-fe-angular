import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormsModule, FormControl } from '@angular/forms';
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
  isFormValid: boolean = true;
  @Input() extractedData: any = {}
  public spendCategory: any = ["PRODUCTION", "CONTENT LICENSING RIGHTS", "PRINT PRODUCTION - SERVICE", "PRINT PRODUCTION - GOOD", "PHOTOGRAPHY", "FILM & ANIMATION", "GLOBAL ADAPTATION", "LICENSING & RIGHTS MANAGEMENT", "GROWTH MARKETING", "GROWTH CAMPAIGN ACTIVATION - ENGAGEMENT", "GROWTH CAMPAIGN GOVERNANCE & OPERATIONS", "GROWTH CAMPAIGN ACTIVATION - ACQUISITION", "GROWTH CAMPAIGN ACTIVATION - FULL FUNNEL", "GROWTH CAMPAIGN ACTIVATION - RETENTION", "GROWTH CAMPAIGN MEASUREMENT", "GROWTH CAMPAIGN STRATEGY", "CREATIVE DESIGN", "CREATIVE STRATEGY", "CONTENT STRATEGY & CREATION", "CREATIVE DEVELOPMENT", "INTERACTIVE PRODUCTION", "BRAND STRATEGY", "BRAND ARCHITECTURE & NAMING", "BRAND IDENTITY (VISUAL, BRAND VOICE)", "BRAND STRATEGY & POSITIONING", "SPONSORSHIPS", "SPORTS / MUSIC / ENTERTAINMENT SPONSORSHIPS", "COMMUNITY I EDUCATIONAL / NON PROFIT SPONSORSHIPS", "TALENT", "CELEBRITY TALENT ENDORSEMENT", "TALENT FOR CREATIVE PRODUCTION", "TALENT FOR EVENT APPEARANCE", "SOCIAL MARKETING", "SOCIAL CONTENT CREATION & PRODUCTION", "SOCIAL INSIGHTS & MEASUREMENT", "COMMUNITY MANAGEMENT & ENGAGEMENT", "SOCIAL CONTENT & PLATFORM STRATEGY", "SOCIAL CHANNEL MANAGEMENT", "INFLUENCER & CREATOR MANAGEMENT", "EVENTS & EXPERIENCES", "EVENT VENUE & ACCOMMODATION", "EVENT MANAGEMENT & PRODUCTION", "PROMOTIONAL GOODS", "PROMOTIONAL GOODS - CLIENT & CUSTOMER", "PROMOTIONAL GOODS - EMPLOYEE", "MARKET RESEARCH & INSIGHTS", "RESEARCH - SYNDICATED", "RESEARCH - CUSTOM", "PARTNER MARKETING/CO-MARKETING", "MEDIA", "MEDIA AGENCY FEES", "MEDIA PASSTHROUGH", "MARKETING TECHNOLOGY", "PLATFORM & TOOLS MANAGEMENT", "PLATFORM & TOOLS PILOTS & PROTOTYPING", "PLATFORM & TOOLS DEVELOPMENT & INTEGRATION", "MEASUREMENT, ANALYTICS, ACCOUNTABILITY & IMPACT", "CREATIVE TESTING", "MEDIA MIX MODELING", "ANALYTICS", "PRODUCT SERVICES", "UX", "UX RESEARCH", "UX WRITING", "UX DESIGN", "SALES SUPPORT SERVICES", "FIELD SALES / SALES SUPPORT", "FIELD RETAIL OPERATIONS", "PARTNER PRODUCT TRAINING", "NON PROCURABLE", "DUES & SUBSCRIPTIONS", "DUES./ MEMBERSHIP FEES - NON TAXABLE", "DUES / MEMBERSHIP FEES - TAXABLE", "MAGAZINES / NEWSPAPERS / PERIODICALS", "DUES & SUBSCRIPTIONS", "ENTERPRISE SERVICES", "CONSULTING SERVICES", "STRATEGY CONSULTING", "HUMAN RESOURCE SERVICES", "TRAINING, LEARNING, & DEVELOPMENT"]
  public spendSubCategory: any = ["NON STREAMING - PRODUCT & SERVICE DESIGN", "ROYALTIES - NON STREAMING - US", "ROYALTIES - OTHER - US", "NON STREAMING - CONTENT & DATA - SEARCH CONTENT / METADATA", "ROYALTIES - MUSIC - US", "NON STREAMING - AD CAMPAIGN / FULL SERVICE", "NON STREAMING - DIGITAL OPTIMIZATION (DNU)", "ORIGINAL CONTENT LICENSE - MUSIC - NON US", "ROYALTIES - OTHER - NON US", "NON STREAMING - CONTENT & DATA - TRAVEL", "ROYALTIES - GAMING - NON US", "ORIGINAL CONTENT LICENSE - OTHER - US"]
  constructor(private fb: FormBuilder, public commonService: CommonService) {
   }

  ngOnInit(): void {
    // this.commonService.resetTabs()
    const jsonData = this.extractedData?.results[0]?.spend_request[0];
    // const jsonData = {
    //   purchase_name: 'Print Production Service',
    //   spend_category: 'Learning',
    //   spend_sub_category: 'Software Licensing',
    //   purchase_description: 'Annual license for office productivity software (Word, Excel, PowerPoint).',
    //   market_plan: '',
    //   MRFID: '2025-SOFTWARE-12345',
    //   work_start_date: '',
    //   work_end_date: 'Mon Mar 17 2025 00:00:00',
    //   country: 'USA', //
    //   currency: 'USD',
    //   selectRole: 'Project Manager', //
    //   supplier_legal_name: 'Tech Innovations LLC',
    //   legal_name: 'Tech Innovations LLC',
    //   supplier_poc_name: 'John Doe, Account Manager'
    // };

    this.sowForm = this.fb.group({
      purchase_name: [jsonData?.purchase_name, Validators.required],
      spend_category: [jsonData?.spend_category, Validators.required],
      spend_sub_category: [jsonData?.spend_sub_category, Validators.required],
      purchase_description: [jsonData?.purchase_description, Validators.required],
      market_plan: [jsonData?.market_plan],
      MRFID: [jsonData?.MRFID, Validators.required],
      work_start_date: [jsonData?.work_start_date, Validators.required],
      work_end_date: [jsonData?.work_end_date, Validators.required],
      country: [jsonData?.markets_benifited_from_the_serviece, Validators.required], // ??? multi select
      currency: [jsonData?.currency, Validators.required],
      selectRole: [jsonData?.selectRole, Validators.required],    // TBD
      supplier_legal_name: [jsonData?.supplier_legal_name, Validators.required],
      legal_name: [jsonData?.legal_name, Validators.required],
      supplier_poc_name: [jsonData?.supplier_poc_name, Validators.required]
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
      this.isFormValid = true
      this.sendFormdata.emit(this.sowForm.value)
    } else {
      this.isFormValid = false
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
    let filledCount = this.getFilledFieldsCount()
    console.log('Filled Fields:', filledCount);
    console.log('Errors in Form:', errorCount);
    console.log('Total input in Form:', totalFieldCount);
    this.commonService.updateTabsValue(localStorage.getItem('activeTab'), `AI pre-filled ${filledCount} of ${totalFieldCount} questions`, this.isFormValid ? false : true, `${errorCount} error`)

  }

}