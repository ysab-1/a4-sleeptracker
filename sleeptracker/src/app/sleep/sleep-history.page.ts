import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { LogSleepModalComponent } from '../modals/log-sleep-modal.component';
import { addIcons } from 'ionicons';
import { 
  chevronBackOutline, 
  chevronForwardOutline, 
  moonOutline, 
  happyOutline, 
  removeCircleOutline, 
  sadOutline 
} from 'ionicons/icons';

interface DayBar {
  letter: string;
  date: Date;
  hours: number;
  isHighlight: boolean;
}

@Component({
  selector: 'app-sleep-history',
  templateUrl: './sleep-history.page.html',
  styleUrls: ['./sleep-history.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class SleepHistoryPage implements OnInit {
  selectedSegment: 'week' | 'day' = 'week';

  currentWeekStart: Date = this.getMonday(new Date());
  weekDaysData: DayBar[] = [];
  weekLoggedCount: number = 0;
  weekAverageHours: number = 0;

  selectedDate: Date = new Date();
  selectedDaySleep: OvernightSleepData | null = null;

  constructor(
    private sleepService: SleepService,
    private modalCtrl: ModalController,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      moonOutline,
      happyOutline,
      removeCircleOutline,
      sadOutline
    });
  }

  ngOnInit() {
    this.refreshAllViews();
  }

  ionViewWillEnter() {
    this.refreshAllViews();
  }

  goBackToToday() {
    this.location.back();
  }

  refreshAllViews() {
    this.buildWeekData();
    this.loadSelectedDayData();

    if (this.cdr) {
      this.cdr.detectChanges();
    }
  }

  getMonday(d: Date): Date {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  changeWeek(offset: number) {
    const next = new Date(this.currentWeekStart);
    next.setDate(next.getDate() + offset * 7);
    this.currentWeekStart = next;
    this.buildWeekData();
  }

  get isCurrentWeek(): boolean {
    const thisMonday = this.getMonday(new Date());
    return this.currentWeekStart.getTime() >= thisMonday.getTime();
  }

  get weekRangeLabel(): string {
    const end = new Date(this.currentWeekStart);
    end.setDate(end.getDate() + 6);
    const startStr = this.currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${startStr} – ${endStr}`;
  }

  buildWeekData() {
    const letters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const allOvernight = SleepService.AllOvernightData || [];

    const days: DayBar[] = [];
    let totalHours = 0;
    let count = 0;

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(this.currentWeekStart);
      dayDate.setDate(dayDate.getDate() + i);
      const dayStr = dayDate.toDateString();

      const matchingLogs = allOvernight.filter(log => {
        if (!log.sleepEnd) return false;
        return new Date(log.sleepEnd).toDateString() === dayStr;
      });

      let hoursForDay = 0;
      if (matchingLogs.length > 0) {
        matchingLogs.forEach(log => {
          const diffMs = new Date(log.sleepEnd).getTime() - new Date(log.sleepStart).getTime();
          hoursForDay += Math.max(0, diffMs / (1000 * 60 * 60));
        });
        totalHours += hoursForDay;
        count++;
      }

      days.push({
        letter: letters[i],
        date: dayDate,
        hours: hoursForDay,
        isHighlight: false
      });
    }

    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].hours > 0) {
        days[i].isHighlight = true;
        break;
      }
    }

    this.weekDaysData = days;
    this.weekLoggedCount = count;
    this.weekAverageHours = count > 0 ? totalHours / count : 0;
  }

  getBarHeightPercent(hours: number): number {
    const pct = (hours / 10) * 100;
    return Math.min(100, Math.max(8, pct));
  }

  changeDay(offset: number) {
    const next = new Date(this.selectedDate);
    next.setDate(next.getDate() + offset);
    this.selectedDate = next;
    this.loadSelectedDayData();
  }

  get isSelectedDayToday(): boolean {
    return this.selectedDate.toDateString() === new Date().toDateString();
  }

  get selectedDayLabel(): string {
    const formatted = this.selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return this.isSelectedDayToday ? `Today, ${formatted}` : formatted;
  }

  loadSelectedDayData() {
    const allOvernight = SleepService.AllOvernightData || [];

    const targetStr = this.selectedDate.toDateString();
    
    const matches = allOvernight.filter(log => {
      const startDate = new Date(log.sleepStart).toDateString();
      const endDate = new Date(log.sleepEnd).toDateString();
      return startDate === targetStr || endDate === targetStr;
    });

    this.selectedDaySleep = matches.length > 0 ? matches[0] : null;
  }

  formatDuration(sleep: OvernightSleepData): string {
    const diffMs = new Date(sleep.sleepEnd).getTime() - new Date(sleep.sleepStart).getTime();
    const totalMins = Math.max(0, Math.floor(diffMs / 60000));
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return `${hrs}h ${mins}m`;
  }

  getMood(sleep: any): string {
    return sleep.mood || 'Refreshed';
  }

  getMoodIcon(mood: string): string {
    if (mood === 'Tired') return 'sad-outline';
    if (mood === 'Neutral') return 'remove-circle-outline';
    return 'happy-outline';
  }

  getAwakePeriods(sleep: any): any[] {
    return sleep.awakePeriods || [];
  }

  getNotes(sleep: any): string {
    return sleep.notes || '';
  }

  async openEditSleepModal(sleepEntry: OvernightSleepData) {
    const modal = await this.modalCtrl.create({
      component: LogSleepModalComponent,
      componentProps: { existingData: sleepEntry }
    });
    await modal.present();
    
    const { data } = await modal.onDidDismiss();
    
    if (data) {
      const updatedLog = data.updated || data;

      if (updatedLog) {
        const index = SleepService.AllOvernightData.indexOf(sleepEntry);

        if (index > -1) {
          SleepService.AllOvernightData[index] = updatedLog;
        } else {
          SleepService.AllOvernightData.push(updatedLog);
        }
      }

      this.refreshAllViews();
      
      this.cdr.detectChanges();
    }
  }
}