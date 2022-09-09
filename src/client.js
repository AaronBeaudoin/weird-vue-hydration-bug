import { createSSRApp } from "vue";
import AppComponent from "./App.vue";

const app = createSSRApp(AppComponent);
app.mount("#app");
