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
        <v-expansion-panels popout v-model="panels" multiple>
          <v-expansion-panel class="indigo darken-1">
            <v-expansion-panel-header>
              Search Results
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-expand-transition>
                <v-list v-if="symbols.length > 0" class="indigo lighten-3">
                  <v-list-item-group>
                    <v-list-item
                      v-for="symbol in symbols"
                      :key="symbol.value['1. symbol']"
                      @click="
                        setSymbol(symbol.value['1. symbol']);
                        setStockSeries();
                      "
                      link
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
                  </v-list-item-group>
                </v-list>
              </v-expand-transition>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
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
      <v-row justify="center" align="center">
        <v-col d-flex justify-center>
          <h3
            v-show="
              this.$store.state.selectedTicker && this.formattedTimeSeries
            "
            class="
              indigo
              lighten-2
              mt-4
              pa-2
              grey--text
              text--lighten-4 text-center
              stock-info
            "
          >
            Selected Ticker: {{ this.$store.state.selectedTicker.toUpperCase() }}
          </h3>

          <h3
            v-show="
              this.$store.state.selectedTicker && this.formattedTimeSeries
            "
            class="
              indigo
              lighten-2
              mt-1
              pa-2
              grey--text
              text--lighten-4 text-center
              stock-info
            "
          >
            Selected Frequency: {{ this.$store.state.selectedTimeSeries }}
          </h3>
        </v-col>
      </v-row>
      <!-- <template>
        <v-tabs centered color="indigo" show-arrows>
          <v-tab @click="setTimeSeries">DAILY</v-tab>
          <v-tab>WEEKLY</v-tab>
          <v-tab>MONTHLY</v-tab>
        </v-tabs>
      </template>-->
      <template>
        <v-tabs
          v-show="this.$store.state.selectedTicker && this.formattedTimeSeries"
          centered
          color="indigo lighten-2"
          show-arrows
          class="pa-4"
        >
          <v-tab
            v-for="item in items"
            :key="item"
            @click="
              setTimeSeries(item);
              setStockSeries();
            "
            >{{ item }}</v-tab
          >
        </v-tabs>
        <v-divider></v-divider>
      </template>

      <!-- <div>
        {{ formattedTimeSeries }}
      </div> -->
      <!-- <div>
        {{ this.$store.getters.timeSeriesArray }}
      </div> -->
      <router-view></router-view>
    </v-container>
  </v-app>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";

export default {
  name: "Home",
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    searchValue: "",
    search: "",
    selectedTimeSeries: "DAILY",
    panels: [],
    items: ["DAILY", "WEEKLY", "MONTHLY"],
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

    formattedTimeSeries() {
      return this.$store.getters.apiTimeSeriesFormat;
    },

    ...mapActions(["searchStockSeries"]),
    ...mapState(["symbolsFound"]),
    ...mapGetters(["apiTimeSeriesFormat", "timeSeriesArray"]),
    ...mapMutations([]),
  },

  watch: {
    searchValue() {
      // to stay within api limits search will start after 3 characters.
      if (this.searchValue.length === 0 || this.searchValue.length >= 3) {
        this.searchTicker();
      }
    },
  },
  mounted() {
    this.setStockSeries();
  },
  methods: {
    searchTicker() {
      this.$store.dispatch("searchSymbol", this.searchValue);
      if (this.searchValue.length > 0) {
        this.panels = [0];
      } else {
        this.panels = [];
      }
    },
    setSymbol(ticker) {
      this.$store.commit("SET_TICKER", ticker);
      this.panels = [];
      this.$router.push({ name: "Symbol", params: { ticker } });
      this.searchValue = "";
    },
    setTimeSeries(timeSeries) {
      this.$store.commit("SET_TIME_SERIES", timeSeries);
    },
    setStockSeries() {
      if (this.$store.state.selectedTicker && this.formattedTimeSeries) {
        this.$store.dispatch("searchStockSeries", {
          selectedTicker: this.$store.state.selectedTicker,
          selectedTimeSeries: this.formattedTimeSeries,
        });
        // console.log(this.$store.state.stockDataSeries);
        // console.log("get", this.$store.getters.timeSeriesArray);
      }
    },
  },
};
</script>

<style scoped>

.stock-info {
  border-radius: 0.5rem;
}

</style>
