import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: "patika",
    number: 0,
    apiURL: "https://alpha-vantage.p.rapidapi.com/query",
    headers: {
      "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
      "x-rapidapi-key": process.env.VUE_APP_RAPID_API_KEY,
    },
    dailySeries: "TIME_SERIES_DAILY",
    symbol: "MSFT",
    dailyData: {},
  },
  mutations: {
    SET_DAILY_RESULT(state, payload) {
      state.dailyData = payload;
    },
  },
  actions: {
    searchStockDaily({ state, commit }, payload) {
      axios
        .get(`${state.apiURL}`, {
          headers: { ...state.headers },
          params: { function: state.dailySeries, symbol: payload },
        })
        .then((res) => {
          console.log(res);
          commit("SET_DAILY_RESULT", res.data);
        })
        .catch((err) => console.error(err));
    },
    // getNumber({ commit }, payload) {
    //   let number = 0;
    //   for (let i = 0; i <= payload; i++) {
    //     number += i;
    //   }
    //   commit("SET_NUMBER", number);
    // },
    // searchFromMovieTitle({ state, commit }, payload) {
    //   axios
    //     .get(`${state.apiURL}title/find`, {
    //       headers: { ...state.headers },
    //       params: { q: payload },
    //     })
    //     .then((res) => {
    //       console.log(res.data.results);
    //       let data = [];
    //       for (let i = 0; i < res.data.results.length; i++) {
    //         if (res.data.results[i].image) data.push(res.data.results[i]);
    //       }
    //       commit("SET_MOVIE_SEARCH_RESULT", data);
    //     })
    //     .catch((err) => console.log(err));
    // },
  },
  getters: {
    // searchTypeMovie: (state) => {
    //   let res = 0;
    //   for (let i = 0; i < state.searchResults.length; i++) {
    //     if (state.searchResults[i].titleType === "movie") res++;
    //   }
    //   return res;
    // },
    // favNumber: (state) => {
    //   return state.favMovies.length;
    // },
  },
  modules: {},
});
