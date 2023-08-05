import { useEffect, useState } from "react";
import { IsOpenMeteoForecastData } from "./Top";
import Select from "react-select";

interface Timezone {
  label: string;
  value: string;
}

interface ArrayObjectSelectState {
  selectedTimezone: Timezone | null;
}

const timezones: Timezone[] = [
  {
    label: "PST",
    value: "America/Los_Angeles",
  },
  {
    label: "CET",
    value: "Europe/Paris",
  },
  {
    label: "CST",
    value: "Asia/Shanghai",
  },
  {
    label: "EDT",
    value: "America/New_York",
  },
  {
    label: "GMT",
    value: "Europe/London",
  },
  {
    label: "JST",
    value: "Asia/Tokyo",
  },
  {
    label: "MSK",
    value: "Europe/Moscow",
  },
  {
    label: "UTC",
    value: "UTC",
  },
];

export const initTimezone: string = timezones[0].value;

export const TimezonePicker: React.FC<IsOpenMeteoForecastData> = ({
  openMeteoForecastData,
}) => {
  // I changed the position of the state here, that's how you should use the state in react
  // https://reactjs.org/docs/hooks-state.html#declaring-a-state-variable

  // If you don't need a state you can remove the following line
  const [state, setState] = useState<ArrayObjectSelectState>({
    selectedTimezone: timezones[0],
  });

  useEffect(() => {
    openMeteoForecastData({ lat: 0, lng: 0 }, state.selectedTimezone?.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="timezone-picker">
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
        menuPlacement={"auto"}
        styles={{
          option: (defaultStyles, state) => ({
            ...defaultStyles,
            color: "#000000",
            opacity: 0.8,
          }),
          control: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: "rgba(42, 39, 39, 0.6)",
            padding: "0px",
            border: "none",
            boxShadow: "none",
          }),
          singleValue: (defaultStyles) => ({
            ...defaultStyles,
            color: "#ffffff",
          }),
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: "rgba(200, 200, 200, 0.6)",
            primary: "rgba(100, 100, 100, 0.6)",
          },
        })}
      />
    </div>
  );
};
