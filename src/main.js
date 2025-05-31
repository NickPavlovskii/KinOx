import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
import '../style/main.css';
import { createPinia } from 'pinia'
// PrimeVue
import PrimeVue from 'primevue/config';
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import GlobalComponents from './components/global/index'

import vuetify from './plugins/vuetify';

const app = createApp(App);
const pinia = createPinia()
app.use(pinia)
app.use(router);
app.use(store);
app.use(PrimeVue);
app.use(vuetify);
app.use(GlobalComponents)

app.mount('#app');
