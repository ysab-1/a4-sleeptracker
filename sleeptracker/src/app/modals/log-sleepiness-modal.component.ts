import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { addIcons } from 'ionicons';
import { closeOutline, flash } from 'ionicons/icons';

@Component({
  selector: 'app-log-sleepiness-modal',
  templateUrl: './log-sleepiness-modal.component.html',
  styleUrls: ['./log-sleepiness-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LogSleepinessModalComponent {
  scaleValues = StanfordSleepinessData.ScaleValues.slice(1);
  selectedLevel: number = 4;
  selectedDate: string = new Date().toISOString();
  selectedTime: string = new Date().toISOString();
  notes: string = '';

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline, flash });
  }

  selectLevel(level: number) {
    this.selectedLevel = level;
  }

  getLevelDescription(level: number): string {
    const fullText = StanfordSleepinessData.ScaleValues[level] || '';
    return fullText.split(';')[0];
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  saveLog() {
    const dateObj = new Date(this.selectedDate);
    const timeObj = new Date(this.selectedTime);
    
    dateObj.setHours(timeObj.getHours(), timeObj.getMinutes(), 0, 0);

    const newEntry = new StanfordSleepinessData(this.selectedLevel, dateObj, this.notes);
    this.modalCtrl.dismiss(newEntry);
  }
}