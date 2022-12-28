/*  
	TODO: 	add custom image on every bar with text. (weather statistics ex.)
	TODO: ✔ hover over grid highlights bar on graph.
	TODO: 	rich axis label. (weather statistics ex.)
	TODO: 	add bar label on start of the bar.
	TODO: ✔ show current date as vertical line.
	TODO: 	switch to change grid from (monthly- yearly weekly).
	TODO: ✔ scroll grid vertically
	TODO: ✔ scroll grid horizontally
 */

import * as echarts from "echarts";
import moment from "moment";

const chartDom = <HTMLElement>document.getElementById("main");
const myChart = echarts.init(chartDom);

type EChartsOption = echarts.EChartsOption;
type RenderItemParams = echarts.CustomSeriesRenderItemParams;
type RenderItemAPI = echarts.CustomSeriesRenderItemAPI;
type RenderItemReturn = echarts.CustomSeriesRenderItemReturn;

const HEIGHT_RATIO = 0.5;
const MIN = "2010";
const MAX = "2022";

const timeData = [
  [0, "2017-04-1", "2020-06-07", 100],
  [1, "2011-02-1", "2013-09-19", 20],
  [2, "2017-05-1", "2017-12-01", 50],
  [3, "2011-11-1", "2019-05-1", 90],
  [4, "2019-11-1", "2022-01-1", 60],
  [5, "2011-11-1", "2013-01-1", 80],
  [6, "2015-01-1", "2019-11-1", 80],
  [7, "2013-01-1", "2014-11-1", 40],
  [8, "2010-11-1", "2013-01-1", 90],
  [9, "2010-02-1", "2013-01-1", 100],
  [10, "2010-05-1", "2013-08-1", 60],
  [11, "2010-12-1", "2013-12-1", 30],
  [12, "2011-09-1", "2018-02-1", 70],
  [13, "2019-02-1", "2020-08-1", 10],
  [14, "2016-11-1", "2022-02-1", 0],
];

const calculateQuarters = (data: any[]): string[] => {
  let quarters;

  const quartersCount = (+MAX - +MIN) * 4;
  quarters = new Array(quartersCount);

  let i = 0;
  while (i <= quartersCount - 4) {
    if (i % 4 === 0) {
      quarters[i] = "q1";
      quarters[i + 1] = "q2";
      quarters[i + 2] = "q3";
      quarters[i + 3] = "q4";
    }

    i++;
  }
  return quarters;
};

const renderCurrentDate = (
  params: RenderItemParams,
  api: RenderItemAPI
): RenderItemReturn => {
  const start = api.coord([api.value(0), api.value(1)]);
  console.log("🚀 ~ file: index.ts:67 ~ start", start);
  const end = api.coord([api.value(1), api.value(2)]);
  console.log("🚀 ~ file: index.ts:69 ~ end", end);

  const x1 = start[0];
  const y1 = start[1];
  const x2 = end[0];
  const y2 = end[1];

  const line = {
    type: "line",
    shape: { x1, y1, x2, y2 },
    style: {
      stroke: "blue",
      lineWidth: 4,
      lineDash: [2], // put dash, gap values here
    },
  };

  return {
    type: "group",
    // @ts-ignore
    children: [line],
  };
};

