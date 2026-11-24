import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { LogSleepinessModalComponent } from '../modals/log-sleepiness-modal.component';
import { addIcons } from 'ionicons';
import { 
  chevronBackOutline, 
  chevronForwardOutline, 
  flashOutline, 
  sunnyOutline, 
  moonOutline, 
  trashOutline 
} from 'ionicons/icons';

interface TimeSlotData {
  title: string;
  range: string;
  icon: string;
  avg: number;
}

@Component({
  selector: 'app-sleepiness-history',
  templateUrl: './sleepiness-history.page.html',
  styleUrls: ['./sleepiness-history.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class SleepinessHistoryPage implements OnInit {
  selectedSegment: 'week' | 'day' = 'week';

  currentWeekStart: Date = this.getMonday(new Date());
  totalWeekLogs: number = 0;
  timeSlots: TimeSlotData[] = [];

  selectedDate: Date = new Date();
  selectedDayLogs: StanfordSleepinessData[] = [];

  constructor(
    private sleepService: SleepService,
    private modalCtrl: ModalController,
    private location: Location
  ) {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      flashOutline,
      sunnyOutline,
      moonOutline,
      trashOutline
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
    this.buildWeekAnalytics();
    this.loadSelectedDayLogs();
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
    this.buildWeekAnalytics();
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

  buildWeekAnalytics() {
    const allSleepiness = SleepService.AllSleepData.filter(
      e => e instanceof StanfordSleepinessData
    ) as StanfordSleepinessData[];

    const weekEnd = new Date(this.currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const weekLogs = allSleepiness.filter(log => {
      const d = new Date(log.loggedAt);
      return d >= this.currentWeekStart && d < weekEnd;
    });

    this.totalWeekLogs = weekLogs.length;

    let morningSum = 0, morningCount = 0;
    let afternoonSum = 0, afternoonCount = 0;
    let eveningSum = 0, eveningCount = 0;

    weekLogs.forEach(log => {
      const hour = new Date(log.loggedAt).getHours();
      const val = log.loggedValue;

      if (hour >= 6 && hour < 12) {
        morningSum += val;
        morningCount++;
      } else if (hour >= 12 && hour < 18) {
        afternoonSum += val;
        afternoonCount++;
      } else {
        eveningSum += val;
        eveningCount++;
      }
    });

    this.timeSlots = [
      {
        title: 'Morning',
        range: '6am–12pm',
        icon: 'flash-outline',
        avg: morningCount > 0 ? morningSum / morningCount : 0
      },
      {
        title: 'Afternoon',
        range: '12pm–6pm',
        icon: 'sunny-outline',
        avg: afternoonCount > 0 ? afternoonSum / afternoonCount : 0
      },
      {
        title: 'Evening',
        range: '6pm–12am',
        icon: 'moon-outline',
        avg: eveningCount > 0 ? eveningSum / eveningCount : 0
      }
    ];
  }

  changeDay(offset: number) {
    const next = new Date(this.selectedDate);
    next.setDate(next.getDate() + offset);
    this.selectedDate = next;
    this.loadSelectedDayLogs();
  }

  get isSelectedDayToday(): boolean {
    return this.selectedDate.toDateString() === new Date().toDateString();
  }

  get selectedDayLabel(): string {
    const formatted = this.selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return this.isSelectedDayToday ? `Today, ${formatted}` : formatted;
  }

  loadSelectedDayLogs() {
    const allSleepiness = SleepService.AllSleepData.filter(
      e => e instanceof StanfordSleepinessData
    ) as StanfordSleepinessData[];

    const targetStr = this.selectedDate.toDateString();
    this.selectedDayLogs = allSleepiness.filter(
      log => new Date(log.loggedAt).toDateString() === targetStr
    );

    this.selectedDayLogs.sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
  }

  async openEditSleepinessModal(log: StanfordSleepinessData) {
    const modal = await this.modalCtrl.create({
      component: LogSleepinessModalComponent,
      componentProps: { existingData: log }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.refreshAllViews();
    }
  }

  deleteLog(log: StanfordSleepinessData) {
    const index = SleepService.AllSleepData.indexOf(log);
    if (index > -1) {
      SleepService.AllSleepData.splice(index, 1);
      this.refreshAllViews();
    }
  }
}