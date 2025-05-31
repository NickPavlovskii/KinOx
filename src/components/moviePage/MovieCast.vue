<template>
  <div
    class="cast"
    v-if="cast?.length"
  >
    <h3 class="watchability-heading">Каст:</h3>
    <v-slide-group show-arrows>
      <v-slide-item
        v-for="item in cast"
        :key="item._id"
      >
        <div class="cast-item">
          <v-avatar size="150">
            <img
              :src="item.photo.url"
              :alt="item.name"
            />
          </v-avatar>
          <span>{{ item.name }}</span>
          <span class="text">{{ item.role }}</span>
        </div>
      </v-slide-item>
    </v-slide-group>
  </div>
</template>

<script>
  export default {
    props: {
      cast: Array,
    },
  }
</script>

<style scoped lang="scss">
  .cast {
    margin-bottom: 40px;
  }

  .watchability-heading {
    font-size: 28px;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 20px;
    background: linear-gradient(90deg, #ffe20d, #ff7f0a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    letter-spacing: 1px;
  }

  .cast-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 16px;
    min-width: 150px;
    text-align: center;
  }

  .cast-item .text {
    font-size: 0.9rem;
    color: #ccc;
  }
  :deep(.v-slide-group) {
    width: 105%;
  }
</style>