const renderGanttItem = (
  params: RenderItemParams,
  api: RenderItemAPI
): RenderItemReturn => {
  const index = api.value(0);

  const start = api.coord([api.value(1), index]);
  const end = api.coord([api.value(2), index]);
  const percentage = api.value(3);
  const width = end[0] - start[0];

  // @ts-ignore
  const height = api.size([0, 1])[1] * HEIGHT_RATIO;
  const x = start[0];
  const y = start[1] - height;

  const rectShape = echarts.graphic.clipRectByRect(
    {
      x,
      y,
      width,
      height,
    },
    {
      // @ts-ignore
      x: params.coordSys.x,
      // @ts-ignore
      y: params.coordSys.y,
      // @ts-ignore
      width: params.coordSys.width,
      // @ts-ignore
      height: params.coordSys.height,
    }
  );

  const rectText = echarts.graphic.clipRectByRect(
    {
      x,
      y,
      width,
      height,
    },
    {
      // @ts-ignore
      x: params.coordSys.x,
      // @ts-ignore
      y: params.coordSys.y,
      // @ts-ignore
      width: params.coordSys.width,
      // @ts-ignore
      height: params.coordSys.height,
    }
  );

  const rectPercent = echarts.graphic.clipRectByRect(
    {
      x,
      y,
      width: (width * +percentage) / 100,
      height,
    },
    {
      // @ts-ignore
      x: params.coordSys.x,
      // @ts-ignore
      y: params.coordSys.y,
      // @ts-ignore
      width: params.coordSys.width,
      // @ts-ignore
      height: params.coordSys.height,
    }
  );

  return {
    type: "group",
    children: [
      {
        type: "rect",
        ignore: !rectShape,
        shape: rectShape,
        style: {
          fill: "#ccc",
          stroke: "black",
        },
      },
      {
        type: "rect",
        ignore: !rectText,
        shape: rectText,
        style: {
          fill: "transparent",
          // @ts-ignore
          text: `Milestone 0${index + 1}`,
        },
      },
      {
        type: "rect",
        ignore: !rectPercent,
        shape: rectPercent,
        style: {
          fill: "green",
          stroke: "transparent",
        },
      },
    ],
  };
};

const xAxisLabelFormatter = (value: any) => {
  const q = moment(value).format("Q");

  return +q === 1 ? "{yyyy}" : "";
};

const option: EChartsOption = {
  // @ts-ignore
  tooltip: {
    trigger: "axis",
    axisPointer: {
      axis: "y",
      type: "shadow",
    },
    position: (point: number[]) => [point[0], point[1] + 20],
  },
  grid: {
    top: 100,
  },
  dataZoom: [
    // Y axis scroll with slider
    {
      type: "slider",
      yAxisIndex: 0,
      width: 10,
      right: 10,
      top: 100,
      bottom: 80,
      start: 0,
      end: 30,
      handleSize: 0,
      showDetail: false,
    },
    // Y axis scroll inside grid
    {
      type: "inside",
      id: "insideY",
      yAxisIndex: 0,
      start: 0,
      end: 30,
      zoomOnMouseWheel: false,
      moveOnMouseMove: true,
      moveOnMouseWheel: true,
    },
    // X axis scroll & zoom with slider
    {
      type: "slider",
      xAxisIndex: [0, 1],
      height: 20,
      bottom: 40,
      start: 0,
      end: 30,
      showDetail: false,
    },
  ],
  xAxis: [
    {
      type: "time",
      position: "top",
      min: MIN,
      max: MAX,
      axisLine: {
        show: false,
      },
      offset: 25,
      axisLabel: {
        align: "center",
        color: "#fff",
        fontWeight: "bold",
        backgroundColor: "blue",
        borderRadius: 5,
        height: 10,
        width: 25,
        padding: 10,
        showMinLabel: true,
        showMaxLabel: true,
        formatter: xAxisLabelFormatter,
      },
    },
    {
      show: true,
      position: "top",
      data: calculateQuarters(timeData),
      splitLine: {
        show: true,
        interval: function (_, value) {
          return value === "q1" ? true : false;
        },
      },
      offset: 1,
    },
  ],
  yAxis: {
    axisTick: { show: false },
    splitLine: { show: false },
    axisLine: { show: false },
    axisLabel: { show: false },
    min: 0,
    max: timeData.length,
  },
  series: [
    {
      name: "employees-data",
      type: "custom",
      data: timeData,
      encode: {
        x: [0, 1, 2],
        y: 0, // reference of index
      },
      xAxisIndex: 0,
      renderItem: renderGanttItem,
    },
    // marker of current date
    {
      type: "line",
      xAxisIndex: 0,
      markLine: {
        data: [{ name: "current date", xAxis: "2011-01-01" }],
        label: {
          show: false,
        },
        symbol: "none",
        lineStyle: {
          color: "blue",
        },
      },
    },
  ],
};

myChart.setOption(option);
