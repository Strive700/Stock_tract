<template>
  <div v-if="visible" class="trade-modal show">
    <div class="trade-modal-content">
      <!-- 头部股票信息 -->
      <div class="trade-modal-header">
        <div class="stock-basic-info">
          <div class="stock-title-row">
            <span class="stock-title-main">{{ stock?.name || '--' }}</span>
            <span class="stock-title-code">{{ stock?.tsCode || '--' }}</span>
          </div>
          <div class="stock-title-price">
            <span class="current-price">{{ formatPrice(stock?.close) }}</span>
            <span class="change-value" :class="stock?.pctChange >= 0 ? 'up' : 'down'">{{ formatPriceChange(priceChange) }}</span>
            <span class="change-percent" :class="stock?.pctChange >= 0 ? 'up' : 'down'">({{ formatPercent(stock?.pctChange) }})</span>
          </div>
        </div>
        <button class="close-modal-btn" @click="$emit('close')">
          <i class="iconfont icon-cuohao-red"></i>
        </button>
      </div>
      <!-- 实时行情卡片 -->
      <div class="market-info-card">
        <div class="market-info-item">
          <label>换手率</label>
          <span>{{ formatPercent(stock?.turnoverRate) }}</span>
        </div>
        <div class="market-info-item">
          <label>成交额</label>
          <span>{{ formatAmount(stock?.amount) }}</span>
        </div>
        <div class="market-info-item">
          <label>净流入</label>
          <span :class="stock?.netAmount >= 0 ? 'up' : 'down'">{{ formatAmount(stock?.netAmount) }}</span>
        </div>
      </div>
      <!-- 交易表单区块 -->
      <div class="trade-form">
        <div class="form-row">
          <label>可用资金</label>
          <div class="input-group">
            <span class="currency-symbol">￥</span>
            <input type="text" :value="formatPrice(Number(account.moneyRest))" readonly :class="{'input-warning': totalAmount > availableCash}" />
          </div>
          <div v-if="totalAmount > availableCash" class="fund-warning">资金不足</div>
        </div>
        <div class="form-row">
          <label>买入价格</label>
          <div class="input-group input-group-flex">
            <span class="currency-symbol">￥</span>
            <input type="number" v-model.number="buyPrice" step="0.01" min="0" placeholder="请输入买入价格" @input="calcTotal" />
            <div class="price-buttons">
              <button type="button" @click="adjustPrice(0.01)">+0.01</button>
              <button type="button" @click="adjustPrice(0.05)">+0.05</button>
              <button type="button" @click="adjustPrice(-0.01)">-0.01</button>
              <button type="button" @click="adjustPrice(-0.05)">-0.05</button>
            </div>
          </div>
          <span class="error-message" v-show="priceError">请输入有效的价格</span>
        </div>
        <div class="form-row">
          <label>买入数量</label>
          <div class="input-group quantity-input-group">
            <input type="number" v-model.number="buyQuantity" step="100" min="100" placeholder="请输入买入数量" @input="onQuantityInput" />
            <div class="quantity-controls">
               <div class="quantity-buttons">
                <button type="button" @click="adjustQuantity(100)">+100股</button>
                <button type="button" @click="adjustQuantity(500)">+500股</button>
                <button type="button" @click="buyQuantity = Math.floor(availableCash / (buyPrice || 1) / 100) * 100; calcTotal(); onQuantityInput();" :disabled="!buyPrice || availableCash < buyPrice">最大可买</button>
              </div>
            </div>
          </div>
          <span class="error-message" v-show="quantityError">请输入有效的数量（100的整数倍）</span>
        </div>
        <div class="form-row">
          <label>交易金额</label>
          <div class="input-group input-group-flex">
            <span class="currency-symbol">￥</span>
            <input type="text" :value="formatPrice(totalAmount)" readonly />
          </div>
        </div>
      </div>
      <!-- 底部按钮 -->
      <div class="trade-modal-footer">
        <button class="btn-cancel" @click="$emit('close')">取消</button>
        <button class="btn-confirm" :disabled="!validateInputs()" @click="submitBuyOrder">确认买入</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import request from '../utils/request'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const props = defineProps<{
  visible: boolean
  stock: any
}>()
const emit = defineEmits(['close', 'success'])

const userStore = useUserStore()
const { user, account } = storeToRefs(userStore)

const buyPrice = ref(props.stock?.close || 0)
const buyQuantity = ref<number | null>(null)
const totalAmount = ref(0)
const priceError = ref(false)
const quantityError = ref(false)
const availableCash = computed(() => parseFloat(account.value.moneyRest) || 0)

watch(() => props.stock, (val) => {
  buyPrice.value = val?.close || 0
  buyQuantity.value = null
  totalAmount.value = 0
  priceError.value = false
  quantityError.value = false
}, { immediate: true })

const priceChange = computed(() => {
  if (!props.stock) return 0
  // 假设close为最新价，pctChange为涨跌幅百分比
  const prev = props.stock.close / (1 + (props.stock.pctChange || 0) / 100)
  return props.stock.close - prev
})

function formatPrice(val: number | null | undefined) {
  if (val == null || isNaN(val)) return '--'
  return (+val).toFixed(2)
}
function formatPercent(val: number | null | undefined) {
  if (val == null || isNaN(val)) return '--'
  return (val >= 0 ? '+' : '') + (+val).toFixed(2) + '%'
}
function formatAmount(val: number | null | undefined) {
  if (val == null || isNaN(val)) return '--'
  if (Math.abs(val) >= 100000000) return (val / 100000000).toFixed(2) + '亿'
  if (Math.abs(val) >= 10000) return (val / 10000).toFixed(2) + '万'
  return (+val).toFixed(2)
}
function formatPriceChange(val: number) {
  return val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)
}

function adjustPrice(amount: number) {
  buyPrice.value = Math.max(0, +(buyPrice.value || 0) + amount)
  calcTotal()
}
function adjustQuantity(amount: number) {
  buyQuantity.value = Math.max(0, +(buyQuantity.value || 0) + amount)
  calcTotal()
}
function calcTotal() {
  totalAmount.value = (buyPrice.value || 0) * (buyQuantity.value || 0)
}
function validateInputs() {
  priceError.value = !buyPrice.value || buyPrice.value <= 0
  quantityError.value = !buyQuantity.value || buyQuantity.value <= 0 || buyQuantity.value % 100 !== 0
  if (!priceError.value && !quantityError.value && totalAmount.value > availableCash.value) {
    quantityError.value = true
    return false
  }
  return !priceError.value && !quantityError.value
}
function generateOrderId() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const timePart = `${year}${month}${day}${hours}${minutes}${seconds}`
  const randomPart = Math.floor(100000 + Math.random() * 900000)
  return `${timePart}${randomPart}`
}
async function submitBuyOrder() {
  if (!validateInputs()) {
    toast.error('校验未通过');
    return;
  }
  try {
    const orderId = generateOrderId();
    const res = await request.post('/Stock/buy', {
      userId: user.value?.userId,
      accountId: user.value?.accountId,
      tsCode: props.stock.tsCode,
      price: buyPrice.value,
      marketPrice: props.stock.close,
      quantity: buyQuantity.value,
      marketValue: totalAmount.value,
      type: 'buy',
      timestamp: new Date().toISOString(),
      orderId
    });
    console.log('buyStock返回', res);
    if (res.data.msg === 'success') {
      toast.success('买入委托已提交');
      emit('success');
      emit('close');
    } else {
      toast.error(res.data?.message || '委托提交失败');
    }
  } catch (e: any) {
    toast.error('提交委托失败，请稍后重试');
    console.error(e);
  }
}
function onQuantityInput() {
  calcTotal();
  if (buyQuantity.value == null || buyQuantity.value <= 0 || buyQuantity.value % 100 !== 0) {
    quantityError.value = true;
  } else if (totalAmount.value > availableCash.value) {
    quantityError.value = true;
  }
  else {
    quantityError.value = false;
  }
}
</script>

<style scoped>
/* 模态框基础样式 */
.trade-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.trade-modal.show {
  opacity: 1;
  visibility: visible;
}

