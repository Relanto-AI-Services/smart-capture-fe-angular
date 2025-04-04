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
  public user: any //localStorage.getItem('user')
  // public userData:any = JSON.parse(this.user ? this.user : "");
  // public userAvtarText = this.userData?.email.split('@')[0].split('.').map((word: any[]) => word[0]).join('').toUpperCase();
  public userData: any = {}
  public userAvtarText: any = {}
  public rowId: any;
  public chatBoatEndPoint: string = '';
  public messages: any = {
    messages: [],
    options: [],
    session_id: "",
    next_url: ""
  };

  newMessage: string = '';
  chatVisible: boolean = true;
  public sowFormData: any = {}
  constructor(public commonService: CommonService, public authService: AuthService) { }
  ngOnInit() {
    // if (!localStorage.getItem('user')) {
    //   const user = {
    //     "email": "Mohammad.waliullah@relanto.ai",
    //     "token": {
    //       "token": "ya29.a0AeXRPp7q2d-uylajHlH60Ev43kRKnclBOemvlLhb2LzFkDxN9LI3eG1GgemBoW5z6is1mLLNxrN2-WloFzoK_rCE2D69_cXYTIkEiE5Bu3swCrwa7n31henEJDLDUTJDp8IMI1yK53XN0lCjgk93sREfXgIfGCaFW0PvLP5NzwaCgYKARsSARESFQHGX2MinmH9mxykQUCFchrb8bmezw0177",
    //       "refresh_token": null,
    //       "token_uri": "https://oauth2.googleapis.com/token",
    //       "client_id": "580742443458-u11uev3eqo6sn1v5ohq9mbh6bq9mfm72.apps.googleusercontent.com",
    //       "client_secret": "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"
    //     },
    //     "scopes": [
    //       "https://www.googleapis.com/auth/drive",
    //       "https://www.googleapis.com/auth/bigquery",
    //       "https://www.googleapis.com/auth/documents.readonly"
    //     ],
    //     "session_id": "b412acb5-3a90-42a3-90d1-78b79e59b775",
    //     "message": "Logged in successfully with this account: Mohammad.waliullah@relanto.ai"
    //   }
    //   localStorage.setItem('user', JSON.stringify(user))
    //   localStorage.setItem('sid', user?.session_id)
    // }
    this.user = localStorage.getItem('user')
    this.userData = JSON.parse(this.user ? this.user : "");
    this.userAvtarText = this.userData?.email.split('@')[0].split('.').map((word: any[]) => word[0]).join('').toUpperCase();
    this.commonService.messages$.subscribe((messages: any) => {
      this.messages = messages;
    });
  }
  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    window.setTimeout(() => {
      if (this.chatContainer) {
        console.log(this.chatContainer.nativeElement);
        const container = this.chatContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    }, 1000);
  }
  tabClick(event: any) {
    this.activeTab = event
    this.commonService.resetTabs()
    this.commonService.setActiveTab(event);
    this.messages = {
      messages: [],
      options: [],
      session_id: "",
      next_url: ""
    }
    switch (this.activeTab) {
      case 'tactic':
        this.chatBoatEndPoint = '/tactic_chatbot_url'
        this.getPrimaryKey();
        this.loadMessages({ "messages": [] })
        break;
      case 'sow':
        this.chatBoatEndPoint = '/spend_request_chatbot_url'
        this.getPrimaryKey();
        this.loadMessages({ "messages": [] })
        break;
        case 'allocatedBudget':
        // this.chatBoatEndPoint = '/spend_request_chatbot_url'
        break;
      case 'riskAssessment':
        this.chatBoatEndPoint = '/risk_field_chatbot_url'
        this.loadMessages({
          "messages": [],
          "context": {"vendor_name":"quantum software solutions"}, //change here
          "risk_form": {},
          "sow_form": {}
        })

        break;
      default:
        console.log('wait')
        // this.messages = {}
        break;
    }
  }
  requestType(event: any) {
    this.activePage = 'Tactics'
    this.tabClick('tactic')
  }
  onTacticSelection(event: any) {
    if (event?.type === 'continue') {
      this.activePage = 'SOW'
      this.tabClick('sow')
    } else {
      this.activePage = 'Request Type'
    }
  }
  onSowSelection(event: any) {
    console.log(event.data);
    this.sowFormData = event.data
    if (event.type === 'extract') {
      window.setTimeout(() => {
        let filterData: any = []
        let res: any = []
        this.commonService.tabObserver.subscribe((resp: any) => {
          res = resp
        })
        filterData = res.filter((el: any) => {
          if (el.subLabel !== "") return el
        })
        
        if(filterData.length>0){
          this.messages['messages'].push({ content: filterData[0]['subLabel'], role: 'assistant' });
        }
      }, 1000);
    } else if(event.type === 'submit') {
      this.activePage = 'Allocated Budget';
      this.tabClick('allocatedBudget')
    }else{
      this.activePage = 'Tactic';
      this.tabClick('tactic')
    }
  }
  onAllocatedBidgetSelection(event: any) {
    if(event.type === 'continue'){
      this.activePage = 'Risk Assessment';
      this.tabClick('riskAssessment')
    }else{
      this.activePage = 'SOW'
      this.tabClick('sow')
    }
  }
  onRiskAssessmentSelection(event: any) {
    if(event.type === 'continue'){
      this.activePage = 'Review And Submit'
      this.tabClick('reviewAndSubmit')
    }else{
      this.activePage = 'Risk Assessment';
      this.tabClick('riskAssessment')
    }
  }
  onFinalSubmitionClick(event: any) {
    if(event.type === 'continue'){
      this.activePage = 'Review And Submit'
      this.tabClick('reviewAndSubmit')
    }else{
      this.activePage = 'Risk Assessment';
      this.tabClick('riskAssessment')
    }
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
    if(this.activeTab === 'riskAssessment'){
      this.loadMessages({
        "messages":this.messages['messages'],
        "context": {"vendor_name":"quantum software solutions"}, //change here
        "risk_form": {},
        "sow_form": {}}
      )
      }else{
      this.loadMessages({ "messages": this.messages['messages'] })

      }

   


    

  }

  loadMessages(message: any) {
    try {
      this.authService.getData(this.chatBoatEndPoint).subscribe((res: any) => {
        this.getMessages(res.next_url, message)
      });
    } catch (error) {
      console.error('error', error)
    }
  }


  getMessages(url: any, message: any) {
    let payload: any = {...message}
    if(this.activeTab === 'sow'){
      payload = { ...payload, sow_form: this.sowFormData ? this.sowFormData : {} }
    }

    this.authService.postData(url, payload).subscribe({
      next: secondResponse => {
        // this.messages = secondResponse
        this.commonService.updateMessages(secondResponse);
      },
      error: error => console.error('Error:', error),
      complete: () => console.log('Chat API calls completed')
    });
  }

  showChat() {
    if (!this.chatVisible) {
      this.chatVisible = true
    }
  }
  getSowFormData(event: any) {
    this.sowFormData = { ...this.sowFormData, ...event }
  }
}
