/*  
	TODO: ✔ add custom image on every bar with text.
	TODO: ✔ hover over grid highlights bar on graph.
	TODO: 	rich axis label. (weather statistics ex.)
	TODO: ✔	add bar label on start of the bar.
	TODO: ✔ show current date as marker line.
	TODO: 	switch to change grid from (monthly-yearly-weekly).
	TODO: ✔ scroll grid vertically.
	TODO: ✔ scroll grid horizontally.
 */

import * as echarts from "echarts";
import moment from "moment";

type EChartsOption = echarts.EChartsOption;
type RenderItemParams = echarts.CustomSeriesRenderItemParams;
type RenderItemAPI = echarts.CustomSeriesRenderItemAPI;
type RenderItemReturn = echarts.CustomSeriesRenderItemReturn;

// grab btn elements
const yearBtn = document.getElementById("yearly");
const monthBtn = document.getElementById("monthly");
const weekBtn = document.getElementById("weekly");
const chartDom = <HTMLElement>document.getElementById("main");

const myChart = echarts.init(chartDom);

// globals
const HEIGHT_RATIO = 0.5;
const FONT_SIZE = 50;
const MIN = "2010";
const MAX = "2022";

let xAxisZoomStart = 0;
let xAxisZoomEnd = 50;
let yAxisZoomStart = 0;
let yAxisZoomEnd = 12;

// * listen to data zoom
myChart.on("dataZoom", (e: any) => {
  if (e.dataZoomId === "scrollY") {
    yAxisZoomStart = e.start;
    yAxisZoomEnd = e.end;
  }

  if (e.dataZoomId === "scrollX") {
    xAxisZoomStart = e.start;
    xAxisZoomEnd = e.end;
  }

  console.log("y axis zoom:", yAxisZoomEnd - yAxisZoomStart);
});

const timeData = [
  [0, "2017-04-1", "2020-06-07", 100, "Ali"],
  [1, "2011-02-1", "2013-09-19", 20, "Omar"],
  [2, "2017-05-1", "2017-12-01", 50, "Mostafa"],
  [3, "2011-11-1", "2019-05-1", 90, "Khaled"],
  [4, "2019-11-1", "2022-01-1", 60, "Karam"],
  [5, "2011-11-1", "2013-01-1", 80, "Safwat"],
  [6, "2015-01-1", "2019-11-1", 80, "Anas"],
  [7, "2013-01-1", "2014-11-1", 40, "Kareem"],
  [8, "2010-11-1", "2013-01-1", 90, "Lamyaa"],
  [9, "2010-02-1", "2013-01-1", 100, "Sara"],
  [10, "2010-05-1", "2013-08-1", 60, "Ola"],
  [11, "2010-12-1", "2013-12-1", 30, "Tarek"],
  [14, "2016-11-1", "2022-02-1", 0, "Mahmoud"],
];

const calculateQuarters = (min: number, max: number): string[] => {
  let quarters;

  const quartersCount = (max - min) * 4;
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

const renderGanttItem = (
  params: RenderItemParams,
  api: RenderItemAPI
): RenderItemReturn => {
  const index = api.value(0);
  const start = api.coord([api.value(1), index]);
  const end = api.coord([api.value(2), index]);
  const percentage = api.value(3);
  const employeeName = api.value(4);
  const width = end[0] - start[0];

  // @ts-ignore
  const height = api.size([0, 1])[1] * HEIGHT_RATIO;
  const x = start[0];
  const y = start[1] - height;

  const imagePosition = x + width + 20;
  const textPosition = y + height / 2 - 5;

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
        shape: { ...rectShape, r: 6 },
        style: {
          fill: "#ccc",
          stroke: "transparent",
        },
      },
      {
        type: "rect",
        ignore: !rectPercent,
        shape: { ...rectPercent, r: 6 },
        style: {
          fill: "green",
          stroke: "transparent",
        },
      },
      {
        type: "text",
        style: {
          // @ts-ignore
          text: `Milestone 0${index + 1}`,
          fill: "#fff",
          x: x + 20,
          y: textPosition,
          width,
          // fontSize: FONT_SIZE * 0.6,
          fontSize: FONT_SIZE * ((yAxisZoomEnd - yAxisZoomStart) / 50),
        },
      },
      {
        type: "image",
        // clipPath: [1,1,1,],
        style: {
          image:
            "https://pbs.twimg.com/profile_images/1329949157486854150/2vhx3rm9_400x400.jpg",
          x: imagePosition,
          y,
          width: height * 0.9,
          height: height * 0.9,
        },
      },
      {
        type: "text",
        style: {
          text: String(employeeName),
          x: imagePosition + height + 10,
          y: textPosition,
          fontSize: 14,
        },
      },
    ],
  };
};

