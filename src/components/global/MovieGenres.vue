<template>
  <div class="genres">
    <span
      v-for="genre in genres"
      class="genre"
      :key="genre"
    >
      {{ genre }}
    </span>
  </div>
</template>

<script>
  export default {
    name: 'UiGenres',
    props: {
      genres: {
        type: Array,
        required: true,
      },
    },
  }
</script>

<style scoped>
  .genres {
    display: flex;
    gap: 5px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }

  .genre {
    background-color: #da2f68;
    padding: 3px 5px;
    font-size: 12px;
    border-radius: 4px;
    color: white;
    white-space: nowrap;
    transition: background-color 0.3s ease, transform 0.3s ease;
    cursor: pointer;
  }
  .genre:hover {
    background-color: #c0265c;
    transform: scale(1.05);
  }
</style>
