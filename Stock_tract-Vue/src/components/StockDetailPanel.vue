<template>
  <div :class="['stock-detail-panel', { hidden: !visible }]" id="stock-detail-panel">
    <div class="detail-header">
      <div class="stock-basic-info">
        <h2 class="stock-title">
          <span id="detail-stock-name">{{ detail?.name || '--' }}</span>
          <span id="detail-stock-code" class="stock-code">{{ detail?.tsCode || '--' }}</span>
        </h2>
      </div>
      <button class="close-detail-btn" @click="$emit('close')">
        <i class="iconfont icon-cuohao-red"></i>
      </button>
    </div>
    <div class="detail-content">
      <div class="detail-tabs">
        <button class="detail-tab" :class="{ active: tab === 'company' }" @click="tab = 'company'">
          <i class="iconfont icon-gongsi"></i> 公司资料
        </button>
        <button class="detail-tab" :class="{ active: tab === 'business' }" @click="tab = 'business'">
          <i class="iconfont icon-yewu"></i> 业务信息
        </button>
      </div>
      <div v-if="loading" class="no-data">加载中...</div>
      <template v-else-if="detail">
        <div v-show="tab === 'company'" class="detail-tab-content" id="company-info">
          <div class="info-card">
            <div class="info-card-header">
              <i class="fas fa-info-circle"></i>
              <span>基本信息</span>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <label>公司代码</label>
                <span id="detail-company-id">{{ detail.companyId || '--' }}</span>
              </div>
              <div class="info-item">
                <label>交易所</label>
                <span id="detail-exchange-full">{{ detail.exchange || '--' }}</span>
              </div>
              <div class="info-item">
                <label>董事长</label>
                <span id="detail-chairman">{{ detail.chairman || '--' }}</span>
              </div>
              <div class="info-item">
                <label>注册资本</label>
                <span id="detail-reg-capital">{{ formatCapital(detail.regCapital) }}</span>
              </div>
              <div class="info-item">
                <label>公司网站</label>
                <span id="detail-website">
                  <a v-if="detail.website" :href="detail.website" target="_blank">
                    <i class="iconfont icon-web"></i>
                    {{ detail.website }}
                  </a>
                  <span v-else>--</span>
                </span>
              </div>
            </div>
          </div>
          <div class="info-card">
            <div class="info-card-header">
              <i class="fas fa-book"></i>
              <span>公司简介</span>
            </div>
            <div class="company-description">
              <p id="detail-introduction">{{ detail.introduction || '暂无公司简介' }}</p>
            </div>
          </div>
        </div>
        <div v-show="tab === 'business'" class="detail-tab-content" id="business-info">
          <div class="info-card">
            <div class="info-card-header">
              <i class="fas fa-briefcase"></i>
              <span>主营业务</span>
            </div>
            <div class="business-section">
              <p id="detail-main-business">{{ detail.mainBusiness || '暂无主营业务信息' }}</p>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="no-data">暂无数据</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import request from '../utils/request'

const props = defineProps<{
  tsCode: string | null
  visible: boolean
}>()
const emit = defineEmits(['close'])

const detail = ref<any>(null)
const loading = ref(false)
const tab = ref<'company' | 'business'>('company')

function formatCapital(capital?: string) {
  if (!capital) return '--'
  const num = parseFloat(capital)
  if (isNaN(num)) return capital
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿元'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(2) + '万元'
  }
  return num.toLocaleString() + '元'
}

async function fetchDetail() {
  if (!props.tsCode) {
    detail.value = null
    return
  }
  loading.value = true
  try {
    const res = await request.post('/Stock/Company', { tsCode: props.tsCode })
    detail.value = res.data.company || null
    console.log(res.data)
  } catch (e) {
    detail.value = null
  } finally {
    loading.value = false
  }
  
}

watch(() => props.tsCode, fetchDetail, { immediate: true })
watch(() => props.visible, (v) => { if (v) fetchDetail() })
</script>

<style scoped>
/* 面板基础样式 */
.stock-detail-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.stock-detail-panel.hidden {
  transform: translateX(100%);
}

.stock-detail-panel:not(.hidden) {
  transform: translateX(0);
}

/* 头部样式 */
.detail-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
}

.stock-basic-info {
  flex: 1;
}

.stock-title {
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.stock-title span:first-child {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.stock-code {
  font-size: 14px;
  color: #6b7280;
}

.close-detail-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-detail-btn:hover {
  background: #e5e7eb;
  color: #4b5563;
  transform: rotate(90deg);
}

/* 内容区域样式 */
.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 标签页样式 */
.detail-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;
}

.detail-tab {
  padding: 8px 16px;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 6px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-tab:hover {
  color: #3b82f6;
  background: #f3f4f6;
}

.detail-tab.active {
  color: #3b82f6;
  background: #eff6ff;
  font-weight: 500;
}

.detail-tab i {
  font-size: 16px;
}

/* 信息卡片样式 */
.info-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.info-card-header {
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4b5563;
  font-weight: 500;
}

.info-card-header i {
  color: #6b7280;
}

/* 信息网格样式 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-size: 12px;
  color: #6b7280;
}

.info-item span {
  font-size: 14px;
  color: #1f2937;
}

/* 公司简介样式 */
.company-description {
  padding: 16px;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.6;
}

/* 业务信息样式 */
.business-section {
  padding: 16px;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.6;
}

/* 链接样式 */
.info-item a {
  color: #3b82f6;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-item a:hover {
  text-decoration: underline;
}

.info-item a i {
  font-size: 14px;
}

/* 无数据状态 */
.no-data {
  text-align: center;
  color: #9ca3af;
  padding: 40px 20px;
  font-style: italic;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .stock-detail-panel {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .detail-tabs {
    flex-wrap: wrap;
  }

  .detail-tab {
    flex: 1;
    justify-content: center;
  }
}
</style> 