<template>
  <div class="text-center">
    <!-- <h1>DrawChart</h1>
    <h2>{{ timeSeries }}</h2> -->
    <v-row class="mt-5 justify-center">
      <v-btn dark color="indigo" @click="drawChart">
        GET THE CHART
        <v-icon large right color="white"> mdi-brush-variant </v-icon>
      </v-btn>
    </v-row>
    <v-card class="rounded-lg grey lighten-5 mt-5">
      <div ref="chart"></div>
    </v-card>
    <div v-if="loadingStatus">Loading</div>
    <!-- <v-row>
      {{ getFrequencyTag(this.timeSeries) }}
    </v-row> -->
  </div>
</template>

<script>
import * as d3 from "d3";
import { mapGetters } from "vuex";

export default {
  name: "DrawChart",
  props: ["timeSeries"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["getFrequencyTag", "loadingStatus"]),
    loadingStatus() {
      return this.$store.state.loadingStatus;
    },
  },
  methods: {
    drawChart() {
      //console.log("drawchart");
      if (document.getElementById("chart")) {
        const chart = document.getElementById("chart");
        this.$refs.chart.removeChild(chart);
      }

      let obj = {
        date: (d) => new Date(d.date),
        high: (d) => d.high,
        low: (d) => d.low,
        open: (d) => d.open,
        close: (d) => d.close,
        volume: (d) => d.volume,
        yLabel: "↑ Price ($)",
        width: 1300,
        height: 500,
      };
      //console.log(this.timeSeries);
      switch (this.timeSeries) {
        case "WEEKLY":
          this.retrieveGraph(
            this.getFrequencyTag(this.timeSeries).slice(1, 50),
            obj
          );
          break;

        case "MONTHLY":
          this.retrieveGraph(
            this.getFrequencyTag(this.timeSeries).slice(1, 25),
            obj
          );
          break;

        default:
          this.retrieveGraph(this.getFrequencyTag(this.timeSeries), obj);
          break;
      }
    },
    retrieveGraph(
      data,
      {
        date = (d) => d.date, // given d in data, returns the (temporal) x-value
        open = (d) => d.open, // given d in data, returns a (quantitative) y-value
        close = (d) => d.close, // given d in data, returns a (quantitative) y-value
        high = (d) => d.high, // given d in data, returns a (quantitative) y-value
        low = (d) => d.low, // given d in data, returns a (quantitative) y-value
        title, // given d in data, returns the title text
        marginTop = 20, // top margin, in pixels
        marginRight = 30, // right margin, in pixels
        marginBottom = 60, // bottom margin, in pixels
        marginLeft = 40, // left margin, in pixels
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        xDomain, // array of x-values (defaults to every weekday)
        xRange = [marginLeft, width - marginRight], // [left, right]
        xPadding = 0.1,
        xTicks, // array of x-values to label (defaults to every other Monday)
        yType = d3.scaleLinear, // type of y-scale
        yDomain, // [ymin, ymax]
        yRange = [height - marginBottom, marginTop], // [bottom, top]
        xFormat = "%b %-d", // a format specifier for the date on the x-axis
        yFormat = "~f", // a format specifier for the value on the y-axis
        yLabel, // a label for the y-axis
        stroke = "currentColor", // stroke color for the daily rule
        strokeLinecap = "square", // stroke line cap for the rules
        colors = ["#00E676", "#999999", "#e41a1c"], // [up, no change, down]
      } = {}
    ) {
      const X = d3.map(data, date);
      const Yo = d3.map(data, open);
      const Yc = d3.map(data, close);
      const Yh = d3.map(data, high);
      const Yl = d3.map(data, low);
      const I = d3.range(X.length);

      const weeks = (start, stop, stride) =>
        d3.utcMonday.every(stride).range(start, +stop + 1);
      const weekdays = (start, stop) =>
        d3
          .utcDays(start, +stop + 1)
          .filter((d) => d.getUTCDay() !== 0 && d.getUTCDay() !== 6);

      // Compute default domains and ticks.
      if (xDomain === undefined) xDomain = weekdays(d3.min(X), d3.max(X));
      if (yDomain === undefined) yDomain = [d3.min(Yl), d3.max(Yh)];
      if (xTicks === undefined)
        xTicks = weeks(d3.min(xDomain), d3.max(xDomain), 2);

      // Construct scales and axes.
      // If you were to plot a stock using d3.scaleUtc, you’d see distracting gaps
      // every weekend. This chart therefore uses a d3.scaleBand whose domain is every
      // weekday in the dataset. A few gaps remain for holiday weekdays, such as
      // Christmas, but these are infrequent and allow the labeling of Mondays. As a
      // band scale, we specify explicit tick values.
      const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
      const yScale = yType(yDomain, yRange);
      const xAxis = d3
        .axisBottom(xScale)
        .tickFormat(d3.utcFormat(xFormat))
        .tickValues(xTicks);
      const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

      // Compute titles.
      if (title === undefined) {
        const formatDate = d3.utcFormat("%B %-d, %Y");
        const formatValue = d3.format(".2f");
        const formatChange = (
          (f) => (y0, y1) =>
            f((y1 - y0) / y0)
        )(d3.format("+.2%"));
        title = (i) => `${formatDate(X[i])}
        Open: ${formatValue(Yo[i])}
        Close: ${formatValue(Yc[i])} (${formatChange(Yo[i], Yc[i])})
        Low: ${formatValue(Yl[i])}
        High: ${formatValue(Yh[i])}`;
      } else if (title !== null) {
        const T = d3.map(data, title);
        title = (i) => T[i];
      }

      const svg = d3
        .select(this.$refs.chart)
        .append("svg")
        .attr("id", "chart")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

      svg
        .append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call((g) => g.select(".domain").remove())
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

      svg
        .append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick line")
            .clone()
            .attr("stroke-opacity", 0.2)
            .attr("x2", width - marginLeft - marginRight)
        )
        .call((g) =>
          g
            .append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel)
        );

      const g = svg
        .append("g")
        .attr("stroke", stroke)
        .attr("stroke-linecap", strokeLinecap)
        .selectAll("g")
        .data(I)
        .join("g")
        .attr("transform", (i) => `translate(${xScale(X[i])},0)`);

      g.append("line")
        .attr("y1", (i) => yScale(Yl[i]))
        .attr("y2", (i) => yScale(Yh[i]));

      g.append("line")
        .attr("y1", (i) => yScale(Yo[i]))
        .attr("y2", (i) => yScale(Yc[i]))
        .attr("stroke-width", xScale.bandwidth())
        .attr("stroke", (i) => colors[1 + Math.sign(Yo[i] - Yc[i])]);

      if (title) g.append("title").text(title);

      //  return svg.node();
    },
  },
  watch: {
    getFrequencyTag() {
      // while (this.$refs.chart.firstChild) {
      // 	this.$refs.chart.firstChild.remove();
      // }
      this.drawChart();
    },
  },
};
</script>

<style scoped></style>
