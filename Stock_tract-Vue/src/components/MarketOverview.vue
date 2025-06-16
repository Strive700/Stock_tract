<template>
  <div class="widget market-overview">
    <div class="widget-header">
      <h3>市场概览</h3>
      <span class="widget-date">{{ currentDate }}</span>
    </div>
    <div class="widget-content">
      <div v-for="index in marketIndices" :key="index.name" class="market-index">
        <div class="index-name">{{ index.name }}</div>
        <div class="index-value">{{ index.price }}</div>
        <div class="index-change" :class="parseFloat(index.change) >= 0 ? 'up' : 'down'">
          {{ formatChange(index.change, index.percent) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import request from '../utils/request'

interface MarketIndex {
  name: string
  price: string
  change: string
  percent: string
}

const marketIndices = ref<MarketIndex[]>([])
const currentDate = ref('')

function formatChange(change: string, percent: string): string {
  const changeNum = parseFloat(change)
  const sign = changeNum >= 0 ? '+' : ''
  return `${sign}${change}点 (${sign}${percent})`
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

async function fetchMarketData() {
  try {
    const response = await request.get('/api/market')
    if (response.data && Array.isArray(response.data)) {
      marketIndices.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch market data:', error)
  }
}

let timer: number

onMounted(() => {
  currentDate.value = formatDate(new Date())
  fetchMarketData()
  // 每60秒更新一次数据
  timer = window.setInterval(fetchMarketData, 60000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
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
.widget-date {
  color: #222;
  font-size: 13px;
}
.widget-content {
  padding: 16px;
}
.market-index {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}
.market-index:last-child {
  border-bottom: none;
}
.index-name {
  font-weight: 500;
}
.index-value {
  font-size: 16px;
  font-weight: 500;
}
.index-change {
  font-size: 13px;
  padding: 2px 8px;
  border-radius: 10px;
}
.index-change.up {
  background-color: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
}
.index-change.down {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}
</style> 