
import KinoCarousel from './MovieCarousel.vue'
import MovieCard from './MovieCard.vue'
import MovieButton from './MovieButton.vue'
import MovieNotification from './MovieNotification.vue'
import MovieGenres from './MovieGenres.vue'
import MovieSearchBox from './MovieSearch.vue'
import BaseLoader from './BaseLoader.vue'
import SocialLinksPanel from './SocialLinksPanel.vue'

const components = [
  { name: 'kinox-carousel', component: KinoCarousel },
  { name: 'kinox-movie-card', component: MovieCard },
  { name: 'Kinox-movie-button', component: MovieButton },
  { name: 'Kinox-notification', component: MovieNotification },
  { name: 'Kinox-genres', component: MovieGenres },
  { name: 'Kinox-search-box', component: MovieSearchBox },
  { name: 'Kinox-loader', component: BaseLoader },
  { name: 'Kinox-social-links', component: SocialLinksPanel },
]

export default {
  install(app) {
    components.forEach(({ name, component }) => {
      app.component(name, component)
    })
  },
}
