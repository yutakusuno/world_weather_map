import { Point } from '../types/types';

type CoordinatesInfo = {
  latitude: string;
  longitude: string;
  timezone_id: string;
  offset: number;
  country_code: string;
  map_url: string;
};

// It has rate limit
// https://wheretheiss.at/w/developer
const getCoordinatesDetail = async (
  point: Point
): Promise<CoordinatesInfo | undefined> => {
  try {
    const response = await fetch(
      `https://api.wheretheiss.at/v1/coordinates/${point.lat},${point.lng}`
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch coordinates data. status code :${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getTimeZoneWithLatLng = async (
  point: Point
): Promise<string | undefined> => {
  try {
    const data = await getCoordinatesDetail(point);

    return data?.timezone_id || '';
  } catch (error) {
    console.error(error);
  }
};
