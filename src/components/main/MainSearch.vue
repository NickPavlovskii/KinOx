<template>
  <div class="searchInput">
    <input
      v-model="searchQuery"
      class="search-input"
      type="text"
      placeholder="Поиск фильма"
      @input="handleInput"
      @keydown.enter="handleEnter"
    />
    <button
      class="search-button"
      @click="goToSearch"
    >
      Поиск
    </button>
  </div>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex'

  export default {
    data() {
      return {
        searchQuery: '',
      }
    },
    methods: {
      ...mapActions('movie', ['searchMovies']),
      ...mapMutations('movie', ['setSearchQuery']),

      handleInput() {
        this.setSearchQuery(this.searchQuery)
        this.searchMovies()
      },
      handleEnter() {
        this.setSearchQuery(this.searchQuery)
        this.searchMovies()
        this.$router.push('/search')
      },
      goToSearch() {
        this.setSearchQuery(this.searchQuery)
        this.searchMovies()
        this.$router.push('/search')
      },
    },
  }
</script>

<style scoped>
  <style scoped > .searchInput {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .search-input {
    width: calc(100% - 100px);
    height: 50px;
    background-color: white;
    outline: 0;
    border: 0;
    border-radius: 30px 0 0 30px;
    padding: 0 15px;
    font-size: 14px;
  }

  .search-button {
    width: 100px;
    height: 50px;
    background: linear-gradient(98.37deg, #f89e00 0.99%, #da2f68 100%);
    color: white;
    outline: 0;
    border: 0;
    border-radius: 0 30px 30px 0;
    font-size: 16px;
    cursor: pointer;
  }
</style>
