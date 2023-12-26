import { createApp } from 'vue'
import './style.css'
import App from './App.vue';

// Add a new div with id 'ooze' to the body
const ooze = document.createElement('div');
ooze.id = 'ooze';
document.body.appendChild(ooze);

createApp(App).mount('#ooze');
