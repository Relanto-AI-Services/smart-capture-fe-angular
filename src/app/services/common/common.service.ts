import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor() {}
  private activeTabSubject = new BehaviorSubject<string>('tactic'); // Default to "tactic"
  tab$ = this.activeTabSubject.asObservable();
   

  private tabs = [
    { "label": "Tactics", "value": "tactic", "subLabel": "", "hasError": false, "errorMessage": "" },
    { "label": "SOW", "value": "sow", "subLabel": "", "hasError": false, "errorMessage": "" },
    { "label": "Allocated Budget", "value": "allocatedBudget", "subLabel": "", "hasError": false, "errorMessage": "" },
    { "label": "Risk Assessment", "value": "riskAssessment", "subLabel": "", "hasError": false, "errorMessage": "" },
    { "label": "Review and Submit", "value": "reviewAndSubmit", "subLabel": "", "hasError": false, "errorMessage": "" }
  ];
  private tabSubject = new BehaviorSubject<any>(this.tabs); // Default to "tactic"
  tabObserver = this.tabSubject.asObservable();
  getTabs() {
    return this.tabs;
  }

  setActiveTab(tabValue: string) {


    if (this.tabs.some((tab) => tab.value === tabValue)) {
      localStorage.setItem('activeTab', tabValue);
      this.activeTabSubject.next(tabValue);
    }
  }

  updateTabsValue(
    activeTab: any,
    subLabel: any,
    hasError: boolean,
    errorMessage: any
  ) {
    if (activeTab) {
      this.tabs.filter((el) => {
        if (el.value === activeTab) {
          el.hasError = hasError;
          el.subLabel = subLabel;
          el.errorMessage = errorMessage;
        }
      });
    }
    this.tabSubject.next(this.tabs)
  }
  resetTabs() {
    const updatedTab = this.tabs.map((el) => ({
      ...el,
      hasError: false,
      subLabel: '',
      errorMessage: '',
    }));
    this.tabSubject.next(updatedTab)

    // this.tabs = updatedTab;
    // console.log('reset tabs',this.tabs);
  }

  private concept = new BehaviorSubject<boolean>(false); // Initial value
  value$ = this.concept.asObservable(); // Observable to listen to changes

  // Function to update the value
  setValue() {
    this.concept.next(!this.concept.value);
  }

  // Function to get the current value (if needed)
  getValue() {
    return this.concept.value;
  }

  private messagesSource = new BehaviorSubject<any>({ messages: [], options: [] ,session_id:"",next_url:""});
  messages$ = this.messagesSource.asObservable();

  updateMessages(newMessages: any) {
    this.messagesSource.next(newMessages);
  }

//////////////////////////////for getting form saved data
  private formDataSubject = new BehaviorSubject<any>({});

  setFormData(data: any): void {
    const currentData = this.formDataSubject.value;
    this.formDataSubject.next({ ...currentData, ...data });
  }

  getFormData$() {
    return this.formDataSubject.asObservable();
  }

  getFormDataSnapshot() {
    return this.formDataSubject;
  }

  clearFormData(): void {
    this.formDataSubject.next({});
  }
}
