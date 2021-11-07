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
    headers: { "User-Agent": "Canberk LLC" },
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
          headers: { ...state.headers },
          params: {
            function: "SYMBOL_SEARCH",
            keywords: payload,
            apikey: state.apikey,
          },
        })
        .then((res) => {
          console.log(res);
          commit("SET_SYMBOLS_FOUND", res.data.bestMatches);
        })
        .catch((err) => console.error(err));
    },
    searchStockSeries({ state, commit }, payload) {
      axios
        .get(`${state.apiURL}`, {
          headers: { ...state.headers },
          params: {
            function: `TIME_SERIES_${payload.selectedTimeSeries}`,
            apikey: state.apikey,
            symbol: payload.selectedTicker,
          },
        })
        .then((res) => {
          console.log(res);
          commit("SET_RESULT", res.data);
        })
        .catch((err) => console.error(err));
    },
  },
  getters: {},
  modules: {},
});
