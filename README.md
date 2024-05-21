# World Weather Map

The World Weather Map is an interactive web application that allows users to check weather forecasts from around the world. With features like temperature and precipitation forecasts, rain radar, and time zone linking, it provides up-to-date weather information for any location.

![worldweathermap](https://github.com/yutakusuno/world-weather-map/assets/56626111/3de4473a-b03e-4827-9ae6-cda9d9e419ed)

## Features

- **1-Week Future Temperature and Precipitation**: Get a week-long forecast for temperature and precipitation trends.
- **15-30 Minutes Future Rain Radar**: Visualize real-time rain patterns on an interactive map.
- **Linking of Chart Data to Specified Time Zones**: Easily switch between time zones to view accurate weather data.

## Technologies

- Frontend:
  - React.js
  - TypeScript
  - Tailwind CSS
- Third-Party APIs:
  - [Mapbox API](https://www.mapbox.com/)
  - [RainViewer API](https://www.rainviewer.com/)
  - [Open-Meteo API](https://open-meteo.com/)

## Quick Start

Clone this project locally and navigate to the root directory:

```
git clone https://github.com/yutakusuno/world-weather-map.git
cd world-weather-map
```

Create a .env.local file in the root directory:

```
touch .env.local
```

Set your Mapbox access token in `.env.local`:

```.env.local
REACT_APP_MAPBOX_ACCESS_TOKEN=xxxyyyzzz
```

Install project dependencies:

```
npm install
```

Host the project locally:

```
npm start
```

## TODO

- Responsive design on mobile screens
- More selectable time zones
