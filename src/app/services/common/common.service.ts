import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }
  private tabSubject = new BehaviorSubject<string>('tactic'); // Default to "tactic"
  tab$ = this.tabSubject.asObservable();

  private tabs = [
    { id: 1, label: 'Tactics', value: 'tactic' },
    { id: 2, label: 'SOW', value: 'sow' },
    { id: 3, label: 'Risk Assessment', value: 'riskAssessment' },
    { id: 4, label: 'Review and Submit', value: 'reviewAndSubmit' }
  ];

  getTabs() {
    return this.tabs;
  }

  setActiveTab(tabValue: string) {
    if (this.tabs.some(tab => tab.value === tabValue)) {
      this.tabSubject.next(tabValue);
    }
  }


}
