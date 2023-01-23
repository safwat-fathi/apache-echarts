/*
	TODO:	Main tasks
	// - remove repeated years
	// - toggle legend color if clicked
	- colors on hover on bars (maybe add border on bars if hovered)
	- centering images
	- update chart y axis on series toggled from legend 
	- meet UI
		- clip path to images as circle

	TODO: Enhancements
	- line marker on hover for start and end of bars
 */
import "../styles.scss";
import data from "../../data.json";
import * as echarts from "echarts";
import {
  extractNames,
  filterYAxis,
  filterXAxis,
  renderGanttItem,
  subXAxisLabelFormatter,
} from "./helpers";
import { empData } from "../../data";

type EChartsOption = echarts.EChartsOption;

/* DOM elements */

// chart container
const chartDom = <HTMLElement>document.getElementById("chart");
// buttons
const semesterBtn = document.getElementById("semesterly");
const quarterBtn = document.getElementById("quarterly");
const monthBtn = document.getElementById("monthly");
// legends
const inProgressLegend = document.getElementById("in-progress");
const delayedLegend = document.getElementById("delayed");
const completedLegend = document.getElementById("completed");
const notStartedLegend = document.getElementById("not-started");

const chart = echarts.init(chartDom);
export const chartWidth = chart.getWidth();

// observe resize of chart parent
chart &&
  new ResizeObserver(() => {
    chart.resize();
  }).observe(chartDom);

// globals
// const HEIGHT_RATIO = 0.5;
// const FONT_SIZE = 30;
const MIN = "2009";
const MAX = "2023";
// console.log(
//   extractNames([
//     ...data.complete,
//     ...data.delayed,
//     ...data.inProgress,
//     ...data.notStarted,
//   ]).length
// );

// store.setState("min", "2009");
// console.log("store.getState('min')", store.getState());

// const chartData: Record<string, (string | number)[][]> = data;

export let textPositionConstant = 6;
let xAxisZoomStart = 40;
let xAxisZoomEnd = 92.9;
let yAxisZoomStart = 0;
let yAxisZoomEnd = 100;

let subAxisType: "quarter" | "month" | "semester" = "quarter";

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

