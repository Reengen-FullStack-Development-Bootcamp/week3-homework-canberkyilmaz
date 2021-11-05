<template>
  <v-app>
    <v-container>
      <v-card xs-12 lg-4 color="indigo lighten-2" dark>
        <v-card-title class="text-h5 indigo lighten-1">
          Search Stock Symbol
        </v-card-title>
        <v-card-text> Choose stock data to sea the charts. </v-card-text>
        <v-card-text>
          <v-autocomplete
            v-model="model"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            color="white"
            hide-no-data
            hide-selected
            item-text="Description"
            item-value="Stock Symbol"
            label="Stock Symbols"
            placeholder="Start typing to Search"
            prepend-icon="mdi-database-search"
            return-object
          ></v-autocomplete>
        </v-card-text>
        <v-divider></v-divider>
        <v-expand-transition>
          <v-list v-if="model" class="indigo lighten-3">
            <v-list-item v-for="(field, i) in fields" :key="i">
              <v-list-item-content>
                <v-list-item-title v-text="field.value"></v-list-item-title>
                <v-list-item-subtitle v-text="field.key"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-expand-transition>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn :disabled="!model" color="grey darken-3" @click="model = null">
            Clear
            <v-icon right> mdi-close-circle </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card-text>
        <v-form class="px-3">
          <v-text-field
            @keydown.enter.prevent="searchDaily"
            label="Search Here"
            v-model="searchValue"
          ></v-text-field>
        </v-form>
        <v-btn color="grey darken-3" @click="searchDaily">
          Search MSFT
          <v-icon right color="white"> mdi-magnify </v-icon>
        </v-btn>
      </v-card-text>
    </v-container>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    model: null,
    searchValue: "",
  }),

  computed: {
    fields() {
      if (!this.model) return [];

      return Object.keys(this.model).map((key) => {
        return {
          key,
          value: this.model[key] || "n/a",
        };
      });
    },
    items() {
      return this.entries.map((entry) => {
        const Description =
          entry.Description.length > this.descriptionLimit
            ? entry.Description.slice(0, this.descriptionLimit) + "..."
            : entry.Description;

        return Object.assign({}, entry, { Description });
      });
    },
    ...mapActions(["searchStockDaily"]),
  },
  methods: {
    searchDaily() {
      this.$store.dispatch("searchStockDaily", this.searchValue);
    },
  },

  watch: {
    search() {
      // Items have already been loaded
      if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      fetch("https://api.publicapis.org/entries")
        .then((res) => res.json())
        .then((res) => {
          const { count, entries } = res;
          this.count = count;
          this.entries = entries;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>

<style scoped></style>
