import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { LogSleepinessModalComponent } from '../modals/log-sleepiness-modal.component';
import { addIcons } from 'ionicons';
import { 
  flash, 
  calendarOutline, 
  chevronForwardOutline, 
  add, 
  trashOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-sleepiness',
  templateUrl: './sleepiness.page.html',
  styleUrls: ['./sleepiness.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class SleepinessPage implements OnInit {
  todaySleepinessLogs: StanfordSleepinessData[] = [];

  constructor(
    private sleepService: SleepService,
    private modalCtrl: ModalController,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      flash,
      calendarOutline,
      chevronForwardOutline,
      add,
      trashOutline
    });
  }

  ngOnInit() {
    this.loadTodaySleepiness();
  }

  ionViewWillEnter() {
    this.loadTodaySleepiness();
  }

  loadTodaySleepiness() {
    const allEntries = SleepService.AllSleepData;
    const sleepinessLogs = allEntries.filter(entry => entry instanceof StanfordSleepinessData) as StanfordSleepinessData[];
    
    const today = new Date().toDateString();
    this.todaySleepinessLogs = sleepinessLogs.filter(log => {
      const logDate = log.loggedAt ? new Date(log.loggedAt) : new Date();
      return logDate.toDateString() === today;
    });

    this.todaySleepinessLogs.sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());

    this.cdr.detectChanges();
  }

  openSleepinessHistory() {
    this.router.navigate(['/sleepiness/sleepiness-history']);
  }

  async openLogSleepinessModal() {
    const modal = await this.modalCtrl.create({
      component: LogSleepinessModalComponent,
    });
    
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      const newLog = data.updated || data;

      if (newLog) {
        SleepService.AllSleepData.push(newLog);
      }
      
      this.loadTodaySleepiness();
    }
  }

  async openEditSleepinessModal(logEntry: StanfordSleepinessData) {
    const modal = await this.modalCtrl.create({
      component: LogSleepinessModalComponent,
      componentProps: { existingData: logEntry }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      const updatedLog = data.updated || data;
      const originalLog = data.original || logEntry;

      if (updatedLog) {
        const index = SleepService.AllSleepData.indexOf(originalLog);
        if (index > -1) {
          SleepService.AllSleepData[index] = updatedLog;
        } else {
          SleepService.AllSleepData.push(updatedLog);
        }
      }

      this.loadTodaySleepiness();
      this.cdr.detectChanges();
    }
  }

  deleteLog(log: StanfordSleepinessData) {
    const index = SleepService.AllSleepData.indexOf(log);
    if (index > -1) {
      SleepService.AllSleepData.splice(index, 1);
      this.loadTodaySleepiness();
    }
  }
}