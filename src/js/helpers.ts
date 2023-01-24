import * as echarts from "echarts";
import { chartWidth, zoomData } from ".";
import { empData } from "../../data";
import { COLORS } from "./constants";
// import data from "../../data.json";

type RenderItemParams = echarts.CustomSeriesRenderItemParams;
type RenderItemAPI = echarts.CustomSeriesRenderItemAPI;
type RenderItemReturn = echarts.CustomSeriesRenderItemReturn;

export const filterYAxis = (
  // type: "all" | "not-started" | "delayed" | "completed" | "in-progress",
  data: any[]
): any[] => {
  let names: any[] = [];
  // let dataSorted = data.sort((a: any, b: any) => {
  //   return a[0] < b[0] ? -1 : 1;
  // });

  for (let i in data) {
    names = [...names, [data[i][0], data[i][4]]];
  }

  // console.log("🚀 ~ names", names);

  return names;
};

export const filterXAxis = (
  type: "all" | "not-started" | "delayed" | "completed" | "in-progress",
  data: any[]
): any[] => {
  if (type !== "all") {
    let filtered = data.filter((el: any[]) => el[el.length - 1] === type);
    // console.log("filtered:", filtered);

    return filtered;
  }

  return data;
};

export const extractNames = (data: any[]): any[] => {
  let names: any[] = [];

  if (data) {
    data.sort((a: any, b: any) => {
      return a[0] < b[0] ? -1 : 1;
    });

    for (let i = 0; i < data.length; i++) {
      // names = [...names, allData[i][allData[i].length - 1]];
      names = [
        ...names,
        {
          type: data[i][data[i].length - 1],
          value: data[i][data[i].length - 2],
        },
      ];
    }
  }
  // console.log("new names:", names);

  return names;
};

export const dataZoomHandler = (e: any) => {
  console.log("event:", e);
  console.log("zoomData", zoomData);

  zoomData.xAxisZoomStart = e.start;
  zoomData.xAxisZoomEnd = e.end;
  zoomData.yAxisZoomStart = e.start;
  zoomData.yAxisZoomEnd = e.end;

  if (e.dataZoomId === "scrollY") {
    zoomData.yAxisZoomStart = e.start;
    zoomData.yAxisZoomEnd = e.end;
  }

  if (e.dataZoomId === "scrollX") {
    zoomData.xAxisZoomStart = e.start;
    zoomData.xAxisZoomEnd = e.end;
  }

  console.log("zoomData", zoomData);
};

const fillColor = (
  percent: number,
  colors: {
    completed: string;
    inProgress: string;
    delayed: string;
    notStarted: string;
  }
) => {
  return percent === 0
    ? colors.notStarted
    : percent <= 50
    ? colors.delayed
    : percent === 100
    ? colors.completed
    : colors.inProgress;
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
        },
      },
      {
        type: "rect",
        ignore: !rectShape,
        shape: { ...rectShape, r: 6 },
        style: {
          fill: "transparent",
          stroke: "transparent",
        },
        textContent: {
          type: "text",
          style: {
            text: String(employeeName),
            fontWeight: "bold",
            fill: "#000",
          },
        },
        textConfig: {
          position: "right",
          distance:
            90 /
            ((100 + zoomData.yAxisZoomEnd - zoomData.yAxisZoomStart) / 100), // 90px from bar right / (100 + (data zoom percent on y axis) / 100))
        },
      },
      {
        type: "rect",
        ignore: !rectPercent,
        shape: { ...rectPercent, r: 6 },
        style: {
          fill: String(fillColor(+percentage, COLORS)),
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
    ],
  };
};
