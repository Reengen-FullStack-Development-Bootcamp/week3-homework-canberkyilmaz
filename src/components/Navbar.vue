<template>
  <nav>
    <v-app-bar app text color="indigo" dark>
      <v-toolbar-title class="logo text-uppercase grey--text text--lighten-2">
        <span class="font-weight-light">Canberk</span>
        <span class="font-weight-bold">Yılmaz</span>
      </v-toolbar-title>
      <v-layout justify-end class="d-flex d-sm-none">
        <v-app-bar-nav-icon
          @click="drawer = true"
          class="d-flex d-sm-none"
        ></v-app-bar-nav-icon>
      </v-layout>
      <v-spacer class="d-none d-sm-flex"></v-spacer>
      <v-toolbar-items class="d-none d-sm-flex">
        <v-btn text to="/" class="text-uppercase grey--text text--lighten-4">
          HOME
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items class="d-none d-sm-flex">
        <v-btn
          text
          to="/about"
          class="text-uppercase grey--text text--lighten-4"
        >
          ABOUT
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items
        v-if="$store.state.userStatus === 'Admin'"
        class="d-none d-sm-flex"
      >
        <v-btn
          text
          to="/logs"
          class="text-uppercase grey--text text--lighten-4"
        >
          Logs
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items class="admin-switch">
        <v-switch
          @click="setUserLevel"
          v-model="isAdmin"
          true-value="Admin"
          false-value="Guest"
        >
          <template v-slot:label>
            <span>{{ isAdmin }}</span>
          </template>
        </v-switch>
      </v-toolbar-items>
      <!-- <v-toolbar-items>
        <v-btn
          text
          to="/search"
          class="text-uppercase grey--text text--lighten-4"
        >
          SEARCH
        </v-btn>
      </v-toolbar-items> -->
      <div>{{ isAdmin.false }}</div>
    </v-app-bar>
    <!-- Add a navigation bar -->
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group>
          <v-list-item to="/"> HOME </v-list-item>
          <v-list-item to="/about"> ABOUT </v-list-item>
          <v-list-item v-if="$store.state.userStatus === 'Admin'" to="/logs">
            LOGS
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <!-- Navigation bar ends -->
  </nav>
</template>

<script>
import { mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      drawer: false,
      isAdmin: "Admin",
    };
  },
  methods: {
    ...mapActions(["setUser"]),
    ...mapMutations(["SET_USER_STATUS"]),
    setUserLevel() {
      this.setUser(this.isAdmin);
    },
  },
  created() {
    this.setUserLevel()
  }
};
</script>

<style scoped>
.admin-switch {
  position: fixed;
  margin-top: 10px;
}
.logo {
  margin-top: 20px;
}
</style>
