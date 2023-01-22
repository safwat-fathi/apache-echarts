import * as echarts from "echarts";
import { chartWidth, textPositionConstant, empData } from ".";
// import data from "../../data.json";
// import { chart } from ".";

type RenderItemParams = echarts.CustomSeriesRenderItemParams;
type RenderItemAPI = echarts.CustomSeriesRenderItemAPI;
type RenderItemReturn = echarts.CustomSeriesRenderItemReturn;

export const filterYAxis = (
  type: "not-started" | "delayed" | "complete" | "in-progress",
  data: any[]
): any[] => {
  // let yData: echarts.EChartsCoreOption = chart.getOption();
  // let yDataArr = <any[]>yData.yAxis;
  // let filtered = yDataArr[0].data.filter((el: any) => el.type !== type);
  let filtered = data.filter((el: any) => el.type !== type);
  // console.log("filtered:", filtered);

  return filtered;
};

export const filterXAxis = (
  type: "not-started" | "delayed" | "complete" | "in-progress",
  data: any[]
): any[] => {
  let filtered = data.filter((el: any[]) => el[el.length - 1] === type);
  console.log("filtered:", filtered);

  return filtered;
};

export const extractNames = (empData: any[]): any[] => {
  let names: any[] = [];

  if (empData) {
    empData.sort((a: any, b: any) => {
      return a[0] < b[0] ? -1 : 1;
    });

    for (let i = 0; i < empData.length; i++) {
      // names = [...names, allData[i][allData[i].length - 1]];
      names = [
        ...names,
        {
          type: empData[i][empData[i].length - 1],
          value: empData[i][empData[i].length - 2],
        },
      ];
    }
  }
  // console.log("new names:", names);

  return names;
};

const fillColor = (percent: number) => {
  const COLORS = {
    completed: "#98e464",
    inProgress: "#47c0f4",
    delayed: "#fba606",
    notStarted: "#9193fc",
  };

  return percent === 0
    ? COLORS.notStarted
    : percent <= 50
    ? COLORS.delayed
    : percent === 100
    ? COLORS.completed
    : COLORS.inProgress;
};

export const subXAxisLabelFormatter = (
  type: "month" | "quarter" | "semester",
  value?: any
) => {
  const date = new Date(value);
  const month = date.toLocaleDateString("en-US", { month: "numeric" });

  if (type === "quarter") return `Q${Math.ceil(+month / 3)}`;
  if (type === "semester")
    return `Semester${Math.ceil(+month / 3) < 3 ? 1 : 2}`;

  return date.toLocaleDateString("en-US", { month: "short" });
};

export const renderGanttItem = (
  params: RenderItemParams,
  api: RenderItemAPI
): RenderItemReturn => {
  const index = api.value(0);
  const start = api.coord([api.value(1), index]); // api.coord([x, y])
  const end = api.coord([api.value(2), index]); // api.coord([x, y])
  const percentage = api.value(3);
  const employeeName = api.value(4);
  const barWidth = end[0] - start[0];
  const percentageWidth = (barWidth * +percentage) / 100;

  const mainTextWidth = echarts.format.getTextRect(
    `Milestone ${+index + 1}`
  ).width;
  // const subTextWidth = echarts.format.getTextRect(`${percentage}%`).width;

  const HEIGHT_RATIO = 0.5;

  // @ts-ignore
  const height = <number>(api.size([0, 1])[1] * HEIGHT_RATIO);
  const x = start[0];
  const y = start[1] - height / 2;

  const mainText =
    (x + barWidth) / 3 >= mainTextWidth ? `Milestone ${+index + 1}` : "";
  const subText =
    chartWidth - x > 100 + mainTextWidth * 2 ? `${percentage}%` : "";

  const imagePosition = x + barWidth + 20;
  const textPosition = y + height / 2 - textPositionConstant;

  const rectShape = echarts.graphic.clipRectByRect(
    {
      x,
      y,
      width: barWidth,
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
      width: percentageWidth,
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
        textContent: {
          type: "text",
          style: {
            text: subText,
            fontWeight: "bold",
            width: barWidth * 0.25,
            overflow: "truncate",
            ellipsis: "..",
          },
        },
        textConfig: {
          position: "insideRight",
          // distance: 15,
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
        textContent: {
          type: "text",
          style: {
            text: mainText,
            fontWeight: "bold",
            width: barWidth * 0.3,
            overflow: "truncate",
            ellipsis: "..",
          },
        },
        textConfig: {
          position: "insideLeft",
          // distance: 15,
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
          fontWeight: "bold",
          // fontSize:
          //   yAxisZoomEnd - yAxisZoomStart <= 51
          //     ? FONT_SIZE - FONT_SIZE * ((yAxisZoomEnd - yAxisZoomStart) / 100)
          //     : 13,
        },
      },
    ],
  };
};
