import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonService } from '../../../services/common/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab',
  imports: [CommonModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss'
})
export class TabComponent {
  tabs: any[] = []
  @Output() tabClick = new EventEmitter<any>();
  @Input() activeTab: any = '';
  constructor(public commonService:CommonService) { }
  ngOnInit() {
    this.tabs = this.commonService.getTabs()
    console.log(this.activeTab);
    this.commonService.tab$.subscribe({
      next: (activTab) => {
      }
    });    
  }

  selectTab(tab:any,index: number) {
    this.activeTab = index;
    this.commonService.setActiveTab(tab?.value);
    localStorage.setItem('activeTab',this.activeTab)
    this.tabClick.emit(tab?.value);
  }
  ngOnChanges(changes: SimpleChanges) {
     this.commonService.tab$.subscribe({
      next: (activTab) => {
        this.activeTab = activTab
        console.log('Changes detected activTab Success:', activTab);
      }
    });  
  }

  selectStep(stepValue: any) {
    this.activeTab = stepValue;
    this.tabClick.emit(stepValue);
  }
}
