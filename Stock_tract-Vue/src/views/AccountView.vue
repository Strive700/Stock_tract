<template>
  <div class="account-profile-container">
    <div class="profile-card">
      <div class="card-header">
        <h2><i class="fas fa-chart-line"></i> 账户信息</h2>
      </div>
      <div class="card-body">
        <div class="account-summary">
          <div class="summary-card total-assets">
            <div class="card-icon">
              <i class="fas fa-wallet"></i>
            </div>
            <div class="card-content">
              <span class="label">总资产</span>
              <span class="value">¥{{ formatNumber(account?.asset) }}</span>
            </div>
          </div>
          <div class="summary-card market-value">
            <div class="card-icon">
              <i class="fas fa-chart-bar"></i>
            </div>
            <div class="card-content">
              <span class="label">持仓市值</span>
              <span class="value">¥{{ formatNumber(account?.marketValue) }}</span>
            </div>
          </div>
          <div class="summary-card available-funds">
            <div class="card-icon">
              <i class="fas fa-coins"></i>
            </div>
            <div class="card-content">
              <span class="label">可用资金</span>
              <span class="value">¥{{ formatNumber(account?.moneyRest) }}</span>
            </div>
          </div>
        </div>

        <div class="account-details">
          <div class="section-title">
            <i class="fas fa-info-circle"></i>
            <span>账户详情</span>
          </div>
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">账户ID</span>
              <span class="value">{{ account?.accountId }}</span>
            </div>
            <div class="detail-item">
              <span class="label">账户状态</span>
              <span class="value status-active">正常</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '../utils/request'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const { user, account } = storeToRefs(userStore)
const isLoading = ref(true)
const errorMessage = ref('')

const formatNumber = (num: string | number | undefined) => {
  if (num === undefined) return '0.00'
  const numValue = typeof num === 'string' ? parseFloat(num) : num
  return numValue.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

onMounted(async () => {
  if (!user.value?.userId) return
  isLoading.value = true
  try {
    const response = await request.post('/getAccount', {
      accountId: user.value.accountId
    })
    if (response.data) {
      userStore.setAccount(response.data.account)
    } else {
      errorMessage.value = '未获取到账户信息'
    }
  } catch (e) {
    errorMessage.value = '加载账户信息失败'
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.account-profile-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
}

.card-header h2 {
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header h2 i {
  color: #3498db;
}

.card-body {
  padding: 24px;
}

.account-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.summary-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.total-assets .card-icon {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: #fff;
}

.market-value .card-icon {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: #fff;
}

.available-funds .card-icon {
  background: linear-gradient(135deg, #f1c40f, #f39c12);
  color: #fff;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-content .label {
  color: #7f8c8d;
  font-size: 14px;
}

.card-content .value {
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.account-details {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 16px;
  font-weight: 600;
}

.section-title i {
  color: #3498db;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item .label {
  color: #7f8c8d;
  font-size: 14px;
}

.detail-item .value {
  color: #2c3e50;
  font-size: 16px;
  font-weight: 500;
}

.status-active {
  color: #2ecc71 !important;
}

@media (max-width: 768px) {
  .account-summary {
    grid-template-columns: 1fr;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style> 