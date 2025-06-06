<template>
  <div class="container">
    <h2>Подборки</h2>
    <v-row
      class="category-row"
      justify="center"
    >
      <v-col
        v-for="(item, i) in genres"
        :key="i"
        cols="6"
        sm="3"
      >
        <div
          class="category-card"
          @click="goToGenre(item.path)"
        >
          <v-img
            class="rounded-lg"
            height="100"
            cover
            :src="item.image"
          />
          <div class="category-title">
            {{ item.title }}
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const goToGenre = (path) => {
    router.push(`/${path}`)
  }

  const genres = [
    { title: 'Комедия', path: 'Comedy', image: '/genres/comedy.jpg' },
    { title: 'Триллер', path: 'Thriller', image: '/genres/Thriller.jpg' },
    { title: 'Драма', path: 'Drama', image: '/genres/drama.jpeg' },
    { title: 'Фантастика', path: 'Fantasy', image: '/genres/fantasy.jpeg' },
    { title: 'Фэнтези', path: 'Fiction', image: '/genres/fiction.PNG' },
    {
      title: 'Приключения',
      path: 'Adventures',
      image: '/genres/Adventures.jpg',
    },
    { title: 'Преступления', path: 'Crime', image: '/genres/Crime.jpg' },
    { title: 'Семейные', path: 'Family', image: '/genres/Family.jpg' },
  ]
</script>

<style scoped>
  .category-row {
    padding: 1rem 0;
  }
  .category-card {
    border-radius: 12px;
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    transition: border 0.3s;
    position: relative;
  }
  .category-card:hover {
    border-color: #00bcd4;
  }
  .category-title {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    padding: 8px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-weight: bold;
  }
</style>
