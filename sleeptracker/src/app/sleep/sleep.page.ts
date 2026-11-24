import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
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
    private modalCtrl: ModalController
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
      overnightLogs.sort((a, b) => b.sleepStart.getTime() - a.sleepStart.getTime());
      
      const today = new Date().toDateString();
      const latestLog = overnightLogs[0];
      
      if (new Date(latestLog.sleepEnd).toDateString() === today || new Date(latestLog.sleepStart).toDateString() === today) {
        this.lastNightSleep = latestLog;
      } else {
        this.lastNightSleep = null;
      }
    } else {
      this.lastNightSleep = null;
    }
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
      this.loadTodaySleep();
    }
  }
}