<template>
  <div class="market-page">
    <!-- 市场概览 -->
    <MarketOverview />
    <!-- 行情筛选栏 -->
    <div class="market-filter">
      <div class="filter-group">
        <input v-model="searchKeyword" type="text" placeholder="输入股票名称搜索" class="search-input" @keyup.enter="onSearch" />
        <button class="search-btn" @click="onSearch"><i class="iconfont icon-chaxun"></i></button>
        <button class="refresh-market-btn" :disabled="isLoading" @click="onRefresh">
          <i class="iconfont icon-shuaxin"></i> 刷新
        </button>
      </div>
      <div class="filter-tags">
        <button v-for="tag in tags" :key="tag" class="filter-tag" :class="{ active: filterType === tag }" @click="onTagChange(tag)">{{ tag }}</button>
      </div>
    </div>
    <!-- 行情表格 -->
    <div class="market-table-container">
      <table class="market-table">
        <thead>
          <tr>
            <th>股票代码</th>
            <th>股票名称</th>
            <th>最新价</th>
            <th>涨跌幅</th>
            <th>换手率</th>
            <th>成交额</th>
            <th>净流入</th>
            <th>流通市值</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="9" class="no-data">加载中...</td>
          </tr>
          <tr v-else-if="stocks.length === 0">
            <td colspan="9" class="no-data">暂无数据</td>
          </tr>
          <tr v-for="stock in stocks" :key="stock.tsCode">
            <td>{{ stock.tsCode }}</td>
            <td>{{ stock.name }}</td>
            <td>{{ formatPrice(stock.close) }}</td>
            <td :class="['price-change', stock.pctChange >= 0 ? 'up' : 'down']">{{ formatPercent(stock.pctChange) }}</td>
            <td>{{ formatPercent(stock.turnoverRate) }}</td>
            <td>{{ formatAmount(stock.amount) }}</td>
            <td :class="['price-change', stock.netAmount >= 0 ? 'up' : 'down']">{{ formatAmount(stock.netAmount) }}</td>
            <td>{{ formatAmount(stock.floatValues) }}</td>
            <td>
              <button class="buy-btn" @click="openBuyModal(stock)"><i class="iconfont icon-mairu"></i> 买入</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 分页区域 -->
    <div v-if="total > 0" class="pagination">
      <button class="page-btn" :disabled="page === 1" @click="fetchMarketData(filterType, page - 1)">«</button>
      <button v-for="p in visiblePages" :key="p" class="page-btn" :class="{ active: p === page }" @click="fetchMarketData(filterType, p)">{{ p }}</button>
      <button class="page-btn" :disabled="page === totalPages" @click="fetchMarketData(filterType, page + 1)">»</button>
      <span class="page-info">共 {{ total }} 条数据</span>
    </div>
    <!-- 买入弹窗 -->
    <BuyModal v-if="showBuyModal" :visible="showBuyModal" :stock="buyStock" @close="showBuyModal = false" @success="fetchMarketData(filterType, page)" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import request from '../utils/request'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'
import MarketOverview from '../components/MarketOverview.vue'
import BuyModal from '../components/BuyModal.vue'
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
const { user } = storeToRefs(userStore)
const tags = ['全部', '上涨', '下跌', '领涨', '领跌']
const filterType = ref('全部')
const searchKeyword = ref('')
const stocks = ref<any[]>([])
const isLoading = ref(false)
const showBuyModal = ref(false)
const buyStock = ref<any>(null)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 计算总页数
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

