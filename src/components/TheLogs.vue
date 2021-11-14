<template>
  <div>
    <div v-if="authorized">
      <!-- No log Container -->
      <div v-if="items.length === 0" class="empty-log">
        <p>There are no logs.</p>
      </div>
      <!-- Remove Button -->
      <v-btn class="ma-5 indigo white--text" v-if="items.length > 0" @click="removeAllLogs"
        >Remove All Logs</v-btn
      >
      <!-- Logs Treeview -->
      <v-treeview hoverable class="ml-5 pl-5" open-on-click :items="items" v-if="authorized">
        <template #label="data" style="">
          <div
            :style="{
              'color': data.item.authorized ? 'black' : 'red',
              'font-weight': data.item.authorized ? 'normal' : 'bold',
            }"
          >
            {{ data.item.name }}
          </div>
        </template>
      </v-treeview>
    </div>
    <div v-else class="guest">You are not authorized to view this page</div>
    <!-- Snackbar -->
    <v-snackbar v-model="showAlert" :color="authorized ? 'white' : 'indigo'"
      >Please login as an admin to see logs.
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="showAlert = false">
          Close
        </v-btn>
      </template></v-snackbar
    >
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    items: [], // Logs array coming from localstorage.
    showAlert: false, // Show or hide alert.
    authorized: true, // Control that user is admin.
  }),
  computed: {
    ...mapGetters(["getUserStatus"]),
  },
  created() {
    // Get logs from localstorage.
    const logs = JSON.parse(localStorage.getItem("routingHistory"));
    if (logs) {
      this.items = [
        ...logs.map((item, i) => ({
          id: i,
          name: `${new Date(item.date).toLocaleString()} ${
            !item.authorized ? " - Failed" : ""
          }`,
          authorized: item.authorized,
          children: [
            { name: `From: ${item.from}`, authorized: item.authorized },
            { name: `To: ${item.to}`, authorized: item.authorized },
            { name: `Auth: ${item.authorized}`, authorized: item.authorized },
          ],
        })),
      ];
    }
  },
  mounted() {
    if (!this.getUserStatus) {
      this.showAlert = true;
      this.authorized = false;
    }
  },
  methods: {
    // Remove all logs in localstorage.
    removeAllLogs() {
      localStorage.removeItem("routingHistory");
      this.items = [];
    },
  },
  watch: {
    getUserStatus(val) {
      this.showAlert = !val;
      this.authorized = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.empty-log {
  width: 100%;
  height: 100vh;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
}
.guest {
  width: 100%;
  height: 100vh;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
