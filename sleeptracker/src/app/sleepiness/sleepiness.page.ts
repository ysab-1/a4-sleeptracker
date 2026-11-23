import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { LogSleepinessModalComponent } from '../modals/log-sleepiness-modal.component';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-sleepiness',
  templateUrl: './sleepiness.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class SleepinessPage implements OnInit {
  sleepinessSegment = 'week';
  sleepinessLogs: StanfordSleepinessData[] = [];

  constructor(private sleepService: SleepService, private modalCtrl: ModalController, private toastCtrl: ToastController) {}

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

  async presentSleepinessLoggedToast(newData: StanfordSleepinessData) {
    const toast = await this.toastCtrl.create({
      message: 'Sleepiness has been logged!\nTap to undo.',
      duration: 4000,
      position: 'bottom',
      buttons: [{
        text: 'Undo',
        role: 'cancel',
        handler: () => {
          this.sleepService.deleteSleepinessData(newData.id);
          this.loadLogs();
        }
      }]
    });
    await toast.present();
  }

  async presentSleepinessEditedToast(updatedData: StanfordSleepinessData, oldSnapshot: StanfordSleepinessData) {
    const toast = await this.toastCtrl.create({
      message: 'A sleepiness log has been edited!\nTap to undo.',
      duration: 4000,
      position: 'bottom',
      buttons: [{
        text: 'Undo',
        role: 'cancel',
        handler: () => {
          this.sleepService.updateSleepinessData(oldSnapshot);
          this.loadLogs();
        }
      }]
    });
    await toast.present();
  }

  async presentSleepinessDeletedToast(deletedData: StanfordSleepinessData, index: number) {
    const toast = await this.toastCtrl.create({
      message: 'A sleepiness log has been deleted!\nTap to undo.',
      duration: 4000,
      position: 'bottom',
      buttons: [{
        text: 'Undo',
        role: 'cancel',
        handler: () => {
          SleepService.AllSleepinessData.splice(index, 0, deletedData);
          this.loadLogs();
        }
      }]
    });
    await toast.present();
  }
}