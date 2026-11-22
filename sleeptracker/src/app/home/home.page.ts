import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, ModalController } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { LogSleepModalComponent } from '../modals/log-sleep-modal.component';
import { LogSleepinessModalComponent } from '../modals/log-sleepiness-modal.component';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent,  IonIcon, IonButton, ModalController],
})
export class HomePage {
	currentDate: string = '';

  	constructor(public sleepService:SleepService, private modalCtrl: ModalController, private toastCtrl: ToastController) {}

	ngOnInit() {
		console.log(this.allSleepData);
		this.setCurrentDate();
	}

	ionViewWillEnter() {
    // Refreshes data dynamically when navigating back to the home page tab
    }

	setCurrentDate() {
		const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
		this.currentDate = new Date().toLocaleDateString('en-US', options);
	}
	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}

	get lastNightSleep(): OvernightSleepData | null {
    const overnightLogs = SleepService.AllOvernightData;
    return overnightLogs.length > 0 ? overnightLogs[0] : null;
  }

  async openLogSleepModal() {
    const modal = await this.modalCtrl.create({
      component: LogSleepModalComponent,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.sleepService.logOvernightData(data);
    }
  }

  async openLogSleepinessModal() {
    const modal = await this.modalCtrl.create({
      component: LogSleepinessModalComponent,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.sleepService.logSleepinessData(data);
    }
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
        }
      }]
    });
    await toast.present();
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
        }
      }]
    });
    await toast.present();
  }
}
