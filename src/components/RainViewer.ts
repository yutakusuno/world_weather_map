import axios from "axios";

export const rainRadarData = async () => {
  let data: any = {};
  const url: string = "https://api.rainviewer.com/public/weather-maps.json";

  try {
    const response = await axios.get(url);
    data = response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("AxiosError", error);
    } else {
      console.error("UnexpectedError", error);
    }
  } finally {
    return data;
  }
};
