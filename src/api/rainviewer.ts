import { RainViewerDataType } from '../types/rainviewer';

// https://www.rainviewer.com/api/weather-maps-api.html
export const getRainRadarData = async (): Promise<
  RainViewerDataType | undefined
> => {
  try {
    const response = await fetch(
      'https://api.rainviewer.com/public/weather-maps.json'
    );
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
