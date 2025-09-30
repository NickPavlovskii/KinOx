import { supabase } from '@/supabase'

export default {
    namespaced: true,
    state: {
        ratings: {}, // { movieId: rating }
    },
    mutations: {
        SET_RATING(state, { movieId, rating }) {
            state.ratings = { ...state.ratings, [movieId]: rating }
        },
        SET_RATINGS(state, ratings) {
            state.ratings = ratings
        },
        REMOVE_RATING(state, movieId) {
            const newRatings = { ...state.ratings }
            delete newRatings[movieId]
            state.ratings = newRatings
        },
    },
    actions: {
        // загрузка всех рейтингов из БД
        async loadRatings({ commit }) {
            try {
                const { data, error } = await supabase
                    .from('ratings')
                    .select('movie_id, rating')

                if (error) throw error

                if (data) {
                    const ratingsMap = {}
                    data.forEach(({ movie_id, rating }) => {
                        ratingsMap[movie_id] = rating
                    })
                    commit('SET_RATINGS', ratingsMap)
                }
            } catch (err) {
                console.error('Ошибка загрузки всех рейтингов:', err.message)
            }
        },

        // загрузка рейтинга одного фильма
        async loadRating({ commit }, movieId) {
            try {
                const { data, error } = await supabase
                    .from('ratings')
                    .select('rating')
                    .eq('movie_id', movieId)
                    .single()

                if (error && error.code !== 'PGRST116') throw error
                if (data) {
                    commit('SET_RATING', { movieId, rating: data.rating })
                }
            } catch (err) {
                console.error('Ошибка загрузки рейтинга:', err.message)
            }
        },

        // сохранить или обновить рейтинг
        async saveRating({ commit }, { movieId, rating }) {
            try {
                const { data, error } = await supabase
                    .from('ratings')
                    .upsert({ movie_id: movieId, rating })
                    .select()
                    .single()

                if (error) throw error
                commit('SET_RATING', { movieId, rating: data.rating })
            } catch (err) {
                console.error('Ошибка сохранения рейтинга:', err.message)
            }
        },

        // удалить рейтинг
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
        ratedMovies: (state, getters, rootState) => {
            return rootState.movie.movies
                .map((m) => ({
                    ...m,
                    rating: state.ratings[m.id] || null,
                }))
                .filter((m) => m.rating !== null)
        },
    },
}
