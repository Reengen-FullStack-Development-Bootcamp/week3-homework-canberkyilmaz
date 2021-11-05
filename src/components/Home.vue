<template>
  <v-container>
    <v-row class="text-center justify-center">
      <v-col cols="6">
        {{ title }}

        <v-text-field
          class="text-align"
          v-model="value"
          type="number"
          @keydown.enter.prevent="getNumSum"
        >
        </v-text-field>

        <v-btn @click="getNumSum">Get Sum</v-btn>
        <div>Toplam: {{ calNumber }}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      value: 0,
    };
  },
  computed: {
    title() {
      return this.$store.state.title;
    },
    calNumber() {
      return this.$store.state.number;
    },
  },
  methods: {
    getNumSum() {
      this.$store.dispatch("getNumber", parseInt(this.value));
    },
  },
};
</script>
