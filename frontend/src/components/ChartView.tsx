import React, { useEffect, useState } from "react";
import { initDisplayData, collectChartData } from "./WeatherForecast";
import type { HourlyData, CurrentData } from "./WeatherForecast";
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
} from "chart.js";
import { Chart } from "react-chartjs-2";
import "./ChartView.css";

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

export const ChartView: React.FC<any> = ({ resData }) => {
  const [chartData, setChartData] = useState<{
    dailyData: { [key: string]: HourlyData };
    currentData: CurrentData;
  }>();
  const [displayData, setDisplayData] = useState<HourlyData>(initDisplayData);
  const [dateIdx, setDateIdx] = useState<number>(0);

  const handleClick = (idx: number) => {
    if (chartData) setDisplayData(Object.values(chartData["dailyData"])[idx]);
    setDateIdx(idx);
  };

  useEffect(() => {
    const data: {
      dailyData: { [key: string]: HourlyData };
      currentData: CurrentData;
    } = { ...collectChartData(resData) };
    setChartData(data);
  }, [resData]);

  useEffect(() => {
    if (chartData) {
      setDisplayData(Object.values(chartData["dailyData"])[0]);
      setDateIdx(0);
    }
  }, [chartData]);

  return (
    <>
      <div id="dateSelector" className="flex justify-normal">
        {chartData
          ? Object.keys(chartData["dailyData"]).map((val, idx) => {
              return (
                <button key={idx}>
                  <input
                    className="hidden"
                    type="radio"
                    id={val}
                    name="weather"
                    checked={dateIdx === idx}
                    onChange={() => handleClick(idx)}
                  />
                  <label
                    className="py-3 mx-1 text-lg font-bold text-white px-4 bg-zinc-800 hover:bg-black opacity-70 cursor-pointer"
                    htmlFor={val}
                  >
                    {val}
                  </label>
                </button>
              );
            })
          : ""}
      </div>
      <div
        id="lineChart"
        className="grid grid-cols-12 gap-4 text-white text-lg font-bold"
      >
        <div className="col-span-2">
          <div className="grid grid-rows-3 grid-flow-col gap-4">
            <div>
              <h1 className="text-3xl mx-1">Now</h1>
            </div>
            <div>{chartData ? chartData["currentData"]["time"] : ""}</div>
            <div>
              Temperature:{" "}
              {chartData ? `${chartData["currentData"]["temperature"]}℃` : ""}
            </div>
          </div>
        </div>
        <div className="col-span-10">
          <Chart
            type="bar"
            data={{
              labels: displayData["hourlyTime"],
              datasets: [
                {
                  type: "line" as const,
                  label: `Temperature`,
                  backgroundColor: "#67d574",
                  borderColor: "#67d574",
                  pointBackgroundColor: "#67d574",
                  pointBorderColor: "#67d574",
                  data: displayData["hourlyTemperature"],
                  yAxisID: "y",
                },
                {
                  type: "bar" as const,
                  label: `Precipitation`,
                  backgroundColor: "#648bff",
                  borderColor: "#648bff",
                  data: displayData["hourlyPrecipitationProbability"],
                  yAxisID: "y1",
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                // https://www.chartjs.org/docs/master/configuration/legend.html
                legend: {
                  labels: {
                    color: "#ffffff",
                    font: {
                      size: 15,
                      weight: "bold",
                    },
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: "#ffffff",
                    font: {
                      size: 15,
                      weight: "bold",
                    },
                  },
                },
                y: {
                  position: "left" as const,
                  ticks: {
                    color: "#ffffff",
                    font: {
                      size: 15,
                      weight: "bold",
                    },
                    callback: function (value) {
                      return `${value}℃`;
                    },
                  },
                },
                y1: {
                  position: "right" as const,
                  ticks: {
                    color: "#ffffff",
                    font: {
                      size: 15,
                      weight: "bold",
                    },
                    callback: function (value) {
                      return `${value}mm`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
};
