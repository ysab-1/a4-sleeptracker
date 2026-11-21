import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { LogSleepinessModalComponent } from '../modals/log-sleepiness-modal.component';

@Component({
  selector: 'app-sleepiness',
  templateUrl: './sleepiness.page.html',
  styleUrls: ['./sleepiness.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class SleepinessPage implements OnInit {
  sleepinessSegment = 'week';
  sleepinessLogs: StanfordSleepinessData[] = [];

  constructor(private sleepService: SleepService, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.loadLogs();
  }

  ionViewWillEnter() {
    this.loadLogs();
  }

  loadLogs() {
    this.sleepinessLogs = this.sleepService.getAllSleepinessData();
  }

  async openLogSleepinessModal() {
    const modal = await this.modalCtrl.create({
      component: LogSleepinessModalComponent,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.sleepService.logSleepinessData(data);
      this.loadLogs();
    }
  }
}