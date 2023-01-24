// export type EChartsOption = echarts.EChartsOption;
// export type RenderItemParams = echarts.CustomSeriesRenderItemParams;
// export type RenderItemAPI = echarts.CustomSeriesRenderItemAPI;
// export type RenderItemReturn = echarts.CustomSeriesRenderItemReturn;
export type ZoomData = {
  xAxisZoomStart: number;
  xAxisZoomEnd: number;
  yAxisZoomStart: number;
  yAxisZoomEnd: number;
};

export type SeriesT =
  | "all"
  | "not-started"
  | "delayed"
  | "completed"
  | "in-progress";

export type ChartState = {
  data: (string | number)[][];
  subAxisType: "quarter" | "month" | "semester";
  dataZoomCoordinates: ZoomData;
  xAxisMinZoomLimit: number;
  xAxisMaxZoomLimit: number;
  yAxisMinZoomLimit: number;
  yAxisMaxZoomLimit: number;
  dataMin: string;
  dataMax: string;
  chartWidth: number;
};
