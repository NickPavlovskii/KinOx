import { supabase } from '@/supabase'

export default {
    namespaced: true,
    state: {
        ratings: {}, // { movieId: rating }
        ratedMovies: [], // [{ movie, rating }]
    },
    mutations: {
        SET_RATINGS(state, ratedMovies) {
            state.ratedMovies = ratedMovies
            state.ratings = ratedMovies.reduce((acc, { movie, rating }) => {
                acc[movie.id] = rating
                return acc
            }, {})
        },
        UPDATE_RATING(state, { movieId, rating }) {
            const movie = state.ratedMovies.find(m => m.movie.id === movieId)
            if (movie) {
                movie.rating = rating
            } else {
                // если фильм ещё не был в ratedMovies, добавляем его
                state.ratedMovies.push({ movie: { id: movieId }, rating })
            }
            state.ratings[movieId] = rating
        },
        REMOVE_RATING(state, movieId) {
            state.ratedMovies = state.ratedMovies.filter(r => r.movie.id !== movieId)
            delete state.ratings[movieId]
        },
    },
    actions: {
        async loadRatings({ commit, dispatch }) {
            try {
                const { data: ratings, error } = await supabase
                    .from('ratings')
                    .select('movie_id, rating')
                if (error) throw error

                if (!ratings?.length) {
                    commit('SET_RATINGS', [])
                    return
                }

                // Загружаем фильмы по ID
                const movies = await Promise.all(
                    ratings.map(r =>
                        dispatch('movie/fetchMovieById', r.movie_id, { root: true }).then(movie => ({
                            movie,
                            rating: Number(r.rating) || 0
                        }))
                    )
                )

                commit('SET_RATINGS', movies)
            } catch (err) {
                console.error('Ошибка загрузки оценок:', err.message)
            }
        },

        async saveRating({ commit }, { movieId, rating }) {
            try {
                const { data, error } = await supabase
                    .from('ratings')
                    .upsert(
                        { movie_id: movieId, rating },
                        { onConflict: 'movie_id' } // ⚠️ ключ для обновления
                      )
                    
                    .select()
                    .single()
                if (error) throw error

                commit('UPDATE_RATING', { movieId, rating: data.rating })
            } catch (err) {
                console.error('Ошибка сохранения рейтинга:', err.message)
            }
        },

        async deleteRating({ commit }, movieId) {
            try {
                const { error } = await supabase
                    .from('ratings')
                    .delete()
                    .eq('movie_id', movieId)
                if (error) throw error
                commit('REMOVE_RATING', movieId)
            } catch (err) {
                console.error('Ошибка удаления рейтинга:', err.message)
            }
        },
    },
    getters: {
        ratedMovies: (state) => state.ratedMovies,
    },
}
