import * as echarts from "echarts";
import moment from "moment";

const chartDom = <HTMLElement>document.getElementById("main");
const myChart = echarts.init(chartDom);

type EChartsOption = echarts.EChartsOption;
type RenderItemParams = echarts.CustomSeriesRenderItemParams;
type RenderItemAPI = echarts.CustomSeriesRenderItemAPI;
type RenderItemReturn = echarts.CustomSeriesRenderItemReturn;

const renderItem = (
  params: RenderItemParams,
  api: RenderItemAPI
): RenderItemReturn => {
  console.log("🚀 ~ file: index.ts:16 ~ api", api);
  console.log("🚀 ~ file: index.ts:16 ~ params", params);
  const categoryIndex = api.value(0);
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
  grid: {
    top: 100,
    left: 100,
  },
  xAxis: [
    {
      name: "year",
      position: "top",
      // data: ["group1", "", "", "group2", "", ""],
      data: [2000, 2001],

      interval: 4,
      axisLine: {
        show: false,
      },
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
      name: "quarters",
      position: "top",
      // data: ["shirt", "cardign", "chiffon shirt", "pants", "heels", "socks"],
      // data: [2000, 2001, 2003, 2004, 2005, 2006],
      data: ["q1", "q2", "q3", "q4", "q1", "q2", "q3", "q4"],
      interval: 1,
      splitLine: {
        show: true,
        interval: function (index, value) {
          return value == "q1" ? true : false;
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
    max: 4,

    // type: "category",

    // inverse: true,
    // data: ["Sunny", "Cloudy", "Showers"],
  },
  series: [
    {
      name: "Ali",
      type: "custom",
      data: [2000],
      renderItem,
      encode: {
        x: 0,
        y: 1,
      },
      label: seriesLabel,
    },
    {
      name: "Omar",
      type: "custom",
      renderItem,
      encode: {
        x: 0,
        y: 1,
      },
      label: seriesLabel,
      data: [2001],
    },
    // {
    //   name: "Hamza",
    //   type: "bar",
    //   label: seriesLabel,
    //   data: [2002],
    // },
    // {
    //   name: "workers",
    //   type: "custom",
    //   xAxisIndex: 0,
    //   // renderItem,
    //   // dimensions: ["", ""]
    // 	encode: {

    // 	}
    // },
  ],
};

myChart.setOption(option);
