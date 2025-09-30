import { supabase } from '@/supabase'

export default {
    namespaced: true,
    state: {
        ratings: {},
    },
    mutations: {
        SET_RATING(state, { movieId, rating }) {
            state.ratings = { ...state.ratings, [movieId]: rating }
        },
        REMOVE_RATING(state, movieId) {
            const newRatings = { ...state.ratings }
            delete newRatings[movieId]
            state.ratings = newRatings
        }
          
    },
    actions: {
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
}
