import { createStore } from 'vuex';
import sortingModule from './modules/sorting';
import movie from './modules/movie';
import bookmarks from './modules/bookmarks';
import ratings from './modules/ratings';

const store = createStore({
  modules: {
    sorting: sortingModule,
    movie: movie,
    bookmarks: bookmarks,
    ratings: ratings
  },

});

export default store;