// 计算可见的页码
const visiblePages = computed(() => {
  if (totalPages.value <= 0) return []
  const maxVisible = 5
  let start = Math.max(page.value - Math.floor(maxVisible / 2), 1)
  let end = Math.min(start + maxVisible - 1, totalPages.value)
  if (end > totalPages.value) end = totalPages.value
  if (end - start + 1 < maxVisible) start = Math.max(end - maxVisible + 1, 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

function formatPrice(val: number) {
  if (val == null || isNaN(val)) return '--'
  return Number(val).toFixed(2)
}
function formatPercent(val: number) {
  if (val == null || isNaN(val)) return '--'
  return (val >= 0 ? '+' : '') + val.toFixed(2) + '%'
}
function formatAmount(val: number) {
  if (val == null || isNaN(val)) return '--'
  if (Math.abs(val) >= 100000000) return (val / 100000000).toFixed(2) + '亿'
  if (Math.abs(val) >= 10000) return (val / 10000).toFixed(2) + '万'
  return val.toFixed(2)
}

async function fetchMarketData(type = filterType.value, p = page.value) {
  isLoading.value = true
  try {
    const res = await request.post('/getDlt', {
      userId: user.value?.userId,
      filterType: type,
      keyword: searchKeyword.value,
      page: p,
      pageSize: pageSize.value
    })
    if (res.data) {
      stocks.value = res.data.dtls || []
      // 如果后端返回了总数，使用后端返回的总数
      if (res.data.total !== undefined) {
        total.value = res.data.total
      } else {
        // 如果后端没有返回总数，使用当前数据长度
        total.value = stocks.value.length
      }
      page.value = p
    } else {
      stocks.value = []
      total.value = 0
    }
  } catch (e) {
    stocks.value = []
    total.value = 0
    console.error('获取市场数据失败:', e)
  } finally {
    isLoading.value = false
  }
}
function onTagChange(tag: string) {
  filterType.value = tag
  page.value = 1
  fetchMarketData(tag, 1)
}
function onSearch() {
  page.value = 1
  fetchMarketData(filterType.value, 1)
}
function onRefresh() {
  fetchMarketData(filterType.value, page.value)
}
function openBuyModal(stock: any) {
  buyStock.value = stock
  showBuyModal.value = true
}
onMounted(() => {
  fetchMarketData('全部')
})
</script>

<style scoped>
.market-page {
  width: 100%;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
  color: #222;
  padding: 20px;
}

/* 市场筛选栏样式 */
.market-filter {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 8px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}

.search-btn {
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.search-btn:hover {
  background: #40a9ff;
}

.refresh-market-btn {
  padding: 8px 16px;
  background: #fff;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.refresh-market-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.refresh-market-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.filter-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-tag {
  padding: 6px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.filter-tag:hover {
  background: #f5f5f5;
}

.filter-tag.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

/* 行情表格样式 */
.market-table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: auto;
  margin-bottom: 20px;
}

.market-table {
  width: 100%;
  border-collapse: collapse;
}

.market-table th {
  background: #fafafa;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
}

.market-table td {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
}

.market-table tr:hover {
  background: #fafafa;
}

/* 股票涨跌样式 */
.price-change {
  font-weight: 500;
}

.price-change.up {
  color: #f5222d;
}

.price-change.down {
  color: #52c41a;
}

/* 买入按钮样式 */
.buy-btn {
  padding: 6px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

.buy-btn:hover {
  background: #40a9ff;
}

.buy-btn i {
  font-size: 12px;
}

/* 无数据状态 */
.no-data {
  text-align: center;
  color: #999;
  padding: 40px !important;
  font-style: italic;
}

/* 分页样式 */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
  font-size: 14px;
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

.page-info {
  margin-left: 16px;
  color: #666;
  font-size: 14px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .market-page {
    padding: 16px;
  }

  .filter-group {
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .search-btn,
  .refresh-market-btn {
    width: 100%;
    justify-content: center;
  }

  .market-table th,
  .market-table td {
    padding: 12px;
    font-size: 14px;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
  }

  .page-btn {
    min-width: 28px;
    height: 28px;
    font-size: 13px;
  }

  .page-info {
    width: 100%;
    text-align: center;
    margin: 8px 0 0 0;
  }
}
</style> 