/* eslint-disable no-case-declarations */
import moment, { Moment } from 'moment';
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

  static PatientNameValidator(string: string) {
    /**
     * Ensure it only starts with alphabets, can have numbers and can only contain '-', '_' special characters.
     */
    const strongRegex = new RegExp(/^[ A-Za-z0-9_-]*$/);
    if (!strongRegex.test(string)) {
      throw new Error(
        'Invalid character in Patientname. Only hiphen (-) and underscore (_) are allowed',
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
    const stringCode = `HA-${
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
      let newCode = `HA-${
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
          newCode = `HA-${
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

  static convertToKobo(amount: number): number {
    return amount * 100;
  }

  static convertToNaira(amount: number): number {
    return amount / 100;
  }
}
