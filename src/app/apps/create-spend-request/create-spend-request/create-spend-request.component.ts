import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabComponent } from '../tab/tab.component';
import { TacticTableComponent } from '../tactic-table/tactic-table.component';
import { RequestTypeComponent } from '../request-type/request-type.component';
import { SowComponent } from '../sow/sow.component';
import { RiskAssessmentComponent } from '../risk-assessment/risk-assessment.component';
import { SubmitSpendRequestComponent } from '../submit-spend-request/submit-spend-request.component';
import { CommonService } from '../../../services/common/common.service';
import { AuthService } from '../../../services/auth/auth.service';
import { AllocatedBudgetComponent } from "../allocated-budget/allocated-budget.component";
import { switchMap } from 'rxjs';
import { setTimeout } from 'timers/promises';

@Component({
  selector: 'app-create-spend-request',
  standalone: true,
  imports: [
    CommonModule,
    TabComponent,
    TacticTableComponent,
    RequestTypeComponent,
    SowComponent,
    RiskAssessmentComponent,
    SubmitSpendRequestComponent,
    FormsModule,
    ReactiveFormsModule,
    AllocatedBudgetComponent
  ],
  templateUrl: './create-spend-request.component.html',
  styleUrl: './create-spend-request.component.scss',
})
export class CreateSpendRequestComponent {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  public activeTab: any = 'tactic'
  public activePage = 'Request Type'
  public user = localStorage.getItem('user')
  public userData = JSON.parse(this.user ? this.user : '');
  public userAvtarText = this.userData?.email.split('@')[0].split('.').map((word: any[]) => word[0]).join('').toUpperCase();
  public rowId: any;
  public chatBoatEndPoint: string = '';
  constructor(public commonService: CommonService, public authService: AuthService) { }
  ngOnInit() {
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
  tabClick(event: any) {
    this.activeTab = event
    this.commonService.resetTabs()
    this.commonService.setActiveTab(event);
    // this.chatVisible = false
    switch (this.activeTab) {
      case 'tactic':
        // this.chatVisible = true
        this.chatBoatEndPoint = '/tactic_chatbot_url'
        this.loadMessages({ "messages": [] })
        break;
      case 'sow':
        // this.chatVisible = true
        this.messages = {}
        this.chatBoatEndPoint = '/spend_request_chatbot_url'
        // window.setTimeout(() => {
        // }, 1000);
        this.loadMessages({ messages: [] });
        this.getPrimaryKey()
        break;
      default:
        console.log('wait')
        this.messages = {}
        break;
    }
  }
  requestType(event: any) {
    this.activePage = 'Tactics'
    this.tabClick('tactic')
  }
  onTacticSelection(event: any) {
    this.activePage = 'SOW'
    this.tabClick('sow')
  }
  onSowSelection(event: any) {
    this.activePage = 'Allocated Budget';
    console.log('form filled data of sow', event);
    this.tabClick('allocatedBudget')
  }
  onAllocatedBidgetSelection(event: any) {
    this.activePage = 'Risk Assessment';
    this.tabClick('riskAssessment')
  }
  onRiskAssessmentSelection(event: any) {
    this.activePage = 'Review And Submit'
    this.tabClick('reviewAndSubmit')
  }
  onFinalSubmitionClick(event: any) {
    this.activePage = 'Review And Submit'
    this.tabClick('reviewAndSubmit')
  }

  getPrimaryKey() {
    try {
      this.authService.postData('/generate_primary_key', {}).subscribe((res) => {
        this.rowId = res.row_id
      })
    } catch (error) {
      console.error('error', error)
    }
  }
  // ####################################
  //////////////////////////////////////////////////////// Chat functionality

  public messages: any;

  newMessage: string = '';
  chatVisible: boolean = true;

  toggleChat() {
    this.chatVisible = !this.chatVisible;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages['messages'].push({ content: this.newMessage, role: 'user' });
      this.newMessage = '';
      this.loadMessages({ "messages": this.messages['messages'] })
    }
  }

  selectOption(option: string) {
    this.messages['messages'].push({ content: option, role: 'user' });
    this.loadMessages({ "messages": this.messages['messages'] })

  }

  loadMessages(message: any) {
    try {
      const messages = message
      this.authService.getData(this.chatBoatEndPoint).pipe(
        switchMap(firstResponse => this.authService.postData(`${firstResponse?.next_url}`, messages))
      ).subscribe({
        next: secondResponse => {
          this.messages = secondResponse
          console.log('Final Response:', this.messages)
        },
        error: error => console.error('Error:', error),
        complete: () => console.log('API calls completed')
      });
    } catch (error) {
      console.error('error', error)
    }

  }
  
}
