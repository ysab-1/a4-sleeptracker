import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { addIcons } from 'ionicons';
import { 
  closeOutline, 
  moonOutline, 
  sunnyOutline, 
  add, 
  trashOutline, 
  happyOutline, 
  removeCircleOutline, 
  sadOutline, 
  checkmarkOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-log-sleep-modal',
  templateUrl: './log-sleep-modal.component.html',
  styleUrls: ['./log-sleep-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LogSleepModalComponent {
  sleepDate: string = new Date().toISOString();
  bedtime: string = new Date().toISOString();
  wakeupTime: string = new Date().toISOString();
  
  awakePeriods: { awakeTime: string; asleepTime: string }[] = [];
  selectedMood: string = 'Refreshed';
  notes: string = '';

  constructor(private modalCtrl: ModalController) {
    addIcons({
      closeOutline,
      moonOutline,
      sunnyOutline,
      add,
      trashOutline,
      happyOutline,
      removeCircleOutline,
      sadOutline,
      checkmarkOutline
    });
  }

  addAwakePeriod() {
    this.awakePeriods.push({
      awakeTime: new Date().toISOString(),
      asleepTime: new Date().toISOString()
    });
  }

  removeAwakePeriod(index: number) {
    this.awakePeriods.splice(index, 1);
  }

  selectMood(mood: string) {
    this.selectedMood = mood;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  saveLog() {
    const start = new Date(this.bedtime);
    const end = new Date(this.wakeupTime);

    const newSleep = new OvernightSleepData(start, end);
    this.modalCtrl.dismiss(newSleep);
  }
}