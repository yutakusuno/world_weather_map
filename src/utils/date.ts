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

export const defaultTimezone: Timezone = {
  label: 'America/Vancouver',
  value: 'America/Vancouver',
};

// NOTE: This needs lib to include ES2022 https://github.com/microsoft/TypeScript/issues/49231#issuecomment-1740901574
export const timeZones: Timezone[] = Intl.supportedValuesOf('timeZone').map(
  (timeZone: string) => ({
    label: timeZone,
    value: timeZone,
  })
);
