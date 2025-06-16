import { defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { ref } from 'vue'
import request from '@/utils/request'

interface User {
  userId: string
  nickName: string
  name: string
  phone: string
  sex: string
  role: string
  createTime: string
  status: string
  accountId: string
  avatar?: string
  email: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: ref<User | null>(null),
    account: {
      accountId: '',
      asset: '',
      marketValue: '',
      moneyRest: ''
    }
  }),
  actions: {
    setUser(userData: User) {
      this.user = userData
    },
    setAccount(account: any) {
      this.account = { ...this.account, ...account }
    },
    reset() {
      this.user = null
      this.account = {
        accountId: '', asset: '', marketValue: '', moneyRest: ''
      }
    },
    async logout() {
      try {
        await request.post('/logout')
        this.reset()
      } catch (error) {
        throw error
      }
    }
  }
})