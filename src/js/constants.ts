// chart container
export const domElements = {
  chartDom: <HTMLElement>document.getElementById("echart"),
  semesterBtn: document.getElementById("semesterly"),
  quarterBtn: document.getElementById("quarterly"),
  monthBtn: document.getElementById("monthly"),
  inProgressLegend: document.getElementById("in-progress"),
  delayedLegend: document.getElementById("delayed"),
  completedLegend: document.getElementById("completed"),
  notStartedLegend: document.getElementById("not-started"),
};

export const MIN = "2009";
export const MAX = "2023";

export const COLORS = {
  completed: "#98e464",
  inProgress: "#47c0f4",
  delayed: "#fba606",
  notStarted: "#9193fc",
};
