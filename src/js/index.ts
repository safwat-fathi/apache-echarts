import * as echarts from "echarts";
import moment from "moment";

const chartDom = <HTMLElement>document.getElementById("main");
const myChart = echarts.init(chartDom);

type EChartsOption = echarts.EChartsOption;
type RenderItemParams = echarts.CustomSeriesRenderItemParams;
type RenderItemAPI = echarts.CustomSeriesRenderItemAPI;
type RenderItemReturn = echarts.CustomSeriesRenderItemReturn;

const timeData = [
  [0, "2010-05-01T20:40:33Z", "2011-05-01T20:40:33Z", 70],
  [1, "2011-07-01T20:40:33Z", "2012-05-01T20:40:33Z", 20],
  [2, "2010-02-01T20:40:33Z", "2013-05-01T20:40:33Z", 50],
  [3, "2012-10-01T20:40:33Z", "2013-05-01T20:40:33Z", 90],
  // [0, 0, 3, 70],
  // [1, 1, 2, 20],
  // [2, 1, 3, 50],
  // [3, 0, 2, 50],
  // [4, 0, 1, 50],
];

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

const seriesLabel = {
  show: true,
} as const;

const option: EChartsOption = {
  title: {
    text: "Weather Statistics",
  },
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
      // data: [1, 2, 3],
      data: [
        "2010-01-01T20:40:33Z",
        "2011-01-01T20:40:33Z",
        "2012-01-01T20:40:33Z",
      ],

      // type: "time",
      interval: 1,
      axisLine: {
        show: false,
      },
      // axisLabel: {
      //   formatter: function (value: any) {
      //     return moment(value).format("YYYY");
      //   },
      //   // interval: 1,
      // },
      axisTick: {
        alignWithLabel: false,
        length: 10,
        // align: "left",
        // interval: function (index, value) {
        //   return value ? true : false;
        // },
      },
      offset: 25,
      axisLabel: {
        // margin: 30,
        formatter: function (value: any) {
          return moment(value).format("YYYY");
        },
      },
      // splitLine: {
      //   show: true,
      //   interval: function (index, value) {
      //     return value ? true : false;
      //   },
      // },
    },
    {
      position: "top",
      data: [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4],
      interval: 4,
      axisLabel: {
        // margin: 30,
        formatter: function (value: any) {
          return moment(value).format("Q");
        },
      },
      splitLine: {
        show: true,
        interval: function (index, value) {
          return value === "1" ? true : false;
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

    // type: "category",

    // inverse: true,
    // data: ["Sunny", "Cloudy", "Showers"],
  },
  series: [
    {
      name: "workersData",
      type: "custom",
      dimensions: [
        // { name: "name", type: "ordinal" },
        { name: "start", type: "number" },
        { name: "end", type: "number" },
        { name: "donePercentage", type: "number" },
        { name: "taskId", type: "number" },
      ],
      data: timeData,
      encode: {
        x: [0, 1, 2],
        y: 0, //reference of taskid
        // tooltip: [0, 1, 2],
      },
      xAxisIndex: 0,
      renderItem,
      label: seriesLabel,
    },
  ],
};

myChart.setOption(option);
