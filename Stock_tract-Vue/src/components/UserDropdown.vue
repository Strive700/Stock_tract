<template>
  <div class="user-dropdown">
    <div class="user-trigger" @click="toggleDropdown">
      <div class="avatar">
        <img v-if="user?.avatar" :src="`/avatar/${user?.avatar}?t=${Date.now()}`" :alt="user?.nickName || user?.name">
        <i v-else class="fas fa-user"></i>
      </div>
      <span class="username">{{ user?.nickName || user?.name || '未登录' }}</span>
      <i class="fas fa-chevron-down" :class="{ 'rotate': showDropdown }"></i>
    </div>
    
    <div class="dropdown-menu" v-show="showDropdown" @click.stop>
      <div class="menu-item" @click="navigateTo('/user')">
        <i class="fas fa-user"></i>
        <span>个人信息</span>
      </div>
      <div class="menu-item" @click="navigateTo('/account')">
        <i class="fas fa-chart-line"></i>
        <span>账户信息</span>
      </div>
      <div class="menu-divider"></div>
      <div class="menu-item logout-item" @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
        <span>退出登录</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'
import request from '../utils/request'
import { useToast } from 'vue-toastification'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()
const { user } = storeToRefs(userStore)
const showDropdown = ref(false)

const fetchUserInfo = async () => {
  try {
    const response = await request.get('/isLogin')
    if (response.data && response.data.user) {
      userStore.setUser(response.data.user)
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error)
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-dropdown')) {
    showDropdown.value = false
  }
}

const navigateTo = (path: string) => {
  router.push(path)
  showDropdown.value = false
}

const handleLogout = async () => {
  try {
    await userStore.logout()
    toast.success('退出登录成功')
    router.push('/login')
  } catch (error) {
    toast.error('退出登录失败')
  }
  showDropdown.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchUserInfo()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.user-dropdown {
  position: relative;
  display: inline-block;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  cursor: pointer;
  color: #090909;
  font-size: 14px;
  background: transparent;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.user-trigger:hover {
  background: rgba(255, 255, 255, 0.1);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar i {
  color: #fff;
  font-size: 16px;
}

.avatar img[alt] {
  color: #000;
}

.username {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-trigger i.fa-chevron-down {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.user-trigger i.fa-chevron-down.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  z-index: 1000;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f8f9fa;
}

.menu-item i {
  color: #1890ff;
  width: 16px;
}

.menu-item span {
  color: #2c3e50;
  font-size: 14px;
}

.menu-divider {
  height: 1px;
  background-color: #e8e8e8;
  margin: 4px 0;
}

.logout-item {
  color: #ff4d4f;
}

.logout-item i {
  color: #ff4d4f;
}

.logout-item:hover {
  background-color: #fff1f0;
}
</style> 