<template>
  <div
    class="watchability"
    v-if="items && items.length"
  >
    <p class="watchability-heading">Доступно на:</p>
    <ul class="watchability-list">
      <li
        v-for="item in items"
        :key="item._id"
      >
        <a
          :href="item.url"
          target="_blank"
        >
          <img
            :src="item.logo.url"
            :alt="item.name"
            class="watchability-logo"
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

  .watchability-logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 15px;
    transition: transform 0.3s ease;
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
</style>
