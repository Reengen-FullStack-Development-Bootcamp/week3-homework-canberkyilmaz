import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: "patika",
    number: 0,
    apiURL: "https://www.alphavantage.co/query",
    apikey: process.env.VUE_APP_API_KEY,
    stockData: {},
    symbolsFound: [],
  },
  mutations: {
    SET_RESULT(state, payload) {
      state.stockData = payload;
    },
    SET_SYMBOLS_FOUND(state, payload) {
      state.symbolsFound = payload;
    },
  },
  actions: {
    searchSymbol({ state, commit }, payload) {
      axios
        .get(`${state.apiURL}`, {
          // headers: { ...state.headers },
          params: {
            function: "SYMBOL_SEARCH",
            keywords: payload,
            apikey: state.apikey,
          },
        })
        .then((res) => {
          commit("SET_SYMBOLS_FOUND", res.data.bestMatches);
        })
        .catch((err) => console.error(err));
    },
    searchStockSeries({ state, commit }, payload) {
      axios
        .get(`${state.apiURL}`, {
          params: {
            function: `TIME_SERIES_${payload.selectedTimeSeries}`,
            apikey: state.apikey,
            symbol: payload.selectedTicker,
          },
        })
        .then((res) => {
          commit("SET_RESULT", res.data);
        })
        .catch((err) => console.error(err));
    },
  },
  getters: {
    getFrequencyTag: (state) => (freq) => {
      let frequencyTag = "";

      freq = freq[0].toUpperCase() + freq.toLowerCase().slice(1, freq.length);

      switch (freq) {
        case "Daily":
          frequencyTag = `Time Series (${freq})`;
          break;

        case "Weekly":
          frequencyTag = `${freq} Time Series`;
          break;

        case "Monthly":
          frequencyTag = `${freq} Time Series`;
          break;

        default:
          break;
      }

      const timeSeriesData = state.stockData[frequencyTag];
      if (timeSeriesData) {
        return Object.keys(timeSeriesData).map((key) => {
          return {
            date: key,
            open: parseFloat(timeSeriesData[key]["1. open"]),
            high: parseFloat(timeSeriesData[key]["2. high"]),
            low: parseFloat(timeSeriesData[key]["3. low"]),
            close: parseFloat(timeSeriesData[key]["4. close"]),
            volume: parseFloat(timeSeriesData[key]["5. volume"]),
          };
        });
      }
    },
  },
  modules: {},
});
