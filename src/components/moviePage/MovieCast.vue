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
          <div class="cast-avatar-wrap">
            <div
              v-show="!photoLoaded[item._id]"
              class="cast-photo-skeleton"
            />
            <v-avatar size="150">
              <img
                v-show="photoLoaded[item._id]"
                :src="item.photo?.url"
                :alt="item.name"
                @load="onCastPhotoLoad(item._id)"
              />
            </v-avatar>
          </div>
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
    data() {
      return {
        photoLoaded: {},
      }
    },
    methods: {
      onCastPhotoLoad(id) {
        this.photoLoaded = { ...this.photoLoaded, [id]: true }
      },
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

  .cast-avatar-wrap {
    position: relative;
    margin-bottom: 8px;
    width: 150px;
    height: 150px;
  }

  .cast-photo-skeleton {
    position: absolute;
    inset: 0;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: cast-skeleton-shine 1.2s ease-in-out infinite;
  }

  .cast-avatar-wrap :deep(.v-avatar) {
    position: relative;
  }

  .cast-avatar-wrap :deep(.v-avatar img) {
    border-radius: 50%;
  }

  @keyframes cast-skeleton-shine {
    to {
      background-position: 200% 0;
    }
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
  @media (max-width: 1800px) {

    :deep(.v-slide-group) {
      width: 100% !important;
    }
  }
</style>
