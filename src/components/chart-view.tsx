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
import { HandleUpdateWeatherForecast } from '../types/types';
import {
  HourlyWeatherForecastDataType,
  WeatherDataForChartType,
  WeatherForecastDataType,
} from '../types/open-meteo';
import './chart-view.css';

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
    }
  }, [weatherDataForChart]);

  return (
    <>
      <div id='dateSelector' className='flex justify-normal'>
        {weatherDataForChart
          ? Object.keys(weatherDataForChart['dailyWeatherData']).map(
              (val, idx) => {
                return (
                  <button key={idx}>
                    <input
                      className='hidden'
                      type='radio'
                      id={val}
                      name='weather'
                      checked={selectedDateIdx === idx}
                      onChange={() => handleDateSelectionClick(idx)}
                    />
                    <label
                      className='py-3 mx-1 text-lg font-bold text-white px-4 bg-zinc-800 hover:bg-black opacity-70 cursor-pointer'
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
      <div
        id='lineChart'
        className='grid grid-cols-12 gap-4 text-white text-lg font-bold'
      >
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
                    backgroundColor: '#67d574',
                    borderColor: '#67d574',
                    pointBackgroundColor: '#67d574',
                    pointBorderColor: '#67d574',
                    data: weatherDataOnChart['hourlyTemperature'],
                    yAxisID: 'y',
                  },
                  {
                    type: 'bar' as const,
                    label: `Precipitation`,
                    backgroundColor: '#648bff',
                    borderColor: '#648bff',
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
                        weight: 'bold',
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
                        weight: 'bold',
                      },
                    },
                  },
                  y: {
                    position: 'left' as const,
                    ticks: {
                      color: '#ffffff',
                      font: {
                        size: 15,
                        weight: 'bold',
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
                        weight: 'bold',
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
