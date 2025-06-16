<template>
  <div class="position-page">
    <!-- 持仓概览 -->
    <div class="position-overview">
      <div class="overview-card">
        <div class="overview-item">
          <label>总资产</label>
          <span class="total-assets">{{ formatPrice(totalAssets) }}</span>
        </div>
        <div class="overview-divider"></div>
        <div class="overview-item">
          <label>持仓市值</label>
          <span class="total-market-value">{{ formatPrice(totalMarketValue) }}</span>
        </div>
        <div class="overview-divider"></div>
        <div class="overview-item">
          <label>总盈亏</label>
          <span :class="['total-profit-loss', totalProfitLoss >= 0 ? 'positive' : 'negative']">{{ formatPrice(totalProfitLoss) }}</span>
        </div>
      </div>
    </div>
    <!-- 持仓列表 -->
    <div class="position-section">
      <div class="section-header">
        <h2>持仓明细</h2>
        <div class="section-actions">
          <button class="refresh-btn" @click="() => fetchPositions()">
            <i class="iconfont icon-shuaxin"></i>
            刷新
          </button>
        </div>
      </div>
      <div class="table-container">
        <table class="data-table" id="position-table">  
          <thead>
            <tr>
              <th class="align-center">证券代码</th>
              <th class="align-center">证券名称</th>
              <th class="align-center">持仓数量</th>
              <th class="align-center">成本价</th>
              <th class="align-center">当前价</th>
              <th class="align-center">市值</th>
              <th class="align-center">成本</th>
              <th class="align-center">盈亏</th>
              <th class="align-center">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="9" class="no-data">加载中...</td>
            </tr>
            <tr v-else-if="positions.length === 0">
              <td colspan="9" class="no-data">暂无持仓数据</td>
            </tr>
            <tr v-for="pos in positions" :key="pos.tsCode">
              <td class="align-center">{{ pos.tsCode }}</td>
              <td class="align-center">{{ getStockName(pos.tsCode) }}</td>
              <td class="align-center">{{ formatQuantity(pos.number) }}</td>
              <td class="align-center">{{ formatPrice(pos.dealPrice) }}</td>
              <td class="align-center">{{ formatPrice(pos.marketPrice) }}</td>
              <td class="align-center">{{ formatPrice(pos.marketValue) }}</td>
              <td class="align-center">{{ formatPrice(pos.cost) }}</td>
              <td class="align-center">
                <div :class="['profit-loss', pos.profitLoss >= 0 ? 'positive' : 'negative']">
                  {{ formatPrice(pos.profitLoss) }}
                  <span class="percentage">{{ calcProfitPercent(pos) }}</span>
                </div>
              </td>
              <td class="align-center">
                <button class="position-action-btn btn-sell" @click="sellStock(pos)">
                  <i class="iconfont icon-maichu"></i> 卖出
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 分页区域 -->
    <div class="pagination" id="position-pagination">
      <button class="page-btn" :disabled="page === 1" @click="() => fetchPositions(page - 1)">«</button>
      <button v-for="p in visiblePages" :key="p" class="page-btn" :class="{ active: p === page }" @click="() => fetchPositions(p)">{{ p }}</button>
      <button class="page-btn" :disabled="page === totalPages" @click="() => fetchPositions(page + 1)">»</button>
    </div>
    <SellModal
      v-if="showSellModal"
      :visible="showSellModal"
      :tsCode="sellInfo.tsCode"
      :stockName="sellInfo.stockName"
      :availableQuantity="sellInfo.availableQuantity"
      :currentPrice="sellInfo.currentPrice"
      :number="sellInfo.number"
      @close="showSellModal = false"
      @success="fetchPositions(1)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import request from '../utils/request'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'
import SellModal from '../components/SellModal.vue'
import router from '../router'
import { useToast } from 'vue-toastification' 
const toast = useToast()
const userStore = useUserStore()
onMounted(async () => {
  try {
    const response = await request.get('/isLogin') 
    if(response!== null && response.data && response.data.user) {
      // 如果获取到用户信息，设置到 Pinia store，防止页面刷新后数据丢失
    userStore.setUser(response.data.user)
    userStore.setAccount(response.data.account)
    } else {
      // 如果没有获取到用户信息，抛出错误
      throw new Error('未获取到用户信息')
    }
  } catch (err) {
    toast.error('您尚未登录，请先登录')
        setTimeout(() => {
      router.push('/login') 
    }, 1500)
  }
})

interface Position {
  tsCode: string
  number: number
  dealPrice: number
  marketPrice: number
  marketValue: number
  cost: number
  profitLoss: number
}
interface User {
  userId: string
  nickName: string
  uname: string
  phone: string
  sex: string
  role: string
  createTime: string
  status: string
}
interface Account {
  accountId: string
  asset: string
  marketValue: string
  moneyRest: string
}
const { user, account } = storeToRefs(userStore)
const positions = ref<Position[]>([])
const names = ref<Record<string, { name: string }>>({})
const page = ref(1)
const total = ref(0)
const pageSize = 10
const isLoading = ref(false)
const showSellModal = ref(false)
const sellInfo = ref({ tsCode: '', stockName: '', availableQuantity: 0, currentPrice: 0, number: 0 })

// 概览数据
const totalMarketValue = computed(() => parseFloat(account.value?.marketValue || '0'))
const totalProfitLoss = computed(() => positions.value.reduce((sum, p) => sum + (p.profitLoss || 0), 0))
const totalAssets = computed(() => parseFloat(account.value?.asset || '0'))

const totalPages = computed(() => Math.ceil(total.value / pageSize))
const visiblePages = computed(() => {
  const maxVisible = 5
  let start = Math.max(page.value - Math.floor(maxVisible / 2), 1)
  let end = Math.min(start + maxVisible - 1, totalPages.value)
  if (end > totalPages.value) end = totalPages.value
  if (end - start + 1 < maxVisible) start = Math.max(end - maxVisible + 1, 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

function getCashBalance() {
  return parseFloat(account.value?.moneyRest || '0')
}

function formatPrice(val: number) {
  if (val == null || isNaN(val)) return '--'
  return '¥' + val.toFixed(2)
}
function formatQuantity(val: number) {
  if (val == null || isNaN(val)) return '--'
  return val.toLocaleString()
}
function calcProfitPercent(pos: Position) {
  if (!pos.cost) return '--'
  return ((pos.profitLoss / pos.cost) * 100).toFixed(2) + '%'
}
function getStockName(tsCode: string) {
  return names.value[tsCode]?.name || '未知股票'
}

async function fetchPositions(p = page.value) {
  isLoading.value = true
  page.value = p
  try {
    const accountId = user.value?.accountId || account.value?.accountId
    if (!accountId) throw new Error('未获取到账户ID')
    const res = await request.post('/getPosition', {
      accountId,
      page: p,
      pageSize
    })
    const data = res.data || []
    positions.value = data.positions || []
    names.value = data.name || {}
    total.value = data.total || 0
  } catch (e) {
    positions.value = []
    total.value = 0
    names.value = {}
  } finally {
    isLoading.value = false
  }
}
function sellStock(pos: Position) {
  showSellModal.value = true
  sellInfo.value = {
    tsCode: pos.tsCode,
    stockName: getStockName(pos.tsCode),
    availableQuantity: pos.number,
    currentPrice: pos.marketPrice,
    number: pos.number
  }
}
onMounted(() => {
  fetchPositions(1)
})
</script>

<style scoped>
.position-page {
  width: 100%;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
  color: #222;
  padding: 20px;
}

/* 持仓概览样式 */
.position-overview {
  margin-bottom: 24px;
}

.overview-card {
  background: linear-gradient(135deg, #1890ff, #096dd9);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
}

.overview-item {
  flex: 1;
  text-align: center;
  color: #fff;
}

.overview-divider {
  width: 1px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 0 24px;
}

.overview-item label {
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  opacity: 0.9;
}

.overview-item span {
  display: block;
  font-size: 24px;
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', monospace;
}

.total-profit-loss.positive {
  color: #f5222d;
}

.total-profit-loss.negative {
  color: #52c41a;
}

/* 持仓列表样式 */
.position-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.section-actions {
  display: flex;
  gap: 12px;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #f0f2f5;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
}

.refresh-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.refresh-btn i {
  font-size: 14px;
}

/* 表格样式 */
.table-container {
  overflow-x: auto;
  padding: 0 24px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background-color: #fafafa;
  padding: 12px 16px;
  text-align: center;
  font-weight: 500;
  color: #666;
  border-bottom: 1px solid #f0f0f0;
}

.data-table td {
  padding: 12px 16px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.data-table tr:hover {
  background-color: #fafafa;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 40px !important;
  font-style: italic;
}

/* 盈亏显示样式 */
.profit-loss {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-weight: 500;
}

.profit-loss.positive {
  color: #f5222d;
}

.profit-loss.negative {
  color: #52c41a;
}

.percentage {
  font-size: 12px;
  opacity: 0.8;
}

/* 操作按钮样式 */
.position-action-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.btn-sell {
  background-color: #ff4d4f;
  color: #fff;
  border: none;
}

.btn-sell:hover {
  background-color: #ff7875;
}

.btn-sell i {
  font-size: 12px;
}

/* 分页样式 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 20px;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover,
.page-btn.active {
  color: #1890ff;
  border-color: #1890ff;
}

.page-btn.active {
  font-weight: 500;
}

.page-btn:disabled {
  color: #d9d9d9;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .position-page {
    padding: 16px;
  }

  .overview-card {
    flex-direction: column;
    gap: 20px;
    padding: 16px;
  }

  .overview-divider {
    display: none;
  }

  .overview-item {
    width: 100%;
  }

  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .section-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .data-table {
    font-size: 14px;
  }

  .data-table th,
  .data-table td {
    padding: 8px 12px;
  }
}
</style> 