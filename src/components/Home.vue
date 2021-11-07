<template>
  <v-app>
    <v-container>
      <v-card class="mt-5" xs-12 lg-4 color="indigo lighten-2" dark>
        <v-card-title class="text-h5 indigo lighten-1">
          Search Stock Symbol
        </v-card-title>
        <v-card-text> Choose stock data to sea the charts. </v-card-text>
        <v-card-text>
          <v-form class="px-3">
            <v-text-field
              prepend-icon="mdi-database-search"
              @keydown.enter.prevent="searchTicker"
              label="Search Here"
              v-model="searchValue"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>

        <v-expand-transition>
          <v-list v-if="symbols.length > 0" class="indigo lighten-3">
            <v-list-item
              v-for="(symbol, i) in symbols"
              :key="symbol.value['1. symbol']"
              @click="setTicker(symbol.value['1. symbol'])"
              :ref="i"
            >
              <v-list-item-avatar
                color="indigo lighten-2"
                class="text-h4 font-weight-light"
              >
                {{ symbol.value["1. symbol"].charAt(0) }}
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  v-text="symbol.value['2. name']"
                ></v-list-item-title>
                <v-list-item-subtitle
                  v-text="symbol.value['1. symbol']"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expand-transition>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="indigo darken-1" @click="searchTicker">
            Search
            <v-icon right color="white"> mdi-magnify </v-icon>
          </v-btn>
          <v-btn
            :disabled="!searchValue"
            color="indigo darken-1"
            @click="searchValue = ''"
          >
            Clear
            <v-icon right> mdi-close-circle </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-row>
        <v-col>
          <h4>Selected Ticker: {{ selectedTicker }}</h4>
          <h4>Selected Frequency: {{ selectedTimeSeries }}</h4>
        </v-col>
      </v-row>

      <template>
        <v-tabs color="indigo">
          <v-tab v-for="item in items" :key="item" @click="setTimeSeries(item)"
            >{{ item }} TIME SERIES</v-tab
          >
        </v-tabs>
      </template>
      <v-btn color="indigo darken-1" @click="setStockSeries">
        GET ME THE CHART
        <v-icon right color="white"> mdi-magnify </v-icon>
      </v-btn>
      <div v-if="this.selectedTicker && this.selectedTimeSeries">
        <p>{{ this.$store.state.stockData }}</p>
      </div>
    </v-container>
  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    model: null,
    searchValue: "",
    search: "",
    selectedTicker: null,
    items: ["DAILY", "WEEKLY", "MONTHLY"],
    selectedTimeSeries: "",
  }),

  computed: {
    symbols() {
      if (!this.symbolsFound) return [];

      return Object.keys(this.symbolsFound).map((key) => {
        return {
          key,
          value: this.symbolsFound[key] || "n/a",
        };
      });
    },

    ...mapActions(["searchStockSeries"]),
    ...mapState(["symbolsFound"]),
  },
  methods: {
    searchTicker() {
      this.$store.dispatch("searchSymbol", this.searchValue);
    },
    setStockSeries() {
      if (this.selectedTicker && this.selectedTimeSeries) {
        this.$store.dispatch("searchStockSeries", {
          selectedTicker: this.selectedTicker,
          selectedTimeSeries: this.selectedTimeSeries,
        });
      }
    },

    setTicker(ticker) {
      this.selectedTicker = ticker;
      console.log(this.selectedTicker);
    },
    setTimeSeries(timeSeries) {
      this.selectedTimeSeries = timeSeries;
      console.log(this.selectedTimeSeries);
    },
  },
  watch: {
    searchValue() {
      // to stay within api limits search will start after 3 characters.
      if (this.searchValue.length === 0 || this.searchValue.length >= 3) {
        this.searchTicker();
      }
    },
  },
};
</script>

<style scoped></style>
