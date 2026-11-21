import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { LogSleepModalComponent } from '../modals/log-sleep-modal.component';

@Component({
  selector: 'app-sleep',
  templateUrl: './sleep.page.html',
  styleUrls: ['./sleep.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class SleepPage implements OnInit {
  sleepSegment = 'week';
  overnightLogs: OvernightSleepData[] = [];

  constructor(private sleepService: SleepService, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.loadLogs();
  }

  ionViewWillEnter() {
    this.loadLogs();
  }

  loadLogs() {
    this.overnightLogs = this.sleepService.getAllOvernightData();
  }

  async openLogSleepModal() {
    const modal = await this.modalCtrl.create({
      component: LogSleepModalComponent,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.sleepService.logOvernightData(data);
      this.loadLogs();
    }
  }
}