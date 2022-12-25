import * as echarts from "echarts";
import moment from "moment";
// console.log(moment("2011-01-01T20:40:33Z").format("YYYY"));

const chartDom = <HTMLElement>document.getElementById("main");
const myChart = echarts.init(chartDom);

type EChartsOption = echarts.EChartsOption;
type RenderItemParams = echarts.CustomSeriesRenderItemParams;
type RenderItemAPI = echarts.CustomSeriesRenderItemAPI;
type RenderItemReturn = echarts.CustomSeriesRenderItemReturn;

const timeData = [
  [0, "2010", "2011", 70],
  [1, "2011", "2012", 20],
  [2, "2010", "2013", 50],
  [3, "2012", "2013", 90],
];

const calculateQuarters = (data: any[]): string[] => {
  let quarters;
  let max = 0;
  let min = +timeData[0][1];

  // find max & min dates
  data.forEach((date) => {
    if (+date[2] > max) {
      max = +date[2];
    }

    if (+date[1] < min) {
      max = +date[1];
    }
  });

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

const renderItem = (
  params: RenderItemParams,
  api: RenderItemAPI
): RenderItemReturn => {
  const index = api.value(0);

  const start = api.coord([api.value(1), index]);
  const end = api.coord([api.value(2), index]);
  const percentage = api.value(3);
  const width = end[0] - start[0];

  // const x = 100;
  const x = start[0];
  const y = start[1] - 10;

  // echarts.time.format()
  const rectShape = echarts.graphic.clipRectByRect(
    {
      // x: 200, // x position is always 100
      x,
      // y: api.coord([0, api.value(0)])[1],
      y,
      width: width,
      height: 10,
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
    type: "rect",
    // textContent: "fwfwfwf",
    // textContent: "f",
    shape: rectShape,
    style: {
      fill: "blue",
      stroke: "red",
    },
  };
};

function xAxisLabelFormatter(value?: any, index?: number) {
  console.log(index, new Date(value));

  const year = moment(value).format("YYYY");
  const q = moment(value).format("Q");
  // if the same year show none
  // next year show year only
  console.log(year, q);
  return "{yyyy}";
}

const option: EChartsOption = {
  title: {
    text: "Weather Statistics",
  },
  // baseOption

  // tooltip: {
  //   trigger: "axis",
  //   axisPointer: {
  //     type: "shadow",
  //   },
  // },
  // legend: {
  //   data: ["City Alpha", "City Beta", "City Gamma"],
  // },
  // grid: {
  //   top: 100,
  //   left: 100,
  // },
  xAxis: [
    {
      type: "time",
      position: "top",
      axisLine: {
        show: false,
      },

      // minorTick: { show: true, length: 1 },
      // axisTick: { show: false },
      // interval: 4,
      // boundaryGap: true,
      axisTick: {
        alignWithLabel: true,
        length: 12,
        // align: "left",
        // interval: function (index, value) {
        //   return value ? true : false;
        // },
      },
      offset: 15,
      axisLabel: {
        formatter: xAxisLabelFormatter,
        // rich: {
        //   yearStyle: {
        //     // Make yearly text more standing out
        //     color: "red",
        //     fontWeight: "bold",
        //   },
        // },
      },
    },
    {
      // type: "time",
      show: true,
      position: "top",
      // min: 0,
      // max: function () {},
      // data: x2Data,
      data: calculateQuarters(timeData),
      // interval: 4,
      axisLabel: {
        // formatter: function (value: any) {
        //   return moment(value).format("Q");
        // },
      },
      splitLine: {
        show: true,
        interval: function (index, value) {
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
    // // type: "category",
    // // inverse: true,
    // // data: ["Sunny", "Cloudy", "Showers"],
  },
  // dataset: [
  //   {
  //     source: timeData,
  //   },
  // ],
  series: [
    {
      // name: "workersData",
      // dimensions: [
      //   // { name: "name", type: "ordinal" },
      //   { name: "start", type: "ordinal" },
      //   { name: "end", type: "ordinal" },
      //   { name: "donePercentage", type: "ordinal" },
      //   { name: "taskId", type: "ordinal" },
      // ],
      type: "custom",
      data: timeData,
      encode: {
        x: [0, 1, 2],
        y: 0, //reference of taskid
        // tooltip: [0, 1, 2],
      },
      xAxisIndex: 0,
      renderItem,
    },
  ],
};

myChart.setOption(option);
