import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { LogSleepModalComponent } from '../modals/log-sleep-modal.component';
import { ToastController } from '@ionic/angular/standalone';

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

  constructor(private sleepService: SleepService, private modalCtrl: ModalController, private toastCtrl: ToastController) {}

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

  async presentSleepLoggedToast(newData: OvernightSleepData, previousDataList: OvernightSleepData[]) {
    const toast = await this.toastCtrl.create({
      message: 'Sleep has been logged!\nTap to undo.',
      duration: 4000,
      position: 'bottom',
      cssClass: 'custom-sleep-toast',
      buttons: [{
        text: 'Undo',
        role: 'cancel',
        handler: () => {
          this.sleepService.deleteOvernightData(newData.id);
          this.loadLogs();
        }
      }]
    });
    await toast.present();
  }

  async presentSleepEditedToast(updatedData: OvernightSleepData, oldSnapshot: OvernightSleepData) {
    const toast = await this.toastCtrl.create({
      message: 'Sleep log has been edited!\nTap to undo.',
      duration: 4000,
      position: 'bottom',
      buttons: [{
        text: 'Undo',
        role: 'cancel',
        handler: () => {
          this.sleepService.updateOvernightData(oldSnapshot);
          this.loadLogs();
        }
      }]
    });
    await toast.present();
  }

  async presentSleepDeletedToast(deletedData: OvernightSleepData, index: number) {
    const toast = await this.toastCtrl.create({
      message: 'A sleep log has been deleted!\nTap to undo.',
      duration: 4000,
      position: 'bottom',
      buttons: [{
        text: 'Undo',
        role: 'cancel',
        handler: () => {
          SleepService.AllOvernightData.splice(index, 0, deletedData);
          this.loadLogs();
        }
      }]
    });
    await toast.present();
  }
}