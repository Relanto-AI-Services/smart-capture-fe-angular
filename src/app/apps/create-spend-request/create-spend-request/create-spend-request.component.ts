import { Component } from '@angular/core';
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
  public activeTab: any = 'tactic'
  public activePage = 'Request Type'
  public user = localStorage.getItem('user')
  public userData = JSON.parse(this.user ? this.user : '');
  public userAvtarText = this.userData?.email.split('@')[0].split('.').map((word: any[]) => word[0]).join('').toUpperCase();
  public rowId: any;
  constructor(public commonService: CommonService, public authService: AuthService) { }
  ngOnInit() {
  }

  tabClick(event: any) {
    this.activeTab = event
    console.log(event);
    this.commonService.setActiveTab(event);
    switch (this.activeTab) {
      case 'tactic':
        this.loadTacticMessages({ "messages": [] })
        break;
      case 'sow':
        this.getPromaryKey()
        break;

      default:
        this.messages ={}
        console.log('wait')
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

  getPromaryKey() {
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

  messages: any;

  newMessage: string = '';
  chatVisible: boolean = true;

  toggleChat() {
    this.chatVisible = !this.chatVisible;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages['messages'].push({ content: this.newMessage, role: 'user' });
      this.newMessage = '';
      this.loadTacticMessages({ "messages": this.messages['messages'] })
    }
  }

  selectOption(option: string) {
    this.messages['messages'].push({ content: option, role: 'user' });
    this.loadTacticMessages({ "messages": this.messages['messages'] })

  }

  loadTacticMessages(message: any) {
    try {
      const messages = message
      this.authService.getData('/tactic_chatbot_url').pipe(
        switchMap(firstResponse => this.authService.postData(`${firstResponse?.next_url}`, messages))
      ).subscribe({
        next: secondResponse => {
          console.log('Final Response:', secondResponse)
          this.messages = secondResponse
        },
        error: error => console.error('Error:', error),
        complete: () => console.log('API calls completed')
      });
    } catch (error) {
      console.error('error', error)
    }

  }
}
