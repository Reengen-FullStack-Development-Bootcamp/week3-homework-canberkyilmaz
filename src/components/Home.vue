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
                      @click="setTicker(symbol.value['1. symbol'])"
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
      <v-row>
        <v-col>
          <h4>Selected Ticker: {{ selectedTicker }}</h4>
          <h4>Selected Frequency: {{ selectedTimeSeries }}</h4>
        </v-col>
      </v-row>
      <template>
        <v-tabs centered color="indigo" show-arrows>
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
      </template>
      <DrawChart :timeSeries="selectedTimeSeries" />
    </v-container>
  </v-app>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import DrawChart from "@/components/DrawChart.vue";

export default {
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    model: null,
    searchValue: "",
    search: "",
    selectedTicker: "AMZN",
    items: ["DAILY", "WEEKLY", "MONTHLY"],
    selectedTimeSeries: "DAILY",
    panels: [],
  }),
  components: { DrawChart },

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
    ...mapGetters(["getFrequencyTag"]),
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
      this.panels = [];
    },
    setTimeSeries(timeSeries) {
      this.selectedTimeSeries = timeSeries;
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
