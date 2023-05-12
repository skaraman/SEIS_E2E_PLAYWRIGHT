import moment from '../../node_modules/moment/moment';

export enum momentEnum {
  year = 'year',
  month =  'month',
  day = 'day',
  week = 'week'
}

export const createPastDate = async (unit: momentEnum, amount: number): Promise<string> => {
  return moment(new Date()).subtract(unit, amount).format('MM/DD/YYYY');
};

export const createTodaysDate = async (): Promise<string> => {
  return moment(new Date()).format('MM/DD/YYYY');
};