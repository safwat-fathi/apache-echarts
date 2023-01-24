import * as echarts from "echarts";
import { empData } from "../../data";
import { domElements } from "./constants";
import { ZoomData, SeriesT, ChartState } from "./types";

export class ApachEchart {
  private _eChart: echarts.ECharts;
  private _eChartOption: echarts.EChartsOption | null = null;
  private _eChartState: ChartState;
  // private readonly _colors: Record<
  //   "completed" | "inProgress" | "delayed" | "notStarted",
  //   string
  // >;

  constructor(id: string) {
    // this._eChart = <ECharts>echarts.getInstanceByDom(domElements.chartDom);
    this._eChart = echarts.init(<HTMLElement>document.getElementById(id));

    this._eChartState = {
      data: empData,
      subAxisType: "quarter",
      dataZoomCoordinates: {
        xAxisZoomStart: 40,
        xAxisZoomEnd: 92.9,
        yAxisZoomStart: 0,
        yAxisZoomEnd: 30,
      },
      yAxisMinZoomLimit: 35,
      yAxisMaxZoomLimit: 80,
      xAxisMinZoomLimit: 12.5,
      xAxisMaxZoomLimit: 60,
      dataMin: "2009",
      dataMax: "2023",
      chartWidth: 0,
    };

    console.log(this._eChartState);

    // this._colors = colors;

    // this._eChartOption = {
    //   animation: true,
    //   legend: {
    //     show: false,
    //   },
    //   // // @ts-ignore
    //   tooltip: {
    //     trigger: "axis",
    //     axisPointer: {
    //       axis: "y",
    //       type: "shadow",
    //       shadowStyle: {
    //         color: "#2b64bb7c",
    //         // opacity: 0.3,
    //       },
    //     },
    //     position: (point: number[]) => [point[0], point[1] + 20], // [x, y + 20px]
    //     formatter: function (params: any) {
    //       const data = params[0].data;

    //       return `<b>Milestone</b>: ${data[0] + 1}<br /><b>From period</b>: ${
    //         data[1]
    //       } <b>to</b> ${data[2]}<br /><b>Done percentage</b>: ${
    //         data[3]
    //       }%<br /><b>For employee</b>: ${data[4]}`;
    //     },
    //   },
    //   grid: {
    //     top: 80, // height of x axis (main & sub)
    //     bottom: 40, // height of x axis data zoom
    //   },
    //   dataZoom: [
    //     // Y axis scroll with slider
    //     {
    //       type: "slider",
    //       id: "scrollY",
    //       yAxisIndex: 0,
    //       width: 10, // width of slider
    //       bottom: 35, //
    //       handleSize: "300%",
    //       showDetail: false,
    //       start: this._eChartState.dataZoomCoordinates.yAxisZoomStart,
    //       end: this._eChartState.dataZoomCoordinates.yAxisZoomEnd,
    //       minSpan: this._eChartState.yAxisMinZoomLimit,
    //       maxSpan: this._eChartState.yAxisMaxZoomLimit,
    //       filterMode: "none",
    //     },
    //     // Y axis scroll inside grid
    //     {
    //       type: "inside",
    //       id: "insideY",
    //       yAxisIndex: 0,
    //       top: 100,
    //       start: this._eChartState.dataZoomCoordinates.yAxisZoomStart,
    //       end: this._eChartState.dataZoomCoordinates.yAxisZoomEnd,
    //       zoomOnMouseWheel: false,
    //       moveOnMouseMove: true,
    //       moveOnMouseWheel: true,
    //       filterMode: "none",
    //     },
    //     // X axis scroll & zoom with slider
    //     {
    //       type: "slider",
    //       id: "scrollX",
    //       xAxisIndex: [0, 1],
    //       width: 1000 - 30,
    //       height: 10,
    //       right: 30,
    //       bottom: 20,
    //       handleSize: "300%",
    //       showDetail: false,
    //       start: this._eChartState.dataZoomCoordinates.xAxisZoomStart,
    //       end: this._eChartState.dataZoomCoordinates.xAxisZoomEnd,
    //       minSpan: this._eChartState.xAxisMinZoomLimit,
    //       maxSpan: this._eChartState.xAxisMaxZoomLimit,
    //       filterMode: "none",
    //     },
    //   ],
    //   xAxis: [
    //     {
    //       type: "time",
    //       position: "top",
    //       min: this._eChartState.dataMin,
    //       max: this._eChartState.dataMax,
    //       axisLine: {
    //         show: false,
    //       },
    //       // * day = 60 * 60 * 1000 * 24
    //       // * month = day * 30
    //       // * quarter = month * 4
    //       axisTick: { show: false },
    //       offset: 40,
    //       axisLabel: {
    //         color: "#fff",
    //         fontSize: 18,
    //         showMaxLabel: true,
    //         formatter: (value: any) => {
    //           const year = new Date(value).toLocaleDateString("en-US", {
    //             year: "numeric",
    //           });

    //           const month = new Date(value).toLocaleDateString("en-US", {
    //             month: "numeric",
    //           });
    //           const quarter = Math.ceil(+month / 3);
    //           const semester = Math.ceil(+month / 2);

    //           if (this._eChartState.subAxisType === "quarter") {
    //             return quarter === 1 ? year : "";
    //           }

    //           if (this._eChartState.subAxisType === "month") {
    //             return +month === 1 ? year : "";
    //           }

    //           return +semester === 1 ? year : "";
    //         },
    //       },
    //     },
    //     {
    //       type: "time",
    //       show: true,
    //       min: this._eChartState.dataMin,
    //       max: this._eChartState.dataMax,
    //       axisLine: { show: false },
    //       axisTick: {
    //         show: false,
    //       },
    //       position: "top",
    //       splitLine: {
    //         show: true,
    //       },
    //       offset: 0,
    //       axisLabel: {
    //         fontSize: 11,
    //         color: "#a7a7a7",
    //         showMaxLabel: true,
    //         formatter: (value: any) =>
    //           this._subXAxisLabelFormatter("quarter", value),
    //       },
    //     },
    //   ],
    //   yAxis: {
    //     // type: "category",
    //     // boundaryGap: ["1%", "1%"],
    //     boundaryGap: true,
    //     min: -1,
    //     max: this._eChartState.data.length,
    //     axisTick: { show: false },
    //     splitLine: { show: false },
    //     axisLine: { show: false },
    //     // data: extractNames([
    //     //   ...data.complete,
    //     //   ...data.delayed,
    //     //   ...data.inProgress,
    //     //   ...data.notStarted,
    //     // ]),
    //     axisLabel: {
    //       show: true,
    //       fontWeight: "bold",
    //     },
    //   },
    //   series: [
    //     {
    //       name: "not-started",
    //       type: "custom",
    //       // select: false,
    //       data: this._filterXAxis("not-started", this._eChartState.data),
    //       encode: {
    //         x: [1, 2], // reference of [date start, date end]
    //         y: 0, // reference of index
    //       },
    //       xAxisIndex: 0,
    //       renderItem: this._renderGanttItem,
    //       clip: true,
    //     },
    //     {
    //       name: "completed",
    //       type: "custom",
    //       data: this._filterXAxis("completed", this._eChartState.data),
    //       encode: {
    //         x: [1, 2],
    //         y: 0, // reference of index
    //       },
    //       xAxisIndex: 0,
    //       renderItem: this._renderGanttItem,
    //       clip: true,
    //     },
    //     {
    //       name: "in-progress",
    //       type: "custom",
    //       data: this._filterXAxis("in-progress", this._eChartState.data),
    //       encode: {
    //         x: [1, 2],
    //         y: 0, // reference of index
    //       },
    //       xAxisIndex: 0,
    //       renderItem: this._renderGanttItem,
    //       clip: true,
    //     },
    //     {
    //       name: "delayed",
    //       type: "custom",
    //       data: this._filterXAxis("delayed", this._eChartState.data),
    //       encode: {
    //         x: [1, 2],
    //         y: 0, // reference of index
    //       },
    //       xAxisIndex: 0,
    //       renderItem: this._renderGanttItem,
    //       clip: true,
    //     },
    //     // marker for current date
    //     {
    //       type: "line",
    //       xAxisIndex: 0,
    //       markLine: {
    //         data: [{ name: "current date", xAxis: "2011-01-01" }],
    //         label: {
    //           show: false,
    //         },
    //         symbol: "rect",
    //         symbolRotate: 90,
    //         lineStyle: {
    //           color: "#005371",
    //         },
    //       },
    //     },
    //   ],
    // };

    // this._eChart.setOption(this._eChartOption);
  }

