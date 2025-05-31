
import KinoCarousel from './KinoCarousel.vue'
import MovieCard from './MovieCard.vue'
import MovieButton from './MovieButton.vue'
import MovieNotification from './MovieNotification.vue'
import MovieGenres from './MovieGenres.vue'
const components = [
  { name: 'kinox-carousel', component: KinoCarousel },
  { name: 'Kinox-movie-card', component: MovieCard },
  { name: 'Kinox-movie-button', component: MovieButton },
  { name: 'Kinox-notification', component: MovieNotification },
  { name: 'Kinox-genres', component: MovieGenres },
]

export default {
  install(app) {
    components.forEach(({ name, component }) => {
      app.component(name, component)
    })
  },
}
