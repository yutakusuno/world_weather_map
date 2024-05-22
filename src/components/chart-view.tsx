import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

import { TimezonePicker } from './timezone-picker';
import { collectWeatherDataForChart } from '../utils/chart';
import { HandleUpdateWeatherForecast, Timezone } from '../types/types';
import {
  HourlyWeatherForecastDataType,
  WeatherDataForChartType,
  WeatherForecastDataType,
} from '../types/open-meteo';
import { defaultTimezone } from '../utils/date';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

type ChartViewProps = {
  weatherForecastData: WeatherForecastDataType | undefined;
  handleUpdateWeatherForecast: HandleUpdateWeatherForecast;
};

export const ChartView = ({
  weatherForecastData,
  handleUpdateWeatherForecast,
}: ChartViewProps) => {
  const [weatherDataForChart, setWeatherDataForChart] = useState<
    WeatherDataForChartType | undefined
  >(undefined);
  const [weatherDataOnChart, setWeatherDataOnChart] = useState<
    HourlyWeatherForecastDataType | undefined
  >(undefined);
  const [selectedTimezone, setSelectedTimezone] =
    useState<Timezone>(defaultTimezone);
  const [selectedDateIdx, setSelectedDateIdx] = useState<number>(0);

  const handleDateSelectionClick = (idx: number) => {
    if (weatherDataForChart) {
      setWeatherDataOnChart(
        Object.values(weatherDataForChart['dailyWeatherData'])[idx]
      );
      setSelectedDateIdx(idx);
    }
  };

  useEffect(() => {
    if (weatherForecastData === undefined) return;

    const weatherData: WeatherDataForChartType = {
      ...collectWeatherDataForChart(weatherForecastData),
    };

    setWeatherDataForChart(weatherData);
  }, [weatherForecastData]);

  useEffect(() => {
    if (weatherDataForChart) {
      setWeatherDataOnChart(
        Object.values(weatherDataForChart['dailyWeatherData'])[0]
      );
      setSelectedDateIdx(0);

      console.log(
        "weatherDataForChart['currentWeatherData']['timeZone']",
        weatherDataForChart['currentWeatherData']['timeZone']
      );

      setSelectedTimezone({
        label: weatherDataForChart['currentWeatherData']['timeZone'],
        value: weatherDataForChart['currentWeatherData']['timeZone'],
      });
    }
  }, [weatherDataForChart]);

  return (
    <>
      <div className='flex justify-normal fixed left-0 bottom-[288px]'>
        {weatherDataForChart
          ? Object.keys(weatherDataForChart['dailyWeatherData']).map(
              (val, idx) => {
                return (
                  <button
                    key={idx}
                    className={`py-1 mx-1 hover:bg-slate-900 bg-slate-900 ${
                      selectedDateIdx === idx ? '' : 'bg-opacity-60'
                    }`}
                    onClick={() => handleDateSelectionClick(idx)}
                  >
                    <input
                      className='hidden'
                      type='radio'
                      id={val}
                      name='weather'
                    />
                    <label
                      className='text-white px-4 cursor-pointer'
                      htmlFor={val}
                    >
                      {val}
                    </label>
                  </button>
                );
              }
            )
          : ''}
      </div>
      <div className='grid grid-cols-12 gap-4 text-white text-lg fixed p-4 w-full left-0 bottom-0 h-72 bg-slate-900 bg-opacity-60'>
        <div className='col-span-2'>
          <div className='grid grid-rows-3 grid-flow-col'>
            <div>
              <div className='text-3xl'>
                Now{' '}
                {weatherDataForChart
                  ? `${weatherDataForChart['currentWeatherData']['temperature']}℃`
                  : ''}
              </div>
              {weatherDataForChart
                ? weatherDataForChart['currentWeatherData']['weather']
                : ''}
            </div>
            <div>
              {weatherDataForChart
                ? weatherDataForChart['currentWeatherData']['time']
                : ''}
            </div>
            <TimezonePicker
              selectedTimezone={selectedTimezone}
              setSelectedTimezone={setSelectedTimezone}
              handleUpdateWeatherForecast={handleUpdateWeatherForecast}
            />
          </div>
        </div>
        <div className='col-span-10'>
          {weatherDataOnChart && (
            <Chart
              type='bar'
              data={{
                labels: weatherDataOnChart['hourlyTime'],
                datasets: [
                  {
                    type: 'line' as const,
                    label: `Temperature`,
                    backgroundColor: '#95C21D',
                    borderColor: '#95C21D',
                    pointBackgroundColor: '#95C21D',
                    pointBorderColor: '#95C21D',
                    data: weatherDataOnChart['hourlyTemperature'],
                    yAxisID: 'y',
                  },
                  {
                    type: 'bar' as const,
                    label: `Precipitation`,
                    backgroundColor: '#4ba7eb',
                    borderColor: '#4ba7eb',
                    data: weatherDataOnChart['hourlyPrecipitationProbability'],
                    yAxisID: 'y1',
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  // https://www.chartjs.org/docs/master/configuration/legend.html
                  legend: {
                    labels: {
                      color: '#ffffff',
                      font: {
                        size: 15,
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: '#ffffff',
                      font: {
                        size: 15,
                      },
                    },
                  },
                  y: {
                    position: 'left' as const,
                    ticks: {
                      color: '#ffffff',
                      font: {
                        size: 15,
                      },
                      callback: function (value) {
                        return `${value}℃`;
                      },
                    },
                  },
                  y1: {
                    position: 'right' as const,
                    ticks: {
                      color: '#ffffff',
                      font: {
                        size: 15,
                      },
                      callback: function (value) {
                        return `${value}mm`;
                      },
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};
