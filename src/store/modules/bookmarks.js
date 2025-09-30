import { supabase } from '@/supabase'

export default {
  namespaced: true,
  state: {
    bookmarks: [],
  },
  mutations: {
    SET_BOOKMARKS(state, bookmarks) {
      state.bookmarks = bookmarks
    },
    ADD_BOOKMARK(state, movieId) {
      if (!state.bookmarks.includes(movieId)) {
        state.bookmarks.push(movieId)
      }
    },
    REMOVE_BOOKMARK(state, movieId) {
      state.bookmarks = state.bookmarks.filter(id => id !== movieId)
    },
  },
  actions: {
    async loadBookmarks({ commit }) {
      try {
        const { data, error } = await supabase
          .from('bookmarks')
          .select('movie_id')

        if (error) throw error

        commit(
          'SET_BOOKMARKS',
          data.map(b => b.movie_id)
        )
      } catch (err) {
        console.error('Ошибка загрузки закладок:', err.message)
      }
    },

    async toggleBookmark({ state, commit }, movieId) {
      try {
        if (state.bookmarks.includes(movieId)) {
          const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('movie_id', movieId)

          if (error) throw error
          commit('REMOVE_BOOKMARK', movieId)
          console.log('Закладка удалена:', movieId)
        } else {
          // 🔹 Иначе → добавляем
          const { data, error } = await supabase
            .from('bookmarks')
            .insert([{ movie_id: movieId }])
            .select()

          if (error) throw error
          commit('ADD_BOOKMARK', movieId)
          console.log('Закладка добавлена:', data)
        }
      } catch (err) {
        console.error('Ошибка при изменении закладки:', err.message)
      }
    },
  },
}
