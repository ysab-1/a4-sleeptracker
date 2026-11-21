import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-log-sleepiness-modal',
  templateUrl: './log-sleepiness-modal.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LogSleepinessModalComponent {
  selectedLevel: number = 4;
  notes: string = '';
  scaleValues = StanfordSleepinessData.ScaleValues;

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    const sleepinessData = new StanfordSleepinessData(this.selectedLevel, new Date(), this.notes);
    return this.modalCtrl.dismiss(sleepinessData, 'confirm');
  }
}