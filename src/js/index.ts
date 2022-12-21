import * as echarts from "echarts";
import moment from "moment";
// console.log("moment(2000)", moment("2000-12-06").quarter());
console.log("moment(2002)", moment("2002-01-01").quarter());

const chartDom = <HTMLElement>document.getElementById("main");
const myChart = echarts.init(chartDom);

type EChartsOption = echarts.EChartsOption;
type RenderItemParams = echarts.CustomSeriesRenderItemParams;
type RenderItemAPI = echarts.CustomSeriesRenderItemAPI;
type RenderItemReturn = echarts.CustomSeriesRenderItemReturn;

const data = [
  [0, 0, 2, 70],
  [1, 0, 3, 20],
  [2, 0, 3, 50],
  // [0, 2000, 2001, 70],
  // [1, 2001, 2002, 20],
  // [2, 2000, 2002, 50],
];

const renderItem = (
  params: RenderItemParams,
  api: RenderItemAPI
): RenderItemReturn => {
  console.log("🚀 ~ file: index.ts:16 ~ api", api);
  console.log("🚀 ~ file: index.ts:16 ~ params", params);
  const categoryIndex = api.value(0);
  console.log("🚀 ~ file: index.ts:19 ~ categoryIndex", categoryIndex);
  const start = api.coord([api.value(1), categoryIndex]);
  const end = api.coord([api.value(2), categoryIndex]);
  // const height = api.size([0, 1])[1] * 0.6;
  const height = 5;
  const length = start[0] - end[0];

  const x = start[0];
  const y = start[1] - height;

  const rectShape = echarts.graphic.clipRectByRect(
    {
      x,
      y,
      width: length,
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
      // x: 0,
      // y: 2,
      // width: 20,
      // height: 5,
    }
  );

  return {
    type: "rect",
    shape: rectShape,
    style: { fill: "#green", stroke: "yellow" },
  };
};

// const option: EChartsOption = {
//   legend: {},
//   xAxis: [

//     {
//       type: "category",
//       offset: 10,
//       // name: "Precipitation",
//       // min: 0,
//       // max: 250,
//       data: [
//         {
//           value: "q1",
//           textStyle: {
//             backgroundColor: "red",
//             color: "white",
//             padding: 2,
//           },
//         },
//         {
//           value: "q2",
//           textStyle: {
//             backgroundColor: "red",
//             color: "white",
//             padding: 2,
//           },
//         },
//         {
//           value: "q3",
//           textStyle: {
//             backgroundColor: "red",
//             color: "white",
//             padding: 2,
//           },
//         },
//         {
//           value: "q4",
//           textStyle: {
//             backgroundColor: "red",
//             color: "white",
//             padding: 2,
//           },
//         },
//       ],
//       position: "top",
//       axisLine: { show: false },
//       // axisLabel: {
//       //   formatter: "{value} ml",
//       // },
//     },
//     {
//       type: "category",
//       offset: 30,
//       // name: "Temperature",
//       data: [
//         { value: 2010 },
//         { value: 2011 },
//         { value: 2012 },
//         { value: 2013 },
//       ],
//       axisLine: { show: false },
//       // min: 0,
//       // max: 25,
//       position: "top",
//       // axisLabel: {
//       //   formatter: "{value} °C",
//       // },
//     },
//   ],
//   yAxis: {
//     show: false,
//   },
//   series: [

//     {
//       // name: "Temperature",
//       type: "custom",
//       encode: {
//         x: [1, 2],
//         y: 0,
//       },
//       // smooth: true,
//       // xAxisIndex: 1,
//       data: [
//         {
//           name: "dwdwdwd",
//           value: 2011.2,
//         },
//         {
//           name: "dwdwdwd",
//           value: 2013.2,
//         },
//         {
//           name: "dwdwdwd",
//           value: 2010.2,
//         },
//         {
//           name: "dwdwdwd",
//           value: 2014.2,
//         },
//       ],
//     },
//   ],
// };

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
      position: "top",
      data: [1, 2, 3],
      // data: ["2000-01-01", "2001-01-01", "2002-01-01"],

      // type: "time",
      // interval: 1,
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
      // axisLabel: {
      //   margin: 30,
      // },
      // splitLine: {
      //   show: true,
      //   interval: function (index, value) {
      //     return value ? true : false;
      //   },
      // },
    },
    {
      position: "top",
      data: [
        "0.25",
        "0.5",
        "0.75",
        "1",
        "0.25",
        "0.5",
        "0.75",
        "1",
        "0.25",
        "0.5",
        "0.75",
        "1",
      ],
      // interval: 4,
      splitLine: {
        show: true,
        interval: function (index, value) {
          return value == "0.25" ? true : false;
        },
      },
      offset: 1,
    },
  ],
  // xAxis: [
  //   {
  //     type: "time",
  //     position: "top",
  //     offset: 1,
  //     splitLine: {
  //       lineStyle: {
  //         color: ["#E9EDFF"],
  //       },
  //     },
  //     axisLine: {
  //       show: false,
  //     },
  //     axisTick: {
  //       lineStyle: {
  //         color: "#929ABA",
  //       },
  //     },
  //     axisLabel: {
  //       color: "#929ABA",
  //       inside: false,
  //       align: "center",
  //       // formatter: function (value: number) {
  //       //   // return moment(value).format("HH:mm");
  //       //   return `wawdawd`;
  //       // },
  //     },
  //   },
  //   {
  //     type: "time",
  //     position: "top",
  //     offset: 5,
  //     // splitLine: {
  //     //   lineStyle: {
  //     //     color: ["#E9EDFF"],
  //     //   },
  //     // },
  //     axisLine: {
  //       show: false,
  //     },
  //     // axisTick: {
  //     //   lineStyle: {
  //     //     color: "#929ABA",
  //     //   },
  //     // },
  //     axisLabel: {
  //       color: "#929ABA",
  //       inside: false,
  //       align: "center",
  //       formatter: function (value: number) {
  //         return moment(value).format("HH:mm");
  //       },
  //     },
  //   },
  // ],
  yAxis: {
    axisTick: { show: false },
    splitLine: { show: false },
    axisLine: { show: false },
    axisLabel: { show: false },
    min: 0,
    max: data.length,

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
      data: data,
      encode: {
        x: [0, 1, 2],
        y: 3, //reference of taskid
        // tooltip: [0, 1, 2],
      },
      xAxisIndex: 0,
      renderItem: function (params, api) {
        const index = api.value(0);
        console.log("🚀 ~ file: index.ts:346 ~ index", index);

        const start = api.coord([api.value(1), index]);
        // console.log("🚀 ~ file: index.ts:349 ~ start", start);
        const end = api.coord([api.value(2), index]);
        // console.log("🚀 ~ file: index.ts:351 ~ end", end);
        const percentage = api.value(3);
        const width = end[0] - start[0];

        // console.log("🚀 ~ file: index.ts:338 ~ start", start);
        // console.log("🚀 ~ file: index.ts:340 ~ end", end);
        // console.log("🚀 ~ file: index.ts:344 ~ percentage", percentage);
        // console.log(params.coordSys);

        // const x = 100;
        const x = start[0];
        const y = start[1] - 10;
        console.log("🚀 ~ file: index.ts:363 ~ y", y);
        // const y = 100 * +index;

        // console.log(start[0], start[1]);
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
        // console.log("🚀 ~ file: index.ts:378 ~ rectShape", rectShape);

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
      },
      label: seriesLabel,
    },
  ],
};

myChart.setOption(option);
