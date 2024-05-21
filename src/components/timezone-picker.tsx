import { useState } from 'react';
import Select from 'react-select';

import { Timezone, HandleUpdateWeatherForecast } from '../types/types';
import { timezones } from '../utils/date';

type TimezonePickerProps = {
  handleUpdateWeatherForecast: HandleUpdateWeatherForecast;
};

export const TimezonePicker = ({
  handleUpdateWeatherForecast,
}: TimezonePickerProps) => {
  const [selectedTimezone, setSelectedTimezone] = useState<Timezone>(
    timezones[0]
  );

  return (
    <div className='timezone-picker'>
      <div>Time zone:</div>
      <Select
        value={selectedTimezone}
        onChange={(timeZone: Timezone | null) => {
          if (timeZone) {
            setSelectedTimezone(timeZone);

            // When passing 0,0, as we manage the state of current location, it just goes fetching weather data of with the selected timezone, the current location
            handleUpdateWeatherForecast({ lat: 0, lng: 0 }, timeZone.value);
          }
        }}
        defaultValue={selectedTimezone}
        getOptionLabel={(timezone: Timezone) => timezone.label}
        getOptionValue={(timezone: Timezone) => timezone.value}
        options={timezones}
        isClearable={false}
        backspaceRemovesValue={true}
        menuPlacement={'auto'}
        styles={{
          option: (defaultStyles, state) => ({
            ...defaultStyles,
            color: 'white',
          }),
          control: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: '#2d2d2d',
            padding: '0px',
            border: 'none',
            boxShadow: 'none',
            cursor: 'pointer',
          }),
          menu: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: '#2d2d2d',
          }),
          singleValue: (defaultStyles) => ({
            ...defaultStyles,
            color: '#ffffff',
          }),
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: '#C8C8C8',
            primary: '#646464',
          },
        })}
      />
    </div>
  );
};