const xAxisLabelFormatter = (value: any) => {
  const year = moment(value).format("YYYY");
  const q = moment(value).format("Q");

  return +q === 1 ? year : "";
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
    formatter: function (params: any) {
      const data = params[0].data;

      return `<b>Milestone</b>: ${data[0] + 1}<br /><b>From period</b>: ${
        data[1]
      } <b>to</b> ${data[2]}<br /><b>Done percentage</b>: ${
        data[3]
      }<br /><b>For employee</b>: ${data[4]}`;
    },
  },
  grid: {
    top: 100,
  },
  dataZoom: [
    // Y axis scroll with slider
    {
      type: "slider",
      id: "scrollY",
      yAxisIndex: 0,
      width: 10,
      right: 10,
      top: 100,
      bottom: 80,
      handleSize: "300%",
      start: yAxisZoomStart,
      end: yAxisZoomEnd,
      showDetail: false,
    },
    // Y axis scroll inside grid
    {
      type: "inside",
      id: "insideY",
      yAxisIndex: 0,
      start: yAxisZoomStart,
      end: yAxisZoomEnd,
      zoomOnMouseWheel: false,
      moveOnMouseMove: true,
      moveOnMouseWheel: true,
    },
    // X axis scroll & zoom with slider
    {
      type: "slider",
      id: "scrollX",
      xAxisIndex: [0, 1],
      height: 10,
      bottom: 40,
      handleSize: "300%",
      start: xAxisZoomStart,
      end: xAxisZoomEnd,
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
        color: "#fff",
        fontWeight: "bold",
        backgroundColor: "blue",
        borderRadius: 5,
        height: 10,
        padding: 10,
        showMinLabel: true,
        showMaxLabel: true,
        formatter: xAxisLabelFormatter,
      },
    },
    {
      show: true,
      position: "top",
      data: calculateQuarters(+MIN, +MAX),
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
    // marker for current date
    {
      type: "line",
      xAxisIndex: 0,
      markLine: {
        data: [{ name: "current date", xAxis: "2011-01-01" }],
        label: {
          show: false,
        },
        symbol: "rect",
        symbolRotate: 90,
        lineStyle: {
          color: "blue",
        },
      },
    },
  ],
};

myChart.setOption(option);

// listen to buttons events
window.addEventListener("click", (e: MouseEvent) => {
  if (e.target === yearBtn) {
    const xAxis: any = option.xAxis;

    xAxis[0].axisLabel.formatter = xAxisLabelFormatter;
    xAxis[1].show = true;

    myChart.setOption({ ...option, xAxis });
  }

  if (e.target === monthBtn) {
    const xAxis: any = option.xAxis;

    xAxis[0].axisLabel.formatter = (val: any) => {
      const month = moment(val).format("MMM-YY");
      return month;
    };

    xAxis[1].show = false;

    myChart.setOption({ ...option, xAxis });
  }

  if (e.target === weekBtn) {
    const xAxis: any = option.xAxis;

    xAxis[0].axisLabel.formatter = (val: any) => {
      const week = moment(val).format("WW");
      return week;
    };

    xAxis[1].show = false;

    myChart.setOption({ ...option, xAxis });
  }
});
