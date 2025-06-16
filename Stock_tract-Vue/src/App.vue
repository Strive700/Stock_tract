<script setup lang="ts">
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import UserDropdown from './components/UserDropdown.vue'
const route = useRoute()
</script>

<template>
  <div class="app-layout">
    <div class="top-bar" v-if="!['/login', '/register', '/'].includes(route.path)">
      <UserDropdown class="user-dropdown-container" />
    </div>
    <Sidebar v-if="!['/login', '/register', '/'].includes(route.path)" />
    <div :class="['main-content', { 'full': ['/login', '/register', '/'].includes(route.path) }]">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow-x: hidden;
}
html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
.top-bar {
  position: fixed;
  top: 0;
  right: 0;
  left: 220px;
  width: calc(100% - 220px);
  height: 64px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 24px;
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease, width 0.3s ease;
}

.main-content {
  position: absolute;
  box-sizing: border-box;
  transition: all 0.3s ease;
  overflow-y: auto;
  background-color: #f5f7fa;
}

.main-content:not(.full) {
  top: 64px;
  left: 220px;
  width: calc(100% - 220px);
  height: calc(100vh - 64px);
  padding: 30px;
}

.main-content.full {
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  padding: 0;
  background: none;
}

.user-dropdown-container {
  margin-left: auto;
}

@media (max-width: 1024px) {
  .top-bar {
    padding: 0 20px;
  }
  .main-content:not(.full) {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .top-bar {
    left: 0;
    width: 100%;
    padding: 0 15px;
  }
  .main-content:not(.full) {
    top: 64px;
    left: 0;
    width: 100%;
    height: calc(100vh - 64px);
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .top-bar {
    padding: 0 10px;
  }
  .main-content:not(.full) {
    padding: 10px;
  }
}
</style>
