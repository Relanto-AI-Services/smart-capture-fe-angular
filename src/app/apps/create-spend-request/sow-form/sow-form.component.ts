import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, model, Output, signal } from '@angular/core';
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
import * as moment from 'moment';
import { debounceTime, startWith } from 'rxjs';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
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
    MatCardModule,
    MatAutocompleteModule,
    MatChipsModule,
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
    ///////////poc

    this.searchControl.valueChanges
      .pipe(startWith(''), debounceTime(300))
      .subscribe((value: any) => {
        this.categoryPOCFilteredOption = this.options.filter(option =>
          option.title.toLowerCase().includes(value.toLowerCase())
        );
      });
  }

  ngOnInit(): void {
    // this.commonService.resetTabs()
    this.sowForm = this.fb.group({
      purchase_name: ['', [Validators.required]],
      spend_category: ['', Validators.required],
      spend_sub_category: ['', Validators.required],
      purchase_description: ['', Validators.required],
      // market_plan: [jsonData?.market_plan],   ref Kajal 
      // MRFID: [jsonData?.MRFID, Validators.required],
      work_start_date: [null, Validators.required],
      work_end_date: [null, Validators.required],
      country: [[], Validators.required], // ??? multi select
      currency: [, Validators.required],
      // selectRole: [, Validators.required], ref vaishnavi   // TBD
      supplier_legal_name: ['', [Validators.required]],
      legal_name: ['', [Validators.required]],
      supplier_poc_name: ['', [Validators.required]]
    });
    if (Object.keys(this.extractedData).length !== 0) {
      const jsonData = this.extractedData?.results[0]?.spend_request[0];
      this.patchValueInForm(jsonData)
      Object.keys(jsonData).forEach((key: string) => {
        if ((jsonData as Record<string, string>)[key]) {
          this.autoFilledFields[key] = true;
        }
      });
    }

    this.logFormStatus()
  }

  isAutoFilled(field: string): boolean {
    return !!this.autoFilledFields[field];
  }

  isFieldInvalid(field: string): boolean {
    return this.sowForm.controls[field].invalid && (this.sowForm.controls[field].dirty);
  }
  convertsToDate(dateString: string): Date | null {
    if (!dateString) return null;
    const formattedDate = moment.default(dateString, 'DD-MM-YYYY', true);
    return formattedDate.isValid() ? formattedDate.toDate() : null;
  }
  patchValueInForm(jsonData: any) {
    this.sowForm.patchValue({
      purchase_name: jsonData?.purchase_name ? jsonData?.purchase_name : '',
      spend_category: jsonData?.spend_category ? jsonData?.spend_category : '',
      spend_sub_category: jsonData?.spend_sub_category ? jsonData?.spend_sub_category : '',
      purchase_description: jsonData?.purchase_description ? jsonData?.purchase_description : '',
      work_start_date: jsonData?.work_start_date ? this.convertsToDate(jsonData?.work_start_date) : '',
      work_end_date: jsonData?.work_end_date ? this.convertsToDate(jsonData?.work_end_date) : '',
      country: jsonData?.markets_benifited_from_the_serviece ? jsonData?.markets_benifited_from_the_serviece : [],
      currency: jsonData?.currency ? jsonData?.currency : '',
      // selectRole: jsonData?.selectRole,
      supplier_legal_name: jsonData?.supplier_legal_name ? jsonData?.supplier_legal_name : '',
      legal_name: jsonData?.legal_name ? jsonData?.legal_name : '',
      supplier_poc_name: jsonData?.supplier_poc_name ? jsonData?.supplier_poc_name : ''
    });
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
    return Object.values(this.sowForm.controls).filter(control => {
      const value = control.value;
      return !(value === null || value === undefined || value === '' ||
        (Array.isArray(value) && value.length === 0));
    }).length;
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


  //////////////////////////////////POC
  searchControl = new FormControl('');
  options = [
    { title: 'Ads product software', description: 'Ads product software, XYZ description ..', example: 'Example', subscription: 'Software Subscription - Perpetual license' },
    { title: 'Media product software', description: 'Ads product software, XYZ description ..', example: 'Example', subscription: 'Software Subscription - Perpetual license' },
    { title: 'Design ads software', description: 'Ads product software, XYZ description ..', example: 'Example', subscription: 'Software Subscription - Perpetual license' },
    { title: 'Media software', description: 'Ads product software, XYZ description ..', example: 'Example', subscription: 'Software Subscription - Perpetual license' }
  ];
  categoryPOCFilteredOption: any[] = this.options;
  selectCategoryItem(item: any) {
    this.searchControl.setValue(item.title);
    console.log('selected category item', this.searchControl.value);
  }
  separatorKeysCodes: number[] = [ENTER, COMMA];
  currentCountry = model('');
  countries = signal(['']);
  allFruits: string[] = ['USA', 'China', 'Uk', 'UAE', 'Nepal'];
  filteredFruits = computed(() => {
    const currentCountry = this.currentCountry().toLowerCase();
    return currentCountry
      ? this.allFruits.filter(country => country.toLowerCase().includes(currentCountry))
      : this.allFruits.slice();
  });

  announcer = inject(LiveAnnouncer);

  addCountry(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our country
    if (value) {
      this.countries.update((val: any) => [...val, value]);
    }
    // Clear the input value
    this.currentCountry.set('');
  }

  removeCountry(country: string): void {
    this.countries.update((el: any) => {
      const index = el.indexOf(country);
      if (index < 0) {
        return el;
      }

      el.splice(index, 1);
      this.announcer.announce(`Removed ${country}`);
      return [...el];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.countries.update((countries: any) => [...countries, event.option.viewValue]);
    this.currentCountry.set('');
    event.option.deselect();
  }
}