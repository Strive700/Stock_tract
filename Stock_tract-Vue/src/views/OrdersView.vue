<template>
  <div class="orders-page">
    <!-- 筛选区 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>订单编号</label>
          <input v-model="filters.orderNo" type="text" placeholder="请输入订单编号" />
        </div>
        <div class="filter-group">
          <label>证券代码</label>
          <input v-model="filters.tsCode" type="text" placeholder="请输入证券代码" />
        </div>
        <div class="filter-group">
          <label>交易类型</label>
          <select v-model="filters.orderType">
            <option value="">全部</option>
            <option value="buy">买入</option>
            <option value="sell">卖出</option>
          </select>
        </div>
        <div class="filter-group">
          <label>订单状态</label>
          <select v-model="filters.orderStatus">
            <option value="">全部</option>
            <option value="pending">待执行</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
        <div class="filter-group">
          <label>操作日期</label>
          <input v-model="filters.operationDate" type="date" />
        </div>
        <div class="filter-buttons">
          <button class="btn btn-primary" @click="fetchOrders(1)">查询</button>
          <button class="btn btn-default" @click="resetFilters">重置</button>
        </div>
      </div>
    </div>
    <!-- 订单表格 -->
    <div class="table-container">
      <table class="data-table" id="orders-table">
        <thead>
          <tr>
            <th>订单编号</th>
            <th>证券代码</th>
            <th>交易类型</th>
            <th>委托价格</th>
            <th>委托数量</th>
            <th>成交总值</th>
            <th>订单状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="8" class="no-data">加载中...</td>
          </tr>
          <tr v-else-if="orders.length === 0">
            <td colspan="8" class="no-data">暂无订单数据</td>
          </tr>
          <tr v-for="order in orders" :key="order.orderId">
            <td>{{ order.orderId }}</td>
            <td>{{ order.tsCode }}</td>
            <td>{{ formatOrderType(order.type) }}</td>
            <td>{{ formatPrice(order.dealPrice) }}</td>
            <td>{{ formatQuantity(order.dealNumber) }}</td>
            <td>{{ formatPrice(order.dealValue) }}</td>
            <td><span :class="['status-tag', 'status-' + order.status]">{{ formatOrderStatus(order.status) }}</span></td>
            <td class="order-actions">
              <button v-if="order.status === 'pending'" class="order-action-btn btn-cancel" @click="cancelOrder(order.orderId)"><i class="fas fa-times"></i> 取消</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 分页 -->
    <div class="pagination" id="orders-pagination">
      <button class="page-btn" :disabled="page === 1" @click="() => fetchOrders(page - 1)">«</button>
      <button v-for="p in visiblePages" :key="p" class="page-btn" :class="{ active: p === page }" @click="() => fetchOrders(p)">{{ p }}</button>
      <button class="page-btn" :disabled="page === totalPages" @click="() => fetchOrders(page + 1)">»</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import request from '../utils/request'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'
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

const orders = ref<any[]>([])
const page = ref(1)
const total = ref(0)
const pageSize = 10
const isLoading = ref(false)

const filters = reactive({
  orderNo: '',
  tsCode: '',
  orderType: '',
  orderStatus: '',
  operationDate: ''
})

const totalPages = computed(() => Math.ceil(total.value / pageSize))
const visiblePages = computed(() => {
  const maxVisible = 5
  let start = Math.max(page.value - Math.floor(maxVisible / 2), 1)
  let end = Math.min(start + maxVisible - 1, totalPages.value)
  if (end > totalPages.value) end = totalPages.value
  if (end - start + 1 < maxVisible) start = Math.max(end - maxVisible + 1, 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

function formatOrderType(type: string) {
  const types: Record<string, string> = { buy: '买入', sell: '卖出' }
  return types[type] || type
}
function formatOrderStatus(status: string) {
  const statuses: Record<string, string> = { pending: '待执行', completed: '已完成', cancelled: '已取消' }
  return statuses[status] || status
}
function formatPrice(val: number) {
  if (val == null || isNaN(val)) return '--'
  return '¥' + Number(val).toFixed(2)
}
function formatQuantity(val: number) {
  if (val == null || isNaN(val)) return '--'
  return val.toLocaleString()
}
async function fetchOrders(p = 1) {
  if (!user.value?.userId) return
  isLoading.value = true
  page.value = p
  try {
    const response = await request.post('/getOrder', {
      userId: user.value?.userId,
      page: p,
      pageSize,
      ...filters
    })
    const data = response.data || {}
    orders.value = data.order|| []
    total.value = data.total || 0
  } catch (e) {
    orders.value = []
    total.value = 0
  } finally {
    isLoading.value = false
  }
}
function resetFilters() {
  filters.orderNo = ''
  filters.tsCode = ''
  filters.orderType = ''
  filters.orderStatus = ''
  filters.operationDate = ''
  fetchOrders(1)
}
async function cancelOrder(orderId: string) {
  if (!confirm('确定要取消该订单吗？')) return
  try {
    isLoading.value = true
    await request.post('/orderCancelServlet', { orderId })
    fetchOrders(page.value)
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  fetchOrders(1)
})
</script>

<style scoped>
.orders-page {
  width: 100%;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
  color: #222;
  padding: 20px;
}

/* 筛选区域样式 */
.filter-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  color: #666;
  font-size: 14px;
}

.filter-group input,
.filter-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.filter-group input:focus,
.filter-group select:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}

.filter-buttons {
  display: flex;
  gap: 8px;
  align-self: end;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #d9d9d9;
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

.btn-default {
  background-color: #fff;
  color: #666;
}

.btn-default:hover {
  color: #1890ff;
  border-color: #1890ff;
}

/* 表格区域样式 */
.table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  margin-bottom: 20px;
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
  color: #666;
  border-bottom: 1px solid #f0f0f0;
}

.data-table td {
  padding: 12px 16px;
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

/* 状态标签样式 */
.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: inline-block;
}

.status-pending {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.status-completed {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-cancelled {
  background-color: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffa39e;
}

/* 订单操作按钮样式 */
.order-actions {
  display: flex;
  gap: 8px;
}

.order-action-btn {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
  background: transparent;
}

.btn-cancel:hover {
  background: #fff1f0;
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
  .orders-page {
    padding: 16px;
  }

  .filter-row {
    grid-template-columns: 1fr;
  }

  .filter-buttons {
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