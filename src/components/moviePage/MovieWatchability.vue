<template>
  <div
    v-if="items && items.length"
    class="watchability"
  >
    <p class="watchability-heading">Доступно на:</p>
    <ul class="watchability-list">
      <li
        v-for="item in items"
        :key="item._id"
      >
        <a
          target="_blank"
          :href="item.url"
          class="watchability-link"
        >
          <div
            v-show="!logoLoaded[item._id]"
            class="watchability-logo-skeleton"
          />
          <img
            v-show="logoLoaded[item._id]"
            class="watchability-logo"
            :src="item.logo?.url"
            :alt="item.name"
            @load="onLogoLoad(item._id)"
          />
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      items: Array,
    },
    data() {
      return {
        logoLoaded: {},
      }
    },
    methods: {
      onLogoLoad(id) {
        this.logoLoaded = { ...this.logoLoaded, [id]: true }
      },
    },
  }
</script>

<style>
  .watchability-heading {
    font-size: 20px;
    color: white;
    margin-bottom: 25px;

    font-family: cursive;
    letter-spacing: 0.1em;
  }

  .watchability {
    position: relative;
    bottom: 70px;
  }

  .watchability-list {
    display: flex;
    gap: 20px;
    overflow-y: hidden;
    margin: 0 -20px;
    padding: 0 20px;
    list-style-type: none;
    overflow-x: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    scroll-behavior: smooth;
  }

  .watchability-list::-webkit-scrollbar {
    height: 8px;
  }

  .watchability-link {
    position: relative;
    display: block;
  }

  .watchability-logo-skeleton {
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: logo-skeleton-shine 1.2s ease-in-out infinite;
  }

  .watchability-logo {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 15px;
    transition: transform 0.3s ease;
    object-fit: cover;
  }

  @keyframes logo-skeleton-shine {
    to {
      background-position: 200% 0;
    }
  }
  .cast-logo {
    width: 100px;
    height: 100px;
    background-size: cover;
    background-position: center;
    border-radius: 50%;
  }

  .cast-logo img {
    width: 80%;
    height: 80%;
    object-fit: cover;
    object-position: center top;
    display: block;
  }

  .watchability-logo:hover {
    transform: scale(1.05);
  }

  .watchability-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
    display: block;
    transition: transform 0.3s ease;
  }

  @media (max-width: 920px) {
    .watchability-list {
      gap: 10px;
    }
  }
</style>
