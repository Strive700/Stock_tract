<template>
  <div class="widget news-widget">
    <div class="widget-header">
      <h3>最新资讯</h3>
      <button class="refresh-btn" @click="fetchNews" :disabled="isLoading">
        <i class="fas fa-sync-alt" :class="{ 'rotating': isLoading }"></i>
        刷新
      </button>
    </div>
    <div class="widget-content">
      <ul class="news-list">
        <li v-if="isLoading" class="news-item loading">
          <span>加载中...</span>
        </li>
        <li v-else-if="newsList.length === 0" class="news-item">
          <span>暂无新闻</span>
        </li>
        <li v-for="news in newsList" :key="news.id" class="news-item">
          <span class="news-time">{{ formatTime(news.ctime) }}</span>
          <a :href="news.url" target="_blank" class="news-title">{{ news.title }}</a>
          <span class="news-source">{{ news.source }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '../utils/request'

interface NewsItem {
  id: string
  ctime: string
  title: string
  description: string
  source: string
  picUrl: string
  url: string
}

interface NewsResponse {
  reason: string
  result: {
    curpage: number
    allnum: number
    newslist: NewsItem[]
  }
  error_code: number
}

const newsList = ref<NewsItem[]>([])
const isLoading = ref(false)

function formatTime(timeStr: string): string {
  const date = new Date(timeStr)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

async function fetchNews() {
  try {
    isLoading.value = true
    const response = await request.get('/api/getNews')
    if (response.data && response.data.result) {
      newsList.value = response.data.result.newslist
    }
  } catch (error) {
    console.error('Failed to fetch news:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
.widget {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  margin-bottom: 20px;
}
.widget-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.widget-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}
.more-link {
  display: none;
}
.refresh-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border: 1px solid #1890ff;
  border-radius: 4px;
  background: transparent;
  color: #1890ff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.refresh-btn:hover {
  background: #1890ff;
  color: #fff;
}
.refresh-btn:disabled {
  border-color: #d9d9d9;
  color: #d9d9d9;
  cursor: not-allowed;
}
.refresh-btn i {
  font-size: 12px;
}
.refresh-btn i.rotating {
  animation: rotate 1s linear infinite;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.widget-content {
  padding: 0;
}
.news-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.news-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  gap: 12px;
}
.news-item:last-child {
  border-bottom: none;
}
.news-time {
  color: #666;
  font-size: 13px;
  display: inline-block;
  width: 45px;
  flex-shrink: 0;
}
.news-title {
  color: #333;
  text-decoration: none;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.news-title:hover {
  color: #1890ff;
}
.news-source {
  color: #999;
  font-size: 12px;
  flex-shrink: 0;
}
.loading {
  justify-content: center;
  color: #999;
}
</style> 