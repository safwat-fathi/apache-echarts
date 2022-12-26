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
const MAX = "2014";

const timeData = [
  [0, "2010-04-1", "2011-06-07", 70],
  [1, "2011-02-1", "2012-09-19", 20],
  [2, "2010-05-1", "2012-12-01", 50],
  [3, "2011-11-1", "2013-05-1", 90],
  [4, "2010-11-1", "2013-01-1", 60],
];

const calculateQuarters = (data: any[]): string[] => {
  let quarters;
  // let max = 0;
  // let min = +moment(timeData[0][1]).format("YYYY");

  // // find max & min dates
  // data.forEach((date) => {
  //   let dateEnd = moment(date[2]).format("YYYY");
  //   let dateStart = moment(date[1]).format("YYYY");

  //   if (+dateEnd > max) {
  //     max = +dateEnd;
  //   }

  //   if (+dateStart < min) {
  //     max = +dateStart;
  //   }
  // });

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

const renderGanttItem = (
  params: RenderItemParams,
  api: RenderItemAPI
): RenderItemReturn => {
  const index = api.value(0);

  // const text = api.value(4);

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

  // console.log(text, "x:", x);
  // console.log(text, "width:", width);
  // console.log(text, "x - (width + 10):", x - (width + 10));
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
          // textFill: "black",
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
      // {
      //   type: "rect",
      //   ignore: !rectText,
      //   shape: rectText,
      //   style: {
      //     fill: "green",
      //     stroke: "transparent",
      //   },
      // },
    ],
  };
};

function xAxisLabelFormatter(value?: any, index?: number) {
  const year = moment(value).format("YYYY");
  const q = moment(value).format("Q");
  if (+q === 1) {
    console.log("index", year, "start of label");
  } else {
    console.log("index", year, "quarters");
  }
  // if the same year show none
  // next year show year only
  // console.log(year, q);
  return +q === 1 ? "{yyyy}" : "";
}

const option: EChartsOption = {
  grid: {
    top: 100,
  },
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
        // formatter: xAxisLabelFormatter,
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
    // inverse: true, // reverse order of data
  },
  series: [
    {
      name: "workersData",
      type: "custom",
      data: timeData,
      encode: {
        x: [0, 1, 2],
        y: 0, // reference of index
      },
      xAxisIndex: 0,
      renderItem: renderGanttItem,
    },
  ],
};

// const data = [
//   ["2018-04-10T20:40:33Z", 1, 5],
//   ["2018-04-10T20:40:53Z", 2, 3],
//   ["2018-04-10T20:41:03Z", 4, 2],
//   ["2018-04-10T20:44:03Z", 5, 1],
//   ["2018-04-10T20:45:03Z", 6, 0],
// ];

// const option: EChartsOption = {
//   legend: {},
//   tooltip: {
//     trigger: "axis",
//   },
//   dataset: {
//     source: data,
//     dimensions: ["timestamp", "sensor1", "sensor2"],
//   },
//   xAxis: { type: "time" },
//   yAxis: {},
//   series: [
//     {
//       name: "sensor1",
//       type: "line",
//       encode: {
//         x: "timestamp",
//         y: "sensor1", // refer sensor 1 value
//       },
//     },
//     {
//       name: "sensor2",
//       type: "line",
//       encode: {
//         x: "timestamp",
//         y: "sensor2",
//       },
//     },
//   ],
// };

myChart.setOption(option);
