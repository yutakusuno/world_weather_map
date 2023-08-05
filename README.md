# World Wether Map

Map-based SPA to check weather forecasts around the world.

![20230805_worldweathermap](https://github.com/yutakusuno/world-weather-map/assets/56626111/87a161c8-551f-417f-958b-cccb79134201)

## Usage

- Click on the point you want to check
- Click the date button you want to check

## Technologies

- Frontend: React.js, TypeScript, TailWind CSS
- Third party APIs
  - [Mapbox API](https://www.mapbox.com/)
  - [RainViewer API](https://www.rainviewer.com/)
  - [Open-Meteo API](https://open-meteo.com/)

## Quick Start

Clone this project locally and move to the root directory

```
cd world-weather-map
```

Create `.env.local` in the root directory

```
touch .env.local
```

Set your Mapbox access token in `.env.local`

```.env.local
REACT_APP_MAPBOX_ACCESS_TOKEN=xxxyyyzzz
```

Install dependencies

```
npm install
```

Host the project locally

```
npm start
```

## Future Improvements

- Utilization of time zone databases
- Responsive design on mobile screens
