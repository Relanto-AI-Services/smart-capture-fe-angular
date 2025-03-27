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
    { "label": "Tactics", "value": "tactic", "subLabel": "", "hasError": false, "errorMessage": "" },
    { "label": "SOW", "value": "sow", "subLabel": "", "hasError": false, "errorMessage": "" },
    { "label": "Allocated Budget", "value": "allocatedBudget", "subLabel": "", "hasError": false, "errorMessage": "" },
    { "label": "Risk Assessment", "value": "riskAssessment", "subLabel": "", "hasError": false, "errorMessage": "" },
    { "label": "Review and Submit", "value": "reviewAndSubmit", "subLabel": "", "hasError": false, "errorMessage": "" }
  ];

  getTabs() {
    return this.tabs;
  }

  setActiveTab(tabValue: string) {
    if (this.tabs.some(tab => tab.value === tabValue)) {
    localStorage.setItem('activeTab',tabValue)
      this.tabSubject.next(tabValue);
    }
  }

updateTabsValue(activeTab:any,subLabel:any,hasError:boolean,errorMessage:any){
if(activeTab){
  this.tabs.filter(el=>{
    if(el.value === activeTab){
      el.hasError = hasError;
      el.subLabel = subLabel;
      el.errorMessage = errorMessage;
    }
  })
}
}
resetTabs(){
  const updatedTab = this.tabs.map(el=>({
    ...el,
    hasError : false,
    subLabel:'',
    errorMessage :''
  }))
  this.tabs = updatedTab
  console.log(this.tabs);
}
}
