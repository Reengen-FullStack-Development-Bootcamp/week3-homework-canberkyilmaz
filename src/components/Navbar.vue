<template>
  <nav>
    <v-app-bar app text color="indigo" dark>
      <v-toolbar-title
        class="text-uppercase grey--text text--lighten-2 d-none d-sm-flex"
      >
        <span class="font-weight-light">Canberk</span>
        <span class="font-weight-bold">Yılmaz</span>
      </v-toolbar-title>
      <v-spacer class="d-none d-sm-flex"></v-spacer>
      <v-toolbar-items>
        <v-btn text to="/" class="text-uppercase grey--text text--lighten-4">
          HOME
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items>
        <v-btn
          text
          to="/about"
          class="text-uppercase grey--text text--lighten-4"
        >
          ABOUT
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items>
        <v-btn
          text
          to="/search"
          class="text-uppercase grey--text text--lighten-4"
        >
          SEARCH
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </nav>
</template>

<script>
export default {};
</script>

<style scoped></style>
