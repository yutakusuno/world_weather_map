import Select from 'react-select';

import { Timezone, HandleUpdateWeatherForecast } from '../types/types';
import { timeZones } from '../utils/date';

type TimezonePickerProps = {
  selectedTimezone: Timezone;
  setSelectedTimezone: React.Dispatch<React.SetStateAction<Timezone>>;
  handleUpdateWeatherForecast: HandleUpdateWeatherForecast;
};

export const TimezonePicker = ({
  handleUpdateWeatherForecast,
  selectedTimezone,
  setSelectedTimezone,
}: TimezonePickerProps) => {
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
        options={timeZones}
        isClearable={false}
        backspaceRemovesValue={true}
        menuPlacement={'auto'}
        styles={{
          option: (defaultStyles, state) => ({
            ...defaultStyles,
            color: state.isFocused || state.isSelected ? '#0F172A' : '#ffffff',
            backgroundColor:
              state.isFocused || state.isSelected ? '#ffffff' : '#0F172A',
            fontSize: 'small',
          }),
          control: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: '#0F172A',
            padding: '0px',
            border: 'none',
            boxShadow: 'none',
            cursor: 'pointer',
            opacity: '0.9',
            fontSize: 'small',
          }),
          menu: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: '#0F172A',
            opacity: '0.9',
            color: '#ffffff',
          }),
          input: (defaultStyles) => ({
            ...defaultStyles,
            color: '#ffffff',
          }),
          singleValue: (defaultStyles) => ({
            ...defaultStyles,
            color: '#ffffff',
          }),
        }}
      />
    </div>
  );
};
