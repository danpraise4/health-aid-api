/* eslint-disable no-case-declarations */
import moment, { Moment } from 'moment';
import { Trip } from '../../index.d';
import { RIDE_HAILING_STATUS } from '../../config/constants';
import { Model } from 'mongoose';

export default class HelperClass {
  static titleCase(string: string): string {
    let sentence = string.toLowerCase().split(' ');
    sentence = sentence.filter((str) => str.trim().length > 0);
    for (let i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(' ');
  }

  static upperCase(string: string): string {
    let sentence = string.toUpperCase().split(' ');
    sentence = sentence.filter((str) => str.trim().length > 0);
    return sentence.join(' ');
  }

  static capitalCase(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  static generateRandomChar(length = 32, type = 'alpha-num'): string {
    // "num", "upper", "lower", "upper-num", "lower-num", "alpha-num"
    let result = '';
    let characters =
      'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    if (type === 'num') characters = '0123456789';
    if (type === 'upper-num')
      characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789';
    if (type === 'lower-num')
      characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    if (type === 'upper') characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (type === 'lower') characters = 'abcdefghijklmnopqrstuvwxyz';
    if (type === 'alpha')
      characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    const charactersLength = characters.length;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static userNameValidator(string: string) {
    /**
     * Ensure it only starts with alphabets, can have numbers and can only contain '-', '_' special characters.
     */
    const strongRegex = new RegExp(/^[ A-Za-z0-9_-]*$/);
    if (!strongRegex.test(string)) {
      throw new Error(
        'Invalid character in username. Only hiphen (-) and underscore (_) are allowed',
      );
    }
  }
  static removeUnwantedProperties(object: unknown, properties: string[]) {
    let newObject: { [key: string]: string } = {};
    if (typeof object === 'object' && object !== null) {
      newObject = { ...object };
      properties.forEach((property) => {
        delete newObject[property];
      });
    }
    return newObject;
  }

  static roundMoney(amount: number): number {
    return Math.ceil(amount / 100) * 100;
  }

  // static subscriptionCycle(
  //   condition: 'weekends' | 'weekdays' | 'weekly' | 'month',
  // ): {
  //   startDate: Date;
  //   endDate: Date;
  // } {
  //   const currentDate = moment().startOf('day');
  //   let startDate: moment.Moment;
  //   let endDate: moment.Moment;

  //   if (condition === 'weekends') {
  //     // If the current day is Sunday, start from the next Saturday
  //     // Otherwise, start from the next Saturday based on the current day
  //     const daysToAdd = 6 - currentDate.day();
  //     currentDate.day() === 0
  //       ? (startDate = currentDate.clone().add(6, 'days'))
  //       : (startDate = currentDate.clone().add(daysToAdd, 'days'));
  //     endDate = startDate.clone().add(1, 'day');
  //   } else if (condition === 'weekdays') {
  //     // If the current day is Friday, start from the next Monday
  //     // Otherwise, start from the next Monday based on the current day
  //     const daysToAdd = currentDate.day() < 5 ? 1 : 8 - currentDate.day();
  //     currentDate.day() === 5
  //       ? (startDate = currentDate.clone().add(3, 'days'))
  //       : (startDate = currentDate.clone().add(daysToAdd, 'days'));
  //     endDate = startDate.clone().add(4, 'days');
  //   } else if (condition === 'weekly') {
  //     // If the current day is Sunday, start from the next Monday
  //     // Otherwise, start from the next Monday based on the current day
  //     startDate = currentDate.clone().startOf('isoWeek').add(1, 'week');
  //     endDate = startDate.clone().add(6, 'days');
  //   } else if (condition === 'month') {
  //     // If the current day is the last day of the month, start from the first day of the next month
  //     // Otherwise, start from the first day of the next month based on the current day
  //     startDate = currentDate.clone().startOf('month').add(1, 'month');
  //     endDate = startDate.clone().subtract(1, 'day');
  //   } else {
  //     throw new Error('Invalid subscription cycle');
  //   }

  //   return {
  //     startDate: startDate.toDate(),
  //     endDate: endDate.toDate(),
  //   };
  // }

  static generateSubscriptionCycle(
    startDate: Moment,
    endDate: Moment,
  ): { startDate: Moment; endDate: Moment } {
    const durationInWeeks = endDate.diff(startDate, 'weeks');
    const durationInMonths = endDate.diff(startDate, 'months');
    let cyclePeriod: moment.DurationInputArg2 = 'week';
    let numberOfCycles = durationInWeeks;
    if (durationInMonths >= 1) {
      cyclePeriod = 'month';
      numberOfCycles = durationInMonths;
    }
    const newEndDate = endDate
      .clone()
      .add(numberOfCycles, cyclePeriod as moment.DurationInputArg2);
    const newStartDate = newEndDate.clone().subtract(durationInWeeks, 'weeks');

    return {
      startDate: newStartDate,
      endDate: newEndDate,
    };
  }

  static generateTrips(
    startDate: Moment,
    endDate: Moment,
    pickupDays: string[],
    toAndFro?: boolean,
    firstTripTime?: string,
    secondTripTime?: string,
  ): Trip[] {
    const trips: Trip[] = [];
    const currentDate = moment(startDate);
    while (currentDate.isSameOrBefore(endDate, 'day')) {
      if (pickupDays.includes(currentDate.format('dddd').toLowerCase())) {
        for (let i = 0; i < (toAndFro ? 2 : 1); i++) {
          trips.push({
            name: toAndFro
              ? i === 0
                ? 'First Trip'
                : 'Second Trip'
              : `Trip ${trips.length + 1}`,
            status: RIDE_HAILING_STATUS.PENDING,
            tripDate: currentDate
              .clone()
              .set({
                hour: HelperClass.splitTime(
                  i === 0 ? firstTripTime : secondTripTime,
                ).hour,
                minute: HelperClass.splitTime(
                  i === 0 ? firstTripTime : secondTripTime,
                ).minute,
              })
              .toDate(),
            completedAt: null,
          });
        }
      }
      currentDate.add(1, 'day');
    }
    return trips;
  }

  static countWeekdaysInMonth(date: Moment): number {
    const start = date.clone().startOf('month');
    const end = date.clone().endOf('month');
    let count = 0;

    while (end > start || start.format('DD') === end.format('DD')) {
      if (start.day() !== 0 && start.day() !== 6) count++;
      start.add(1, 'day');
    }

    return count;
  }

  static countWeekdaysBasedOnStartDateAndEndDate(
    startDate: Moment,
    endDate: Moment,
  ): number {
    let count = 0;
    while (
      endDate > startDate ||
      startDate.format('DD') === endDate.format('DD')
    ) {
      if (startDate.day() !== 0 && startDate.day() !== 6) count++;
      startDate.add(1, 'day');
    }
    return count;
  }

  static countDays(
    condition: 'weekends' | 'weekdays' | 'weekly' | 'month',
    startDate?: Moment,
    endDate?: Moment,
  ) {
    if (!startDate || !endDate) {
      throw new Error('Both start date and end date must be provided.');
    }
    const start = moment(startDate);
    const end = moment(endDate);
    switch (condition) {
      case 'weekends':
        let weekends = 0;
        while (start.isSameOrBefore(end, 'day')) {
          if (start.day() === 0 || start.day() === 6) {
            weekends++;
          }
          start.add(1, 'day');
        }
        return weekends;
      case 'weekdays':
        let weekdays = 0;
        while (start.isSameOrBefore(end, 'day')) {
          if (start.day() >= 1 && start.day() <= 5) {
            weekdays++;
          }
          start.add(1, 'day');
        }
        return weekdays;
      case 'weekly':
        return Math.ceil(end.diff(start, 'weeks', true));
      case 'month':
        return end.diff(start, 'months', true) + 1;
      default:
        throw new Error('Invalid condition provided.');
    }
  }

  static splitTime(time: string): { hour: number; minute: number } {
    const [hour, minute] = time.split(':');
    return { hour: Number(hour), minute: Number(minute) };
  }

  static getTotalTrips(
    trips: Map<string, Trip[]>,
    filter?: 'pending' | 'completed' | 'all',
  ): number {
    let totalTrips = 0;

    for (const date of trips.keys()) {
      const tripList = trips.get(date);
      if (filter === 'pending') {
        totalTrips += tripList.filter(
          (trip) => trip.status === 'pending',
        ).length;
      } else if (filter === 'completed') {
        totalTrips += tripList.filter(
          (trip) => trip.status === 'completed',
        ).length;
      } else {
        totalTrips += tripList.length;
      }
    }

    return totalTrips;
  }

  static convertObjectToMap(tripsObject: {
    [key: string]: Trip[];
  }): Map<string, Trip[]> {
    const map = new Map<string, Trip[]>();
    for (const date in tripsObject) {
      map.set(date, tripsObject[date]);
    }
    return map;
  }

  static shortName(string: string): string {
    let sentence = string.toLowerCase().split(' ');
    sentence = sentence.filter((str) => str.trim().length > 0);
    let shortName = '';
    for (let i = 0; i < sentence.length; i++) {
      if (sentence[i]) {
        shortName += sentence[i][0].toUpperCase();
      }
    }
    return shortName;
  }

  static async generateSystemCode<T>(
    model: Model<T>,
    string: string,
    number = 4,
  ): Promise<string> {
    let code;
    const stringCode = `TXA-${
      HelperClass.shortName(string).length >= 2
        ? HelperClass.shortName(string)
        : `${HelperClass.shortName(string)}${HelperClass.generateRandomChar(
            1,
            'upper',
          )}`
    }-${HelperClass.generateRandomChar(number, 'upper-num')}`;

    const isCodeTaken = await model.findOne({
      systemCode: stringCode,
      deletedAt: null,
    });
    if (isCodeTaken) {
      let newCode = `TXA-${
        HelperClass.shortName(string).length >= 2
          ? HelperClass.shortName(string)
          : `${HelperClass.shortName(string)}${HelperClass.generateRandomChar(
              1,
              'upper',
            )}`
      }-${HelperClass.generateRandomChar(number, 'upper-num')}`;
      let isCodeTakenAgain = true;
      while (isCodeTakenAgain) {
        const check = await model.findOne({
          systemCode: newCode,
          deletedAt: null,
        });
        if (check) {
          newCode = `TXA-${
            HelperClass.shortName(string).length >= 2
              ? HelperClass.shortName(string)
              : `${HelperClass.shortName(
                  string,
                )}${HelperClass.generateRandomChar(1, 'upper')}`
          }-${HelperClass.generateRandomChar(number, 'upper-num')}`;
          isCodeTakenAgain = true;
        }
      }
      code = newCode;
      isCodeTakenAgain = false;
    } else {
      code = stringCode;
    }

    return code;
  }
}
