import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Profile from "../views/Profile.vue";
import EmailConfirmation from "../views/EmailConfirmation.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    { path: "/profile/:username", name: "profile", component: Profile },
    { path: "/emailConfirmationPage", name: "emailConfirmation", component: EmailConfirmation },
  ],
});

export default router;
