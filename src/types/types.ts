export type Point = {
  lat: number;
  lng: number;
};

export type HandleUpdateWeatherForecast = {
  handleUpdateWeatherForecast: (
    point: Point,
    timezone: string | undefined
  ) => Promise<void>;
};

export type Timezone = {
  label: string;
  value: string;
};

export type ArrayObjectSelectState = {
  selectedTimezone: Timezone | null;
};
