import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, ModalController } from '@ionic/angular/standalone';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { LogSleepModalComponent } from '../modals/log-sleep-modal.component';
import { LogSleepinessModalComponent } from '../modals/log-sleepiness-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent,  IonIcon, IonButton, ModalController],
})
export class HomePage {
	currentDate: string = '';

  	constructor(public sleepService:SleepService, private modalCtrl: ModalController) {}

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
}
