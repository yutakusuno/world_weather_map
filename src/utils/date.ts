import { Timezone } from '../types/types';

export const getDayAbbreviation = (day: number): string => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day] || '';
};

export const getMonthAbbreviation = (day: number): string => {
  return (
    [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ][day] || ''
  );
};

export const timezones: Timezone[] = [
  {
    label: 'PST',
    value: 'America/Los_Angeles',
  },
  {
    label: 'CET',
    value: 'Europe/Paris',
  },
  {
    label: 'CST',
    value: 'Asia/Shanghai',
  },
  {
    label: 'EDT',
    value: 'America/New_York',
  },
  {
    label: 'GMT',
    value: 'Europe/London',
  },
  {
    label: 'JST',
    value: 'Asia/Tokyo',
  },
  {
    label: 'MSK',
    value: 'Europe/Moscow',
  },
  {
    label: 'UTC',
    value: 'UTC',
  },
];
