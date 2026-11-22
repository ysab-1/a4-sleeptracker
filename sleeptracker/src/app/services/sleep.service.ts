import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	private static LoadDefaultData: boolean = true;
	public static AllSleepData: SleepData[] = [];
	public static AllOvernightData: OvernightSleepData[] = [];
	public static AllSleepinessData: StanfordSleepinessData[] = [];

	constructor() {
		if (SleepService.LoadDefaultData) {
			this.addDefaultData();
			SleepService.LoadDefaultData = false;
		}
	}

	private addDefaultData() {
		var goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); // set to yesterday
		goToBed.setHours(1, 3, 0); // 1:03am
		var wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000); // Sleep for 8 hours, waking up at 9:03am
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));

		var sleepinessDate = new Date();
		sleepinessDate.setDate(sleepinessDate.getDate() - 1); // set to yesterday
		sleepinessDate.setHours(14, 38, 0); // 2:38pm
		this.logSleepinessData(new StanfordSleepinessData(4, sleepinessDate));

		goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); // set to yesterday
		goToBed.setHours(23, 11, 0); // 11:11pm
		wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000); // Sleep for 9 hours
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
	}

	public logOvernightData(sleepData: OvernightSleepData) {
		SleepService.AllSleepData.unshift(sleepData);
		SleepService.AllOvernightData.unshift(sleepData);
	}

	public logSleepinessData(sleepData: StanfordSleepinessData) {
		SleepService.AllSleepData.unshift(sleepData);
		SleepService.AllSleepinessData.unshift(sleepData);
	}

	public getAllOvernightData(): OvernightSleepData[] {
		return SleepService.AllOvernightData;
	}

	public getAllSleepinessData(): StanfordSleepinessData[] {
		return SleepService.AllSleepinessData;
	}

	public deleteOvernightData(id: string) {
		SleepService.AllOvernightData = SleepService.AllOvernightData.filter(d => d.id !== id);
		SleepService.AllSleepData = SleepService.AllSleepData.filter(d => d.id !== id);
	}

	public deleteSleepinessData(id: string) {
		SleepService.AllSleepinessData = SleepService.AllSleepinessData.filter(d => d.id !== id);
		SleepService.AllSleepData = SleepService.AllSleepData.filter(d => d.id !== id);
	}

	public updateOvernightData(updatedItem: OvernightSleepData) {
		const overnightIndex = SleepService.AllOvernightData.findIndex(d => d.id === updatedItem.id);
		if (overnightIndex !== -1) {
			SleepService.AllOvernightData[overnightIndex] = updatedItem;
		}
		const sleepIndex = SleepService.AllSleepData.findIndex(d => d.id === updatedItem.id);
		if (sleepIndex !== -1) {
			SleepService.AllSleepData[sleepIndex] = updatedItem;
		}
	}

	public updateSleepinessData(updatedItem: StanfordSleepinessData) {
		const sleepinessIndex = SleepService.AllSleepinessData.findIndex(d => d.id === updatedItem.id);
		if (sleepinessIndex !== -1) {
			SleepService.AllSleepinessData[sleepinessIndex] = updatedItem;
		}
		const sleepIndex = SleepService.AllSleepData.findIndex(d => d.id === updatedItem.id);
		if (sleepIndex !== -1) {
			SleepService.AllSleepData[sleepIndex] = updatedItem;
		}
	}
}