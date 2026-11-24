import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { LocalNotifications } from '@capacitor/local-notifications';
import { addIcons } from 'ionicons';
import { moonOutline, home, flashOutline, flash, moon, add, sunnyOutline } from 'ionicons/icons';

addIcons({
  'moon-outline': moonOutline,
  'home': home,
  'flash-outline': flashOutline,
  'flash': flash,
  'moon': moon,
  'add': add,
  'sunny-outline': sunnyOutline
});

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor() {}

  async ngOnInit() {
    await this.scheduleSleepNotifications();
  }

  async scheduleSleepNotifications() {
    try {
      // Request permission to display notifications
      const permStatus = await LocalNotifications.requestPermissions();
      if (permStatus.display === 'granted') {
        
        await LocalNotifications.schedule({
          notifications: [
            {
              title: 'Sleep Tracker',
              body: 'Good evening! Feeling sleepy? Make sure to log it!',
              id: 99,
              schedule: { at: new Date(new Date().getTime() + 4000) },
              sound: undefined,
            },
            {
              title: 'Sleep Tracker',
              body: 'Good morning! Make sure to log your sleep from last night.',
              id: 1,
              schedule: { on: { hour: 8, minute: 0 } },
              sound: undefined,
            },
            {
              title: 'Sleep Tracker',
              body: 'Good afternoon! Feeling sleepy? Make sure to log it!',
              id: 2,
              schedule: { on: { hour: 13, minute: 0 } },
              sound: undefined,
            },
            {
              title: 'Sleep Tracker',
              body: 'Good evening! Feeling sleepy? Make sure to log it!',
              id: 3,
              schedule: { on: { hour: 20, minute: 0 } },
              sound: undefined,
            },
          ],
        });

        const pending = await LocalNotifications.getPending();
        console.log('Scheduled notifications:', pending);
      }
    } catch (e) {
      console.log('Local notifications are running in a browser environment or unavailable.', e);
    }
  }
}