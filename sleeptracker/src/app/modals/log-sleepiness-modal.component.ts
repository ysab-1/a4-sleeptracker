import { Component, Input, OnInit } from '@angular/core';
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
export class LogSleepinessModalComponent implements OnInit {
  @Input() existingData?: StanfordSleepinessData;

  scaleValues = StanfordSleepinessData.ScaleValues.slice(1);
  selectedLevel: number = 4;
  selectedDate: string = new Date().toISOString();
  selectedTime: string = new Date().toISOString();
  notes: string = '';

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline, flash });
  }

  ngOnInit() {
    if (this.existingData) {
      const logDate = new Date(this.existingData.loggedAt || new Date());
      
      this.selectedLevel = this.existingData.loggedValue || 4;
      this.selectedDate = logDate.toISOString();
      this.selectedTime = logDate.toISOString();
      this.notes = this.existingData.notes || '';
    }
  }

  selectLevel(level: number) {
    this.selectedLevel = level;
  }

  getLevelDescription(level: number): string {
    const fullText = StanfordSleepinessData.ScaleValues[level] || '';
    return fullText.split(';')[0];
  }

  saveLog() {
    const dateObj = new Date(this.selectedDate);
    const timeObj = new Date(this.selectedTime);
    
    dateObj.setHours(timeObj.getHours(), timeObj.getMinutes(), 0, 0);

    const updatedLog = new StanfordSleepinessData(this.selectedLevel, dateObj, this.notes);
    
    this.modalCtrl.dismiss({
      updated: updatedLog,
      original: this.existingData
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}