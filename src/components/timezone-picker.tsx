import { useEffect, useState } from 'react';
import Select from 'react-select';
import {
  ArrayObjectSelectState,
  Timezone,
  HandleUpdateWeatherForecast,
} from '../types/types';
import { timezones } from '../utils/date';

export const TimezonePicker = ({
  handleUpdateWeatherForecast,
}: HandleUpdateWeatherForecast) => {
  // I changed the position of the state here, that's how you should use the state in react
  // https://reactjs.org/docs/hooks-state.html#declaring-a-state-variable

  // If you don't need a state you can remove the following line
  const [state, setState] = useState<ArrayObjectSelectState>({
    selectedTimezone: timezones[0],
  });

  useEffect(() => {
    handleUpdateWeatherForecast(
      { lat: 0, lng: 0 },
      state.selectedTimezone?.value
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className='timezone-picker'>
      <div>Time zone:</div>
      <Select
        // If you don't need a state you can remove the two following lines value & onChange
        value={state.selectedTimezone}
        onChange={(option: Timezone | null) => {
          setState({ selectedTimezone: option });
        }}
        // defaultValue={timezones[0]}
        getOptionLabel={(timezone: Timezone) => timezone.label}
        getOptionValue={(timezone: Timezone) => timezone.value}
        options={timezones}
        isClearable={false}
        backspaceRemovesValue={true}
        menuPlacement={'auto'}
        styles={{
          option: (defaultStyles, state) => ({
            ...defaultStyles,
            color: '#000000',
            opacity: 0.8,
          }),
          control: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: 'rgba(42, 39, 39, 0.6)',
            padding: '0px',
            border: 'none',
            boxShadow: 'none',
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
            primary25: 'rgba(200, 200, 200, 0.6)',
            primary: 'rgba(100, 100, 100, 0.6)',
          },
        })}
      />
    </div>
  );
};
