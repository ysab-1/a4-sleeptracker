import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page'

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'sleep',
        loadComponent: () => import('./sleep/sleep.page').then((m) => m.SleepPage),
      },
      {
        path: 'sleepiness',
        loadComponent: () => import('./sleepiness/sleepiness.page').then((m) => m.SleepinessPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'sleep',
    children: [
      {
        path: 'sleep-history',
        loadComponent: () => import('./sleep/sleep-history.page').then(m => m.SleepHistoryPage)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
];
