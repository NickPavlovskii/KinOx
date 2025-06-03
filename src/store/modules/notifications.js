import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notifications', {
    state: () => ({
        messages: [],
    }),
    actions: {
        show({ type, text }) {
            const id = Date.now()
            this.messages.push({ id, type, text })

            setTimeout(() => {
                this.remove(id)
            }, 3000)
        },
        remove(id) {
            this.messages = this.messages.filter((msg) => msg.id !== id)
        },
    }
})
