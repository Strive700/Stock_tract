<template>
  <div class="securities-page">
    <!-- 搜索和筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>TS代码</label>
          <input v-model="filters.tsCode" type="text" placeholder="请输入TS代码" />
        </div>
        <div class="filter-group">
          <label>证券代码</label>
          <input v-model="filters.name" type="text" placeholder="请输入证券代码" />
        </div>
        <div class="filter-group">
          <label>市场类型</label>
          <input v-model="filters.marketType" type="text" placeholder="请输入市场类型" />
        </div>
        <div class="filter-buttons">
          <button class="btn btn-primary" @click="fetchStockData(1)">查询</button>
          <button class="btn btn-default" @click="resetFilters">重置</button>
          <button class="btn btn-link" @click="exportData">导出</button>
        </div>
      </div>
    </div>
    <!-- 工具栏 -->
    <div class="toolbar">
      <button class="btn-add" @click="fetchStockData(1)">
        <i class="iconfont icon-shuaxin"></i> 刷新
      </button>
      <div class="view-options">
        <button class="icon-only-btn"><i class="fas fa-th"></i></button>
        <button class="icon-only-btn"><i class="fas fa-list"></i></button>
      </div>
    </div>
    <!-- 表格区域 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>TSI代码</th>
            <th>证券代码</th>
            <th>证券名称</th>
            <th>地域</th>
            <th>市属行业</th>
            <th>市场类型</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="7" class="no-data">加载中...</td>
          </tr>
          <tr v-else-if="stocks.length === 0">
            <td colspan="7" class="no-data">暂无数据</td>
          </tr>
          <tr v-for="stock in stocks" :key="stock.tsCode">
            <td>{{ stock.tsCode }}</td>
            <td>{{ stock.symbol }}</td>
            <td>{{ stock.name }}</td>
            <td>{{ stock.area }}</td>
            <td>{{ stock.industry }}</td>
            <td>{{ stock.marketType }}</td>
            <td>
              <button class="action-btn" @click="showDetail(stock)">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 分页区域 -->
    <div class="pagination">
      <button class="page-btn" :disabled="page === 1" @click="fetchStockData(page - 1)">«</button>
      <button
        v-for="p in visiblePages"
        :key="p"
        class="page-btn"
        :class="{ active: p === page }"
        @click="fetchStockData(p)"
      >{{ p }}</button>
      <button class="page-btn" :disabled="page === totalPages" @click="fetchStockData(page + 1)">»</button>
    </div>
    <!-- 详情右侧Panel -->
    <StockDetailPanel :tsCode="detailTsCode" :visible="showPanel" @close="showPanel = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import request from '../utils/request'
import StockDetailPanel from '../components/StockDetailPanel.vue'
import { useToast } from 'vue-toastification' 
import  router from '../router'
import { useUserStore } from '../stores/user'
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

interface Stock {
  tsCode: string
  symbol: string
  name: string
  area: string
  industry: string
  marketType: string
  listDate?: string
  fullName?: string
  enName?: string
  regCapital?: string
  legalPerson?: string
  website?: string
}

const filters = ref({ tsCode: '', name: '', marketType: '' })
const stocks = ref<Stock[]>([])
const page = ref(1)
const total = ref(0)
const pageSize = 10
const isLoading = ref(false)
const showPanel = ref(false)
const detailTsCode = ref<string | null>(null)

const totalPages = computed(() => Math.ceil(total.value / pageSize))
const visiblePages = computed(() => {
  const maxVisible = 7
  let start = Math.max(page.value - Math.floor(maxVisible / 2), 1)
  let end = start + maxVisible - 1
  if (end > totalPages.value) {
    end = totalPages.value
    start = Math.max(end - maxVisible + 1, 1)
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

async function fetchStockData(p = 1) {
  isLoading.value = true
  page.value = p
  try {
    const res = await request.post('/Stock/Info', {
        tsCode: filters.value.tsCode,
        name: filters.value.name,
        marketType: filters.value.marketType,
        page: p,
        pageSize
    })
    const data = res.data.data
    stocks.value = data.items
    total.value = data.total
  } catch (e) {
    stocks.value = []
    total.value = 0
  } finally {
    isLoading.value = false
  }
}
function resetFilters() {
  filters.value = { tsCode: '', name: '', marketType: '' }
  fetchStockData(1)
}
function exportData() {
  // 可根据实际需求导出数据
  alert('导出功能开发中...')
}
function showDetail(stock: Stock) {
  detailTsCode.value = stock.tsCode
  showPanel.value = true
}
onMounted(() => {
  fetchStockData(1)
})
</script>

<style scoped>
@import url('@/assets/main.css');
.securities-page {
  width: 100%;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
}
.filter-section {
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}
.filter-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}
.filter-group {
  flex: 1;
  min-width: 200px;
}
.filter-group label {
  display: block;
  margin-bottom: 8px;
  color: #222;
}
.filter-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
  color: #222;
}
.filter-group input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}
.filter-buttons {
  display: flex;
  gap: 8px;
}
.btn {
  padding: 8px 15px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  transition: all 0.3s;
  background: #fff;
}
.btn-primary {
  background-color: #1890ff;
  color: #fff;
  border-color: #1890ff;
}
.btn-primary:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}
.btn-default:hover {
  color: #40a9ff;
  border-color: #40a9ff;
}
.btn-link {
  border: none;
  background: none;
  color: #1890ff;
}
.btn-link:hover {
  color: #40a9ff;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.btn-add {
  padding: 8px 15px;
  background-color: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}
.btn-add i {
  margin-right: 6px;
}
.btn-add:hover {
  background-color: #40a9ff;
}
.view-options {
  display: flex;
  gap: 8px;
}
.icon-only-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  color: #222;
}
.icon-only-btn:hover {
  color: #1890ff;
  border-color: #1890ff;
}
.table-container {
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table th {
  background-color: #fafafa;
  padding: 12px 16px;
  text-align: left;
  font-weight: 500;
  color: #222;
  border-bottom: 1px solid #f0f0f0;
}
.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #222;
}
.data-table tr {
  color: #222;
}
.data-table tr:hover {
  background-color: #fafafa;
}
.data-table tr.highlighted {
  background-color: #e6f7ff;
}
.action-btn {
  background-color: transparent;
  border: none;
  color: #1890ff;
  cursor: pointer;
  transition: all 0.3s;
}
.action-btn:hover {
  color: #40a9ff;
  text-decoration: underline;
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
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
  color: #222;
}
.page-btn:hover, .page-btn.active {
  color: #1890ff;
  border-color: #1890ff;
}
.page-btn.active {
  font-weight: 500;
}
.no-data {
  text-align: center;
  color: #222;
  padding: 40px !important;
  font-style: italic;
}
</style> 