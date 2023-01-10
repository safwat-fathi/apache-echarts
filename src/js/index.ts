/*
	TODO:	✔ maintain the year header
	TODO:	✔ avoid clipping the off canvas
	TODO:	avoid squeezing bars horizontally
	TODO:	meet UI
		- clip path to images as circle
		- custom legends

	TODO:	Data Zoom Margins
	TODO:	Trimming overlapping text
	TODO:	Centering titles inside the bars
	TODO:	spacing between bar + avatars
	TODO:	periods/bars
	TODO:	✔ provide min/max zoom level
	TODO:	remove the year button ( semesterly/quarterly/monthly)
 */

import * as echarts from "echarts";
import moment from "moment";

type EChartsOption = echarts.EChartsOption;
type RenderItemParams = echarts.CustomSeriesRenderItemParams;
type RenderItemAPI = echarts.CustomSeriesRenderItemAPI;
type RenderItemReturn = echarts.CustomSeriesRenderItemReturn;

// grab btn elements
const semesterBtn = document.getElementById("semesterly");
const quarterBtn = document.getElementById("quarterly");
const monthBtn = document.getElementById("monthly");
const chartDom = <HTMLElement>document.getElementById("chart");

const chart = echarts.init(chartDom);

// observe resize of chart parent
new ResizeObserver(() => {
  if (chart) {
    chart.resize();
  }
}).observe(chartDom);

// globals
const HEIGHT_RATIO = 0.5;
const FONT_SIZE = 30;
const MIN = "2010";
const MAX = "2022";
const COLORS = {
  completed: "#98e464",
  inProgress: "#47c0f4",
  delayed: "#fba606",
  notStarted: "#9193fc",
};

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
  [9, "2010-02-1", "2013-01-1", 100, "Amira"],
  [10, "2010-05-1", "2013-08-1", 60, "Ola"],
  [11, "2010-12-1", "2013-12-1", 30, "Tarek"],
  [12, "2016-10-23", "2018-04-17", 30, "Karam"],
  [13, "2016-11-1", "2022-01-1", 0, "Mahmoud"],
  [14, "2017-01-13", "2019-10-02", 60, "Amir"],
];

let xAxisZoomStart = 60;
let xAxisZoomEnd = 100;
let yAxisZoomStart = 0;
let yAxisZoomEnd = 100;
// let textPositionConstant = 10;
let textPositionConstant = 6;

// * listen to data zoom
// chart.on("dataZoom", function (e: any) {
// console.log("event: ", e);
//   return false;
// });
chart.on("dataZoom", (e: any) => {
  if (e.dataZoomId === "scrollY") {
    yAxisZoomStart = e.start;
    yAxisZoomEnd = e.end;
  }

  if (e.dataZoomId === "scrollX") {
    xAxisZoomStart = e.start;
    xAxisZoomEnd = e.end;
  }

  if (yAxisZoomEnd - yAxisZoomStart <= 30) {
    textPositionConstant = 9;
  }

  if (
    yAxisZoomEnd - yAxisZoomStart > 30 ||
    yAxisZoomEnd - yAxisZoomStart <= 50
  ) {
    textPositionConstant = 8;
  }

  if (yAxisZoomEnd - yAxisZoomStart > 60) {
    textPositionConstant = 6;
  }
});

const fillColor = (percent: number) => {
  return percent === 0
    ? COLORS.notStarted
    : percent < 30
    ? COLORS.delayed
    : percent === 100
    ? COLORS.completed
    : COLORS.inProgress;
};

const renderGanttItem = (
  params: RenderItemParams,
  api: RenderItemAPI
): RenderItemReturn => {
  const index = api.value(0);
  const start = api.coord([api.value(1), index]); // api.coord([x, y])
  const end = api.coord([api.value(2), index]); // api.coord([x, y])
  const percentage = api.value(3);
  const employeeName = api.value(4);
  const width = end[0] - start[0];

  // console.log("api.size([0, 1]):", <number>(api.size && api.size([0, 1])));
  // console.log(
  //   "api.size([1.5, index]):",
  //   <number>(api.size && api.size([1.5, index]))
  // );
  // console.log(
  //   "api.size([2, index]):",
  //   <number>(api.size && api.size([2, index]))
  // );
  // console.log(
  //   "api.size([3, index]):",
  //   <number>(api.size && api.size([3, index]))
  // );

  // @ts-ignore
  const height = <number>(api.size([0, 1])[1] * HEIGHT_RATIO);
  const x = start[0];
  const y = start[1] - height / 2;

  const imagePosition = x + width + 20;
  const textPosition = y + height / 2 - textPositionConstant;

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
          fill: "#eeedf0",
          stroke: "transparent",
        },
      },
      {
        type: "rect",
        ignore: !rectPercent,
        shape: { ...rectPercent, r: 6 },
        style: {
          fill: String(fillColor(+percentage)),
          stroke: "transparent",
        },
      },
      {
        type: "text",
        style: {
          // @ts-ignore
          text: width <= 160 ? "Mile..." : `Milestone 0${index + 1}`,
          fill: "#000",
          x: x + 20,
          y: textPosition,
          width,
          fontWeight: "bold",
          fontSize:
            yAxisZoomEnd - yAxisZoomStart <= 51
              ? FONT_SIZE - FONT_SIZE * ((yAxisZoomEnd - yAxisZoomStart) / 100)
              : 13,
        },
      },
      {
        type: "text",
        style: {
          // @ts-ignore
          text: width > 100 ? `${percentage}%` : "",
          fill: "#000",
          x: percentage === 100 ? x + width - 60 : x + width - 50,
          y: textPosition,
          width,
          fontWeight: "bold",
          fontSize:
            yAxisZoomEnd - yAxisZoomStart <= 51
              ? FONT_SIZE - FONT_SIZE * ((yAxisZoomEnd - yAxisZoomStart) / 100)
              : 13,
        },
      },
      {
        type: "image",
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
          fontSize:
            yAxisZoomEnd - yAxisZoomStart <= 51
              ? FONT_SIZE - FONT_SIZE * ((yAxisZoomEnd - yAxisZoomStart) / 100)
              : 13,
        },
      },
    ],
  };
};

const subXAxisLabelFormatter = (type: "Q" | "MMM" | "SEM", value?: any) => {
  const format = moment(value).format(type);

  if (type === "Q") return `Q${format}`;

  if (type === "SEM") {
    const quarter = moment(value).format("Q");

    return +quarter < 3 ? "H1" : "H2";
  }

  return format;
};

const option: EChartsOption = {
  // @ts-ignore
  tooltip: {
    trigger: "axis",
    axisPointer: {
      axis: "y",
      type: "shadow",
      shadowStyle: {
        color: "#2b64bb7c",
        opacity: "0.3",
      },
    },
    position: (point: number[]) => [point[0], point[1] + 20],
    formatter: function (params: any) {
      const data = params[0].data;

      return `<b>Milestone</b>: ${data[0] + 1}<br /><b>From period</b>: ${
        data[1]
      } <b>to</b> ${data[2]}<br /><b>Done percentage</b>: ${
        data[3]
      }%<br /><b>For employee</b>: ${data[4]}`;
    },
  },
  grid: {
    top: 100,
    right: 40,
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
      bottom: 20,
      handleSize: "300%",
      start: yAxisZoomStart,
      end: yAxisZoomEnd,
      showDetail: false,
      minSpan: 35,
      maxSpan: 80,
      filterMode: "none",
    },
    // Y axis scroll inside grid
    {
      type: "inside",
      id: "insideY",
      yAxisIndex: 0,
      top: 100,
      // bottom: 0,
      start: yAxisZoomStart,
      end: yAxisZoomEnd,
      zoomOnMouseWheel: false,
      moveOnMouseMove: true,
      moveOnMouseWheel: true,
      filterMode: "none",
    },
    // X axis scroll & zoom with slider
    {
      type: "slider",
      id: "scrollX",
      xAxisIndex: [0, 1],
      height: 10,
      bottom: 20,
      handleSize: "300%",
      start: xAxisZoomStart,
      end: xAxisZoomEnd,
      showDetail: false,
      minSpan: 12.5,
      maxSpan: 60,
      filterMode: "none",
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
      axisTick: { show: false },
      offset: 40,
      axisLabel: {
        color: "#fff",
        fontSize: 18,
        showMinLabel: true,
        showMaxLabel: true,
        formatter: (value: any) => {
          const year = moment(value).format("YYYY");
          const q = moment(value).format("Q");

          return +q === 1 ? year : "";
        },
      },
    },
    {
      type: "time",
      show: true,
      min: MIN,
      max: MAX,
      axisLine: { show: false },
      axisTick: {
        show: false,
      },
      position: "top",
      splitLine: {
        show: true,
        interval: function (_, value: string) {
          return value === "Q1" || value === "H1" ? true : false;
        },
      },
      offset: 0,
      axisLabel: {
        fontSize: 11,
        color: "#a7a7a7",
        formatter: (value: any) => subXAxisLabelFormatter("Q", value),
      },
    },
  ],
  yAxis: {
    axisTick: { show: false },
    splitLine: { show: false },
    axisLine: { show: false },
    axisLabel: { show: false },
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
      clip: true,
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
          color: "#005371",
        },
      },
    },
  ],
};

chart.setOption(option);

// listen to buttons events
window.addEventListener("click", (e: MouseEvent) => {
  if (
    e.target !== semesterBtn &&
    e.target !== monthBtn &&
    e.target !== quarterBtn
  ) {
    return;
  }

  // toggle active class
  document.querySelector(".active")?.classList.remove("active");

  const xAxis: any = option.xAxis;
  const dataZoom: any = option.dataZoom;

  // keep data zoom values across changes
  dataZoom[0].start = yAxisZoomStart;
  dataZoom[0].end = yAxisZoomEnd;
  dataZoom[1].start = yAxisZoomStart;
  dataZoom[1].end = yAxisZoomEnd;
  dataZoom[2].start = xAxisZoomStart;
  dataZoom[2].end = xAxisZoomEnd;

  if (e.target === semesterBtn) {
    semesterBtn?.classList.add("active");

    const dataZoom: any = option.dataZoom;

    xAxis[1].axisLabel.formatter = (val: any) =>
      subXAxisLabelFormatter("SEM", val);
    dataZoom[2].minSpan = 25.2;

    chart.setOption({ ...option, xAxis, dataZoom });
  }

  if (e.target === quarterBtn) {
    quarterBtn?.classList.add("active");

    xAxis[1].axisLabel.formatter = (value: any) =>
      subXAxisLabelFormatter("Q", value);
    dataZoom[2].minSpan = 12.5;

    chart.setOption({ ...option, xAxis, dataZoom });
  }

  if (e.target === monthBtn) {
    monthBtn?.classList.add("active");

    xAxis[1].axisLabel.formatter = (value: any) =>
      subXAxisLabelFormatter("MMM", value);
    dataZoom[2].minSpan = 8.15;

    chart.setOption({ ...option, xAxis, dataZoom });
  }
});
