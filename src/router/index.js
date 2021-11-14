import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    children: [
      {
        path: "/symbol/:ticker",
        name: "Symbol",
        component: () =>
          import(
            /* webpackChunkName: "DrawChart" */ "../components/DrawChart.vue"
          ),
      },
    ],
  },
  {
    path: "/logs",
    name: "Logs",
    component: () => import(/* webpackChunkName: "Logs" */ "../views/Logs.vue"),
  },
  {
    path: "/404",
    alias: "*",
    name: "notFound",
    component: () =>
      import(/* webpackChunkName: "NotFound" */ "../views/NotFound.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const history = localStorage.getItem("routingHistory")
    ? JSON.parse(localStorage.getItem("routingHistory"))
    : [];

  const routeChanges = {
    from: from.fullPath,
    to: to.fullPath,
    date: new Date(),
    authorized: to.name === "Logs" ? store.getters.getUserStatus : true,

  };

  // console.log("route", routeChanges)
  history.push(routeChanges);
  localStorage.setItem("routingHistory", JSON.stringify([...history]));
  next();
});

export default router;
