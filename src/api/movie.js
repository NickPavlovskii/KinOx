import axios from 'axios'

export default function movieModule(
    api = axios.create({ baseURL: 'http://localhost:3001' })
) {
    return {
        loadMovieList() {
            return api.get('/movies')
        },
        loadMovieById(id) {
            return api.get(`/movies/${id}`)
        },
        loadMoviesByGenre(genre) {
            return api.get(`/movies?genre=${encodeURIComponent(genre)}`)
        },
        loadMoviesByType(type) {
            // например movie / cartoon / tv-series
            return api.get(`/movies?type=${encodeURIComponent(type)}`)
        },
    }
}
