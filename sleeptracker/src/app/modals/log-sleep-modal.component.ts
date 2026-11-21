import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { OvernightSleepData } from '../data/overnight-sleep-data';

@Component({
  selector: 'app-log-sleep-modal',
  templateUrl: './log-sleep-modal.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LogSleepModalComponent {
  sleepStart: string = new Date(Date.now() - 8 * 3600 * 1000).toISOString();
  sleepEnd: string = new Date().toISOString();

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    const startDate = new Date(this.sleepStart);
    const endDate = new Date(this.sleepEnd);
    const overnightData = new OvernightSleepData(startDate, endDate);
    return this.modalCtrl.dismiss(overnightData, 'confirm');
  }
}