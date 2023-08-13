import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from '../admin_panel/user/user.component';
import { QuestionComponent } from '../admin_panel/question/question.component';
import { CreateComponent } from '../admin_panel/create/create.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { LoginpageComponent } from '../admin_panel/loginpage/loginpage.component';
import { AuthGuard } from './auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: ChatbotComponent,
  },
  {
    path: 'adminpanel/login',
    component: LoginpageComponent,
  },
  {
    path: 'adminpanel',
    canActivate: [AuthGuard],
    children: [
      { path: 'login', component: LoginpageComponent },
      { path: 'user', component: UserComponent },
      { path: 'question', component: QuestionComponent },
      { path: 'create', component: CreateComponent },
      { path: 'create/:id', component: CreateComponent },
      {
        // path:'**'----means-->Everything that is not included above */
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    // path:'**'----means-->Everything that is not included above */
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelRoutingModule {}