  // new ResizeObserver(() => {
  // 	this._eChart.resize();
  // }).observe(domElements.chartDom);

  public init() {
    console.log(this._eChartState);

    this._eChartOption = {
      animation: true,
      legend: {
        show: false,
      },
      // // @ts-ignore
      tooltip: {
        trigger: "axis",
        axisPointer: {
          axis: "y",
          type: "shadow",
          shadowStyle: {
            color: "#2b64bb7c",
            // opacity: 0.3,
          },
        },
        position: (point: number[]) => [point[0], point[1] + 20], // [x, y + 20px]
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
        top: 80, // height of x axis (main & sub)
        bottom: 40, // height of x axis data zoom
      },
      dataZoom: [
        // Y axis scroll with slider
        {
          type: "slider",
          id: "scrollY",
          yAxisIndex: 0,
          width: 10, // width of slider
          bottom: 35, //
          handleSize: "300%",
          showDetail: false,
          start: this._eChartState.dataZoomCoordinates.yAxisZoomStart,
          end: this._eChartState.dataZoomCoordinates.yAxisZoomEnd,
          minSpan: this._eChartState.yAxisMinZoomLimit,
          maxSpan: this._eChartState.yAxisMaxZoomLimit,
          filterMode: "none",
        },
        // Y axis scroll inside grid
        {
          type: "inside",
          id: "insideY",
          yAxisIndex: 0,
          top: 100,
          start: this._eChartState.dataZoomCoordinates.yAxisZoomStart,
          end: this._eChartState.dataZoomCoordinates.yAxisZoomEnd,
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
          showDetail: false,
          start: this._eChartState.dataZoomCoordinates.xAxisZoomStart,
          end: this._eChartState.dataZoomCoordinates.xAxisZoomEnd,
          minSpan: this._eChartState.xAxisMinZoomLimit,
          maxSpan: this._eChartState.xAxisMaxZoomLimit,
          filterMode: "none",
        },
      ],
      xAxis: [
        {
          type: "time",
          position: "top",
          min: this._eChartState.dataMin,
          max: this._eChartState.dataMax,
          axisLine: {
            show: false,
          },
          // * day = 60 * 60 * 1000 * 24
          // * month = day * 30
          // * quarter = month * 4
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

              if (this._eChartState.subAxisType === "quarter") {
                return quarter === 1 ? year : "";
              }

              if (this._eChartState.subAxisType === "month") {
                return +month === 1 ? year : "";
              }

              return +semester === 1 ? year : "";
            },
          },
        },
        {
          type: "time",
          show: true,
          min: this._eChartState.dataMin,
          max: this._eChartState.dataMax,
          axisLine: { show: false },
          axisTick: {
            show: false,
          },
          position: "top",
          splitLine: {
            show: true,
          },
          offset: 0,
          axisLabel: {
            fontSize: 11,
            color: "#a7a7a7",
            showMaxLabel: true,
            formatter: (value: any) =>
              this._subXAxisLabelFormatter("quarter", value),
          },
        },
      ],
      yAxis: {
        // type: "category",
        // boundaryGap: ["1%", "1%"],
        boundaryGap: true,
        min: -1,
        max: this._eChartState.data.length,
        axisTick: { show: false },
        splitLine: { show: false },
        axisLine: { show: false },
        // data: extractNames([
        //   ...data.complete,
        //   ...data.delayed,
        //   ...data.inProgress,
        //   ...data.notStarted,
        // ]),
        axisLabel: {
          show: true,
          fontWeight: "bold",
        },
      },
      series: [
        {
          name: "not-started",
          type: "custom",
          // select: false,
          data: this._filterXAxis("not-started", this._eChartState.data),
          encode: {
            x: [1, 2], // reference of [date start, date end]
            y: 0, // reference of index
          },
          xAxisIndex: 0,
          // renderItem: this._renderGanttItem,
          clip: true,
        },
        {
          name: "completed",
          type: "custom",
          data: this._filterXAxis("completed", this._eChartState.data),
          encode: {
            x: [1, 2],
            y: 0, // reference of index
          },
          xAxisIndex: 0,
          // renderItem: this._renderGanttItem,
          clip: true,
        },
        {
          name: "in-progress",
          type: "custom",
          data: this._filterXAxis("in-progress", this._eChartState.data),
          encode: {
            x: [1, 2],
            y: 0, // reference of index
          },
          xAxisIndex: 0,
          // renderItem: this._renderGanttItem,
          clip: true,
        },
        {
          name: "delayed",
          type: "custom",
          data: this._filterXAxis("delayed", this._eChartState.data),
          encode: {
            x: [1, 2],
            y: 0, // reference of index
          },
          xAxisIndex: 0,
          // renderItem: this._renderGanttItem,
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

    this._eChart.setOption(this._eChartOption);
  }
  // public getInstance() {
  //   return this._eChart;
  // }

  public resize() {
    return this._eChart.resize();
  }

  private _toolTipFormatter(template: string) {
    // const data = params[0].data;

    return template;
  }

  // private _renderGanttItem(
  //   params: echarts.CustomSeriesRenderItemParams,
  //   api: echarts.CustomSeriesRenderItemAPI
  // ): echarts.CustomSeriesRenderItemReturn {
  //   const index = api.value(0);
  //   const start = api.coord([api.value(1), index]); // api.coord([x, y])
  //   const end = api.coord([api.value(2), index]); // api.coord([x, y])
  //   const percentage = api.value(3);
  //   const employeeName = api.value(4);
  //   const barWidth = end[0] - start[0];
  //   const percentageWidth = (barWidth * +percentage) / 100;

  //   const mainTextWidth = echarts.format.getTextRect(
  //     `Milestone ${+index + 1}`
  //   ).width;
  //   // const subTextWidth = echarts.format.getTextRect(`${percentage}%`).width;

  //   const HEIGHT_RATIO = 0.5;

  //   // @ts-ignore
  //   const height = <number>(api.size([0, 1])[1] * HEIGHT_RATIO);
  //   const x = start[0];
  //   const y = start[1] - height / 2;

  //   const mainText =
  //     (x + barWidth) / 3 >= mainTextWidth ? `Milestone ${+index + 1}` : "";
  //   const subText =
  //     this._eChartState.chartWidth - x > 100 + mainTextWidth * 2
  //       ? `${percentage}%`
  //       : "";

  //   const imagePosition = x + barWidth + 20;

  //   const rectShape = echarts.graphic.clipRectByRect(
  //     {
  //       x,
  //       y,
  //       width: barWidth,
  //       height,
  //     },
  //     {
  //       // @ts-ignore
  //       x: params.coordSys.x,
  //       // @ts-ignore
  //       y: params.coordSys.y,
  //       // @ts-ignore
  //       width: params.coordSys.width,
  //       // @ts-ignore
  //       height: params.coordSys.height,
  //     }
  //   );

  //   const rectPercent = echarts.graphic.clipRectByRect(
  //     {
  //       x,
  //       y,
  //       width: percentageWidth,
  //       height,
  //     },
  //     {
  //       // @ts-ignore
  //       x: params.coordSys.x,
  //       // @ts-ignore
  //       y: params.coordSys.y,
  //       // @ts-ignore
  //       width: params.coordSys.width,
  //       // @ts-ignore
  //       height: params.coordSys.height,
  //     }
  //   );

  //   return {
  //     type: "group",
  //     children: [
  //       {
  //         type: "rect",
  //         ignore: !rectShape,
  //         shape: { ...rectShape, r: 6 },
  //         style: {
  //           fill: "#eeedf0",
  //           stroke: "transparent",
  //         },
  //         textContent: {
  //           type: "text",
  //           style: {
  //             text: subText,
  //             fontWeight: "bold",
  //             width: barWidth * 0.25,
  //             overflow: "truncate",
  //             ellipsis: "..",
  //           },
  //         },
  //         textConfig: {
  //           position: "insideRight",
  //         },
  //       },
  //       {
  //         type: "rect",
  //         ignore: !rectShape,
  //         shape: { ...rectShape, r: 6 },
  //         style: {
  //           fill: "transparent",
  //           stroke: "transparent",
  //         },
  //         textContent: {
  //           type: "text",
  //           style: {
  //             text: `${employeeName}`,
  //             fontWeight: "bold",
  //             fill: "#000",
  //           },
  //         },
  //         textConfig: {
  //           position: "right",
  //           distance:
  //             90 /
  //             ((100 +
  //               this._eChartState.dataZoomCoordinates.yAxisZoomEnd -
  //               this._eChartState.dataZoomCoordinates.yAxisZoomStart) /
  //               100), // 90px from bar right / (100 + (data zoom percent on y axis) / 100))
  //         },
  //       },
  //       {
  //         type: "rect",
  //         ignore: !rectPercent,
  //         shape: { ...rectPercent, r: 6 },
  //         style: {
  //           // fill: this._fillColor(+percentage, this._colors),
  //           stroke: "transparent",
  //         },
  //         textContent: {
  //           type: "text",
  //           style: {
  //             text: mainText,
  //             fontWeight: "bold",
  //             width: barWidth * 0.3,
  //             overflow: "truncate",
  //             ellipsis: "..",
  //           },
  //         },
  //         textConfig: {
  //           position: "insideLeft",
  //         },
  //       },
  //       {
  //         type: "image",
  //         style: {
  //           image:
  //             "https://pbs.twimg.com/profile_images/1329949157486854150/2vhx3rm9_400x400.jpg",
  //           x: imagePosition,
  //           y,
  //           width: height * 0.9,
  //           height: height * 0.9,
  //         },
  //       },
  //     ],
  //   };
  // }

  private _fillColor(
    percent: number,
    colors: {
      completed: string;
      inProgress: string;
      delayed: string;
      notStarted: string;
    }
  ): string {
    return percent === 0
      ? colors.notStarted
      : percent <= 50
      ? colors.delayed
      : percent === 100
      ? colors.completed
      : colors.inProgress;
  }

  private _subXAxisLabelFormatter(
    type: "month" | "quarter" | "semester",
    value?: any
  ) {
    const date = new Date(value);
    const month = date.toLocaleDateString("en-US", { month: "numeric" });

    if (type === "quarter") return `Q${Math.ceil(+month / 3)}`;
    if (type === "semester")
      return `Semester${Math.ceil(+month / 3) < 3 ? 1 : 2}`;

    return date.toLocaleDateString("en-US", { month: "short" });
  }

  private _filterXAxis(
    type: "all" | "not-started" | "delayed" | "completed" | "in-progress",
    data: any[]
  ): any[] {
    if (type !== "all") {
      let filtered = data.filter((el: any[]) => el[el.length - 1] === type);
      // console.log("filtered:", filtered);

      return filtered;
    }

    return data;
  }
  // * helpers
  // filterXAxis
  // mainAxisLabelFormatter
  // renderGanttItem
  // tooltipFormatter
  // dataZoomHandler
  // legendClickHandler
  // legendHoverHandler
  // timeBtnHandler
  // setters&getters for chart state
  // setters&getters for chart state
  // setters&getters for chart option
  // setters&getters for chart option
}

// export const GanttChart = new ApachEchart("echart").getInstance();
