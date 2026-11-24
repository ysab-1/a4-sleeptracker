import { Component, Input } from '@angular/core';
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
  @Input() existingData?: OvernightSleepData;

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

  ngOnInit() {
    const now = new Date();
    
    if (this.existingData) {
      this.bedtime = new Date(this.existingData.sleepStart).toISOString();
      this.wakeupTime = new Date(this.existingData.sleepEnd).toISOString();
      this.selectedMood = (this.existingData as any).mood || 'Refreshed';
      this.notes = (this.existingData as any).notes || '';
      this.awakePeriods = (this.existingData as any).awakePeriods || [];
    } else {

      const lastNight = new Date(now);
      lastNight.setDate(lastNight.getDate() - 1);
      lastNight.setHours(23, 0, 0, 0);

      this.bedtime = lastNight.toISOString();
      this.wakeupTime = now.toISOString();
    }
  }

  toLocalISOString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
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

    if (start >= end) {
      start.setDate(end.getDate() - 1);
    }

    const updatedSleep: any = new OvernightSleepData(start, end);
    updatedSleep.awakePeriods = this.awakePeriods;
    updatedSleep.mood = this.selectedMood;
    updatedSleep.notes = this.notes;

    if (this.existingData) {
      this.modalCtrl.dismiss({ 
        updated: updatedSleep, 
        original: this.existingData 
      });
    } else {
      this.modalCtrl.dismiss(updatedSleep);
    }
  }
}