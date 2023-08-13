import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Question } from '../admin-panel/question.model';
import { AdminpanelService } from '../admin-panel/adminpanel.service';
import { regexMap } from '../regex';
import { User } from '../admin-panel/user.model';
import { Subject, takeUntil } from 'rxjs';
import { colorVariables } from './theme';
import {  faXmark } from '@fortawesome/free-solid-svg-icons';
import {  faWindowMaximize } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';



 
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';

interface Message {
  text?: string;
  options?: string[];
  isUser: boolean;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit, OnDestroy {
  closeButton = faXmark ; 
  maximizeButton = faWindowMaximize ;
  sendButton = faPaperPlane ;
  endSubs$: Subject<any> = new Subject();
  isOption: boolean = false;
  maxDate: Date;
  isMax: boolean = false;
  isOpen: boolean = false;
  isDate: boolean = false;
  dateOfBirth: string = '';
  userForm!: FormGroup;
  formSubmitted: boolean = false;
  isLoading: boolean = false;
  @ViewChild('scrollMe') myScrollContainer: any;
  @ViewChild('picker') picker!: MatDatepicker<Date>;
  finalquestion: boolean = false;
  userData!: User;
  messages: Message[] = [];
  currentQuestionIndex: number = 0;
  questions: Question[] = [];
  conversationFlow: any[] = [];
  validMessages: string[] = [];
  optionFlag: boolean = false;
  currTime: any ;


  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private questionsService: AdminpanelService,
    private datePipe: DatePipe, 
  ) 
  {

  document.documentElement.style.setProperty('--headerAndFooter' , colorVariables.headerFooterColor) ; 
  document.documentElement.style.setProperty('--fontColor' , colorVariables.fontColor) ; 
  document.documentElement.style.setProperty('--maximizeButtonColor' , colorVariables.maximizeButtonColor) ; 

    const now = Date.now();
    this.maxDate = new Date(now);
  }


  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      userInput: ['', Validators.required],
      date: [''],
    });
    const time = new Date() ;
    this.currTime = time.getHours() + ":" + time.getMinutes() ; 
    console.log(this.currTime) ; 
    this._getQuestions();
    
  }
  ngOnDestroy(): void {
    this.endSubs$.next(0);
    this.endSubs$.complete();
  }

  handleEnterKey(event: any) {
    event.preventDefault();

    if (event.key === 'Enter') {
      this.processUserResponse();
    }
  }

  formatDate(date: Date): string {
    const datePipe = new DatePipe('en-US');
    return this.datePipe.transform(date, 'MM/dd/yyyy') || '';
  }


  

  processDate() {
    const date = this.userForm.get('date')?.value;
    if (date) {
      const formattedDate = this.formatDate(date);
      this.isLoading = true;
      this.scrollToBottom();
      setTimeout(() => {
        this.messages.push({ text: formattedDate, isUser: true });
        this.validMessages.push(date);
        this.isDate = false;
        this.scrollToBottom();
        setTimeout(() => {
          this.scrollToBottom();
          this.currentQuestionIndex++;
          this.askQuestion();
          this.isLoading = false;
        }, 1000);
      }, 300);
    }
  }

  clearChat(): void {
    this.messages = [];
    this.currentQuestionIndex = 0;
    this.formSubmitted = false;
    if (!this.finalquestion) {
      this.userData = {};
    } else {
      this.onCreateUser(this.userData);
      this.userData = {};
    }
    this.validMessages = [];
    this.userForm.reset();
    this.askQuestion();
    this.currentQuestionIndex++;
    this.askQuestion();
  }

  askQuestion() {
    let question = this.conversationFlow[this.currentQuestionIndex].question;
    let questionType = this.conversationFlow[this.currentQuestionIndex].type;
    if (questionType === 'datepicker') {
      this.isDate = true;
    }
    this.messages.push({
      text: question,
      options:
        this.conversationFlow[this.currentQuestionIndex].options == null
          ? (this.isOption = false)
          : (this.isOption =
              true && this.conversationFlow[this.currentQuestionIndex].options),
      isUser: false,
    });

    this.isLoading = false;
    this.scrollToBottom 
   }

  processOptions(option: string) {
    this.isLoading = true;
    let question = this.conversationFlow[this.currentQuestionIndex].question;
    this.messages[this.messages.length - 1] = {
      text: question,
      options: [],
      isUser: false,
    };
    setTimeout(() => {
      const userInput: string = option;
      this.messages.push({ text: option, isUser: true });
      this.validMessages.push(option);
      this.scrollToBottom();
      setTimeout(() => {
        this.currentQuestionIndex++;
        this.askQuestion();
        this.isLoading = false;
      }, 1000);
    }, 300);
  }

  processUserResponse(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        const userInput: string = this.userForm?.get('userInput')?.value;
        this.messages.push({ text: userInput, isUser: true });
        this.userForm.reset();
        this.scrollToBottom();

        setTimeout(() => {
          const currentQuestion =
            this.conversationFlow[this.currentQuestionIndex];
          const tag = currentQuestion.tag;
          const regex = regexMap.get(tag);
          this.scrollToBottom();

          if (regex && new RegExp(regex).test(userInput)) {
            this.validMessages.push(userInput);
          }
          if (regex && !new RegExp(regex).test(userInput)) {
            this.messages.push({
              text: 'Invalid input. Please try again.',
              isUser: false,
            });
          } else {
            if (currentQuestion.isFinalQuestion) {
              this.finalquestion = true;
              this.userData = {
                firstName: this.validMessages[0],
                lastName: this.validMessages[1],
                socialSecurityNumber: parseInt(this.validMessages[2]),
                email: this.validMessages[3],
                mobile: parseInt(this.validMessages[4]),
                communicationMedium: this.validMessages[5],
                dob: new Date(this.validMessages[6]),
                gender: this.validMessages[7],
                address: this.validMessages[8],
                city: this.validMessages[9],
                state: this.validMessages[10],
                zipcode: parseInt(this.validMessages[11]),
              };
              this.currentQuestionIndex++;
              this.askQuestion();
              this.onCreateUser(this.userData);
            } else {
              this.currentQuestionIndex++;
              this.askQuestion();
            }
          }

          this.isLoading = false;
        }, 1000);
      }, 300);
    }
  }

  openSupportPopup() {
    this.isOpen = !this.isOpen;
  }

  toggleMaximize() {
    this.isMax = !this.isMax;
  }

  scrollToBottom(): void {
    try {
      const scrollContainer = this.myScrollContainer.nativeElement;
      setTimeout(() => {
        scrollContainer.style.overflow = 'hidden'; // Disable scroll temporarily
        scrollContainer.scrollTop = scrollContainer.scrollHeight; // Scroll to the bottom
        setTimeout(() => {
          scrollContainer.style.overflow = 'auto'; // Enable scroll again
        }, 250);
      }, 5);
    } catch (err) {
      console.error(err);
    }
  }

  
  private _getQuestions() {
    
    this.questionsService
      .getQuestions()
      .pipe(takeUntil(this.endSubs$))
      .subscribe((question) => {
        this.conversationFlow = question;
        this.conversationFlow[
          this.conversationFlow.length - 2
        ].isFinalQuestion = true;
        this.askQuestion();
        this.currentQuestionIndex++;
        this.askQuestion();
      });
  }

  private onCreateUser(creationData: User) {
    this.questionsService
      .createUser(creationData)
      .pipe(takeUntil(this.endSubs$))
      .subscribe();
  }
}
