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
    stockDataSeries: {},
    symbolsFound: [],
    userStatus: "Admin",
    loadingStatus: false,
    logs: ["deneme1", "deneme2"],
    selectedTicker: "",
    selectedTimeSeries: "DAILY",
  },
  mutations: {
    SET_RESULT_DATA(state, payload) {
      state.stockDataSeries = payload;
    },
    SET_SYMBOLS_FOUND(state, payload) {
      state.symbolsFound = payload;
    },
    SET_USER_STATUS(state, payload) {
      state.userStatus = payload;
    },
    LOADING_STATUS(state, newLoadingStatus) {
      state.loadingStatus = newLoadingStatus;
    },
    SET_TICKER(state, payload) {
      state.selectedTicker = payload;
    },
    SET_TIME_SERIES(state, payload) {
      state.selectedTimeSeries = payload;
    },
  },
  actions: {
    setTickerAction({ commit }, payload) {
      commit("SET_TICKER", payload);
    },
    setUser({ commit }, payload) {
      commit("SET_USER_STATUS", payload);
    },
    searchSymbol({ state, commit }, payload) {
      commit("LOADING_STATUS", true);

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
          if (res.status === 200) {
            if (res.data.Note) {
              throw new Error(res.data.Note);
            }
            commit("SET_SYMBOLS_FOUND", res.data.bestMatches);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => commit("LOADING_STATUS", false));
    },
    searchStockSeries({ state, commit }, payload) {
      commit("LOADING_STATUS", true);
      axios
        .get(`${state.apiURL}`, {
          params: {
            function: `${payload.selectedTimeSeries}`,
            apikey: state.apikey,
            symbol: payload.selectedTicker,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.Note) {
              throw new Error(res.data.Note);
            }
            commit(
              "SET_RESULT_DATA",
              res.data[`${this.getters.dataTimeSeriesFormat}`]
            );
          }
        })
        .catch((err) => console.error(err))
        .finally(() => commit("LOADING_STATUS", false));
    },
  },
  getters: {
    apiTimeSeriesFormat(state) {
      switch (state.selectedTimeSeries) {
        case "DAILY":
          return "TIME_SERIES_DAILY";
        case "WEEKLY":
          return "TIME_SERIES_WEEKLY";
        case "MONTHLY":
          return "TIME_SERIES_MONTHLY";
        default:
          break;
      }
    },
    dataTimeSeriesFormat(state) {
      switch (state.selectedTimeSeries) {
        case "DAILY":
          return "Time Series (Daily)";
        case "WEEKLY":
          return "Weekly Time Series";
        case "MONTHLY":
          return "Monthly Time Series";
        default:
          break;
      }
    },
    timeSeriesArray(state) {
      return Object.keys(state.stockDataSeries).map((key) => {
        return {
          date: key,
          open: parseFloat(state.stockDataSeries[key]["1. open"]),
          high: parseFloat(state.stockDataSeries[key]["2. high"]),
          low: parseFloat(state.stockDataSeries[key]["3. low"]),
          close: parseFloat(state.stockDataSeries[key]["4. close"]),
          volume: parseFloat(state.stockDataSeries[key]["5. volume"]),
        };
      });
    },
    getUserStatus(state) {
      //if Admin true, else false
      return state.userStatus === "Admin"
    }
  },
  modules: {},
});