.trade-modal-content {
  background: #fff;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  transform: scale(0.95);
  transition: transform 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.trade-modal.show .trade-modal-content {
  transform: scale(1);
}

/* 头部样式 */
.trade-modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  border-radius: 16px 16px 0 0;
}

.stock-title-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 2px;
}

.stock-title-main {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.stock-title-code {
  font-size: 14px;
  color: #6b7280;
}

.stock-title-price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0;
}

.current-price {
  font-size: 26px;
  font-weight: 700;
  color: #222;
  font-family: 'Monaco', 'Menlo', monospace;
}

.change-value, .change-percent {
  font-size: 15px;
  margin-left: 6px;
}

.up { color: #ef4444; }
.down { color: #10b981; }

/* 关闭按钮 */
.close-modal-btn {
  width: 36px;
  height: 36px;
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

.close-modal-btn:hover {
  background: #e5e7eb;
  color: #4b5563;
  transform: rotate(90deg);
}

/* 市场信息卡片 */
.market-info-card {
  display: flex;
  justify-content: space-between;
  background: #f9fafb;
  border-radius: 8px;
  margin: 0 24px 16px 24px;
  padding: 12px 0;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}

.market-info-item {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.market-info-item label {
  color: #888;
  font-size: 13px;
  margin-bottom: 2px;
}

.market-info-item span {
  font-size: 15px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-weight: 500;
}

/* 表单样式 */
.trade-form {
  padding: 24px 24px 0 24px;
}

.form-row {
  margin-bottom: 18px;
}

.form-row label {
  display: block;
  color: #4b5563;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
}

.input-group {
  position: relative;
  width: 100%;
}

.input-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s;
  background: #f9fafb;
}

.input-group input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.input-group input:disabled,
.input-group input[readonly] {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.input-warning {
  border: 1.5px solid #ef4444 !important;
  background: #fff0f0 !important;
  color: #ef4444 !important;
}

.fund-warning {
  color: #ef4444;
  font-size: 13px;
  margin-top: 2px;
  margin-bottom: 8px;
  font-weight: 500;
}

/* 按钮组样式 */
.price-buttons, .quantity-buttons {
  margin-top: 6px;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.price-buttons button, .quantity-buttons button {
  min-width: 70px;
  height: 32px;
  font-size: 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.price-buttons button:hover, .quantity-buttons button:hover {
  background: #f3f4f6;
  border-color: #3b82f6;
  color: #3b82f6;
}

.price-buttons button:last-child, .quantity-buttons button:last-child {
  background: #f3f4f6;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.price-buttons button:last-child:disabled, .quantity-buttons button:last-child:disabled {
  background: #f3f4f6;
  color: #bbb;
  border: 1px solid #eee;
  cursor: not-allowed;
}

/* 错误消息 */
.error-message {
  color: #ef4444;
  font-size: 13px;
  margin-top: 4px;
  display: block;
}

/* 底部按钮 */
.trade-modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-radius: 0 0 16px 16px;
  background: #f9fafb;
}

.btn-cancel {
  padding: 10px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.btn-confirm {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background: #3b82f6;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.btn-confirm:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
  transform: none;
}

/* 输入组布局 */
.input-group-flex {
  display: flex;
  align-items: center;
}

.input-group-flex .currency-symbol {
  margin-right: 4px;
  color: #6b7280;
}

.input-group-flex input {
  flex: 1;
}

.quantity-input-group {
  display: block;
  margin-bottom: 8px;
}

.quantity-input-group input[type="number"] {
  width: 100%;
  box-sizing: border-box;
  margin-right: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  margin-top: 0;
  flex-wrap: wrap;
  gap: 8px;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .trade-modal-content {
    padding: 0;
    width: 98%;
    min-width: unset;
  }

  .market-info-card {
    margin: 0 8px 12px 8px;
    padding: 8px 0;
  }

  .trade-form {
    padding: 12px 8px 0 8px;
  }

  .form-row label {
    font-size: 13px;
  }

  .price-buttons button, .quantity-buttons button {
    min-width: 50px;
    font-size: 12px;
  }
}
</style> 