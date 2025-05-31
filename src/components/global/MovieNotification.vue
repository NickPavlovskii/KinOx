<template>
    <div class="notifications">
      <transition-group name="fade" tag="div">
        <div
          v-for="msg in notificationStore.messages"
          :key="msg.id"
          class="notification"
          :class="`notification--${msg.type}`"
        >
          <div class="notification__indicator" :class="`indicator--${msg.type}`"></div>
          <div class="notification__content">
            <font-awesome-icon :icon="getIcon(msg.type)" class="notification__icon" />
            <span class="notification__text">{{ msg.text }}</span>
          </div>
          <button class="notification__close" @click="notificationStore.remove(msg.id)">×</button>
        </div>
      </transition-group>
    </div>
  </template>
  
  <script>
  import { useNotificationStore } from '@/store/notifications'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import {
    faCheckCircle,
    faExclamationTriangle,
    faTimesCircle,
    faInfoCircle,
  } from '@fortawesome/free-solid-svg-icons'
  import { library } from '@fortawesome/fontawesome-svg-core'

  
  library.add(faCheckCircle, faExclamationTriangle, faTimesCircle, faInfoCircle)
  
  export default {
    name: 'UiNotification',
    components: {
      FontAwesomeIcon,
    },
    setup() {
      const notificationStore = useNotificationStore()

  
      const getIcon = (type) => {
        switch (type) {
          case 'success':
            return 'fa-solid fa-check-circle'
          case 'error':
            return 'fa-solid fa-times-circle'
          case 'warning':
            return 'fa-solid fa-exclamation-triangle'
          case 'info':
          default:
            return 'fa-solid fa-info-circle'
        }
      }
  
      return {
        notificationStore,
        getIcon,
      }
    },
  }
  </script>
  
  <style scoped>
  .notifications {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 360px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 9999;
  }
  
  .notification {
    display: flex;
    align-items: center;
    background-color: #2a2a2a;
    color: #fff;
    border-radius: 12px;
    padding: 14px 18px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    position: relative;
    overflow: hidden;
    gap: 12px;
  }
  
  .notification__indicator {
    width: 5px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }
  
  .indicator--success {
    background-color: #4caf50;
  }
  
  .indicator--error {
    background-color: #f44336;
  }
  
  .indicator--warning {
    background-color: #ff9800;
  }
  
  .indicator--info {
    background-color: #2196f3;
  }
  
  .notification__icon {
    font-size: 1.4rem;
  }
  
  .notification__content {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 12px;
  }
  
  .notification__text {
    font-size: 0.95rem;
    line-height: 1.4;
    flex: 1;
  }
  
  .notification__close {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: inherit;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  .notification__close:hover {
    transform: scale(1.2);
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
  </style>
  