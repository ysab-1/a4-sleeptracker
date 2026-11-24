import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { LogSleepModalComponent } from '../modals/log-sleep-modal.component';
import { addIcons } from 'ionicons';
import { 
  moonOutline, 
  calendarOutline, 
  chevronForwardOutline, 
  happyOutline, 
  add 
} from 'ionicons/icons';

@Component({
  selector: 'app-sleep',
  templateUrl: './sleep.page.html',
  styleUrls: ['./sleep.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class SleepPage implements OnInit {
  lastNightSleep: OvernightSleepData | null = null;

  constructor(
    private sleepService: SleepService,
    private modalCtrl: ModalController,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      moonOutline,
      calendarOutline,
      chevronForwardOutline,
      happyOutline,
      add
    });
  }

  ngOnInit() {
    this.loadTodaySleep();
  }

  ionViewWillEnter() {
    this.loadTodaySleep();
  }

  loadTodaySleep() {
    const overnightLogs = SleepService.AllOvernightData;
    
    if (overnightLogs.length > 0) {
      overnightLogs.sort((a, b) => new Date(b.sleepStart).getTime() - new Date(a.sleepStart).getTime());
      
      const todayString = new Date().toDateString();
      
      const todaysLog = overnightLogs.find(log => {
        const startDate = new Date(log.sleepStart).toDateString();
        const endDate = new Date(log.sleepEnd).toDateString();
        return startDate === todayString || endDate === todayString;
      });

      this.lastNightSleep = todaysLog || null;
    } else {
      this.lastNightSleep = null;
    }
    
    this.cdr.detectChanges();
  }

  openSleepHistory() {
    this.router.navigate(['/sleep/sleep-history']);
  }

  async openLogSleepModal() {
    const modal = await this.modalCtrl.create({
      component: LogSleepModalComponent,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.sleepService.logOvernightData(data);
      this.loadTodaySleep();
    }
  }

  async openEditSleepModal(sleepEntry: OvernightSleepData) {
    const modal = await this.modalCtrl.create({
      component: LogSleepModalComponent,
      componentProps: { existingData: sleepEntry }
    });
    await modal.present();
    
    const { data } = await modal.onDidDismiss();
    
    if (data) {
      const updatedLog = data.updated || data;
      const originalLog = data.original || sleepEntry;

      if (updatedLog) {
        const originalStartTime = new Date(originalLog.sleepStart).getTime();
        const index = SleepService.AllOvernightData.findIndex(
          log => new Date(log.sleepStart).getTime() === originalStartTime
        );

        if (index > -1) {
          SleepService.AllOvernightData[index] = updatedLog;
        } else {
          SleepService.AllOvernightData.push(updatedLog);
        }
      }

      this.loadTodaySleep();
    }
  }
}