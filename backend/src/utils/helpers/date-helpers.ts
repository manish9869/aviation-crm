import moment from 'moment';
export class DateHelper {
  isAfter(compareDate): boolean {
    const today = moment().format();
    if (moment(today).isAfter(compareDate)) {
      return true;
    }
    return false;
  }
}
