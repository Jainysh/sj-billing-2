import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { InitializeGuard } from './initialize-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
    canActivate: [InitializeGuard]
  },
  { path: 'sms', loadChildren: './sms/sms.module#SmsPageModule' },
  { path: 'preferences', loadChildren: './preferences/preferences.module#PreferencesPageModule' },
  { path: 'about-us', loadChildren: './about-us/about-us.module#AboutUsPageModule' },
  { path: 'view-bill', loadChildren: './view-bill/view-bill.module#ViewBillPageModule' },
  { path: 'add-sms-numbers', loadChildren: './add-sms-numbers/add-sms-numbers.module#AddSmsNumbersPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'saved-descriptions', loadChildren: './saved-descriptions/saved-descriptions.module#SavedDescriptionsPageModule' },
  { path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' },
  { path: 'reports', loadChildren: './reports/reports.module#ReportsPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
