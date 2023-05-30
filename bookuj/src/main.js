import { createApp } from "vue";
import "./style.css";
import router from "./Router";
import App from "./App.vue";
import { setupCalendar, Calendar, DatePicker } from "v-calendar";
import "v-calendar/style.css";

createApp(App).use(router).use(setupCalendar, {}).mount("#app");