const option: EChartsOption = {
  animation: true,
  legend: {
    show: false,
    // selected: {
    //   "not-started": false,
    // },
    // emphasis: {
    // 	selectorLabel: true
    // }
  },
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
    top: 80,
    bottom: 40,
  },
  dataZoom: [
    // Y axis scroll with slider
    {
      type: "slider",
      id: "scrollY",
      yAxisIndex: 0,
      width: 10,
      // height: 600,
      right: 10,
      // top: 85,
      bottom: 35,
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
      width: 1000 - 30,
      height: 10,
      right: 30,
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
      // * day = 60 * 60 * 1000 * 24
      // * month = day * 30
      // * quarter = month * 4
      // minInterval: 60 * 60 * 1000 * 24 * 30 * 4,
      // maxInterval: 60 * 60 * 1000 * 24 * 30 * 4,
      // interval: 12,
      // splitNumber: 1,
      axisTick: { show: false },
      offset: 40,
      axisLabel: {
        color: "#fff",
        fontSize: 18,
        showMaxLabel: true,
        formatter: (value: any) => {
          const year = new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
          });

          const month = new Date(value).toLocaleDateString("en-US", {
            month: "numeric",
          });
          const quarter = Math.ceil(+month / 3);
          const semester = Math.ceil(+month / 2);

          if (subAxisType === "quarter") {
            return quarter === 1 ? year : "";
          }

          if (subAxisType === "month") {
            return +month === 1 ? year : "";
          }

          return +semester === 1 ? year : "";
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
        showMaxLabel: true,
        formatter: (value: any) => subXAxisLabelFormatter("quarter", value),
      },
    },
  ],
  yAxis: {
    type: "category",
    // boundaryGap: ["1%", "1%"],
    boundaryGap: true,
    min: -1,
    max: empData.length,
    axisTick: { show: false },
    splitLine: { show: false },
    axisLine: { show: false },
    data: extractNames([
      ...data.complete,
      ...data.delayed,
      ...data.inProgress,
      ...data.notStarted,
    ]),
    axisLabel: {
      show: true,
      fontWeight: "bold",
      // color: "#fff",
      // padding: 2,
      // backgroundColor: "#005371",
      // backgroundColor: {
      //   image:
      //     '"https://pbs.twimg.com/profile_images/1329949157486854150/2vhx3rm9_400x400.jpg"',
      // },
      formatter: (value: any) => `${value}`,
    },
  },
  series: [
    {
      name: "not-started",
      type: "custom",
      // select: false,
      data: filterXAxis("not-started", empData),
      encode: {
        x: [1, 2],
        y: 0, // reference of index
      },
      xAxisIndex: 0,
      renderItem: renderGanttItem,
      clip: true,
    },
    {
      name: "completed",
      type: "custom",
      data: filterXAxis("completed", empData),
      encode: {
        x: [1, 2],
        y: 0, // reference of index
      },
      xAxisIndex: 0,
      renderItem: renderGanttItem,
      clip: true,
    },
    {
      name: "in-progress",
      type: "custom",
      data: filterXAxis("in-progress", empData),
      encode: {
        x: [1, 2],
        y: 0, // reference of index
      },
      xAxisIndex: 0,
      renderItem: renderGanttItem,
      clip: true,
    },
    {
      name: "delayed",
      type: "custom",
      data: filterXAxis("delayed", empData),
      encode: {
        x: [1, 2],
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
window.addEventListener("click", (e: Event) => {
  const target = <Element>e.target;

  // toggle active class
  if (target === semesterBtn || target === monthBtn || target === quarterBtn) {
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

      subAxisType = "semester";

      const dataZoom: any = option.dataZoom;

      xAxis[1].axisLabel.formatter = (val: any) =>
        subXAxisLabelFormatter("semester", val);
      dataZoom[2].minSpan = 25.2;

      chart.setOption({ ...option, xAxis, dataZoom });
    }

    if (e.target === quarterBtn) {
      quarterBtn?.classList.add("active");

      subAxisType = "quarter";

      xAxis[1].axisLabel.formatter = (value: any) =>
        subXAxisLabelFormatter("quarter", value);
      dataZoom[2].minSpan = 12.5;

      chart.setOption({ ...option, xAxis, dataZoom });
    }

    if (e.target === monthBtn) {
      monthBtn?.classList.add("active");

      subAxisType = "month";

      xAxis[1].axisLabel.formatter = (value: any) =>
        subXAxisLabelFormatter("month", value);
      // dataZoom[2].minSpan = 8.15;
      dataZoom[2].minSpan = 7;

      chart.setOption({ ...option, xAxis, dataZoom });
    }
  }

  if (
    target.closest("div#completed") ||
    target.closest("div#not-started") ||
    target.closest("div#delayed") ||
    target.closest("div#in-progress")
  ) {
    const elementId = target.closest("div")?.getAttribute("id");
    const legend = target.closest("div")?.querySelector(".circle");

    if (elementId === "completed") {
      chart.dispatchAction({ type: "legendToggleSelect", name: "complete" });
      legend?.classList.toggle("circle--completed");

      // chart.setOption({
      //   ...option,
      //   yAxis: {
      //     data: [...data.inProgress, ...data.delayed, ...data.notStarted],
      //     min: -1,
      //     max: [...data.inProgress, ...data.delayed, ...data.notStarted].length,
      //   },
      //   // series:
      // });
      // filterYAxis("complete");
    }

    if (elementId === "delayed") {
      chart.dispatchAction({ type: "legendToggleSelect", name: "delayed" });
      legend?.classList.toggle("circle--delayed");
      // filterYAxis("delayed");
    }

    if (elementId === "not-started") {
      chart.dispatchAction({ type: "legendToggleSelect", name: "not-started" });
      legend?.classList.toggle("circle--not-started");
      // filterYAxis("not-started");
    }

    if (elementId === "in-progress") {
      chart.dispatchAction({ type: "legendToggleSelect", name: "in-progress" });
      legend?.classList.toggle("circle--in-progress");
      // filterYAxis("in-progress");
    }
  }
});

// toggle highlight series on legend hover
[inProgressLegend, notStartedLegend, completedLegend, delayedLegend].forEach(
  el => {
    if (el) {
      el.addEventListener("mouseenter", _ => {
        console.log(el.id);
        chart.dispatchAction({ type: "highlight", seriesName: el.id });
      });

      el.addEventListener("mouseleave", _ => {
        chart.dispatchAction({ type: "downplay", seriesName: el.id });
      });
    }
  }
);
