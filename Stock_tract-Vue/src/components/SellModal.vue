<template>
  <div v-if="visible" class="sell-modal" :class="{ show: visible }">
    <div class="sell-modal-content">
      <div class="sell-modal-header">
        <h3>卖出股票</h3>
        <button class="close-modal" @click="$emit('close')">
          <i class="iconfont icon-cuohao-red"></i>
        </button>
      </div>
      <div class="sell-modal-body">
        <div class="form-group">
          <label>股票名称</label>
          <input type="text" :value="stockName" readonly />
        </div>
        <div class="form-group">
          <label>证券代码</label>
          <input type="text" :value="tsCode" readonly />
        </div>
        <div class="form-group">
          <label>可卖数量</label>
          <input type="text" :value="formatQuantity(availableQuantity)" readonly />
        </div>
        <div class="form-group">
          <label>当前价格</label>
          <input type="text" :value="formatPrice(currentPrice)" readonly />
        </div>
        <div class="form-group">
          <label>卖出价格</label>
          <div class="price-input-group">
            <input type="number" v-model.number="sellPrice" step="0.01" min="0" placeholder="请输入卖出价格" @blur="validateInputs" />
          </div>
          <div class="form-error" v-show="priceError">请输入有效的卖出价格</div>
        </div>
        <div class="form-group">
          <label>卖出数量</label>
          <div class="quantity-input-group">
            <input type="number" v-model.number="sellQuantity" :max="availableQuantity" min="100" step="100" placeholder="请输入卖出数量" @blur="validateInputs" />
          </div>
          <div class="form-error" v-show="quantityError">请输入有效的卖出数量（100的整数倍）</div>
        </div>
        <div class="form-group">
          <label>预计交易金额</label>
          <input type="text" :value="formatPrice(totalAmount)" readonly />
        </div>
      </div>
      <div class="sell-modal-footer">
        <button class="sell-btn-cancel" @click="$emit('close')">取消</button>
        <button class="sell-btn-confirm" @click="submitSellOrder">确认卖出</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import request from '../utils/request'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const userStore = useUserStore()
const { user, account } = storeToRefs(userStore)
const props = defineProps<{
  visible: boolean
  tsCode: string
  stockName: string
  availableQuantity: number
  currentPrice: number
  number: number // 原始持仓数量
}>()
const emit = defineEmits(['close', 'success'])

const sellPrice = ref(props.currentPrice)
const sellQuantity = ref<number | null>(null)
const priceError = ref(false)
const quantityError = ref(false)

watch(() => props.currentPrice, (val) => {
  sellPrice.value = val
})
watch(() => props.visible, (v) => {
  if (v) {
    sellPrice.value = props.currentPrice
    sellQuantity.value = null
    priceError.value = false
    quantityError.value = false
  }
})

const totalAmount = computed(() => {
  const price = sellPrice.value || 0
  const qty = sellQuantity.value || 0
  return price * qty
})

function formatPrice(val: number | null | undefined) {
  if (val == null || isNaN(val)) return '--'
  return '¥' + (+val).toFixed(2)
}
function formatQuantity(val: number | null | undefined) {
  if (val == null || isNaN(val)) return '--'
  return val.toLocaleString()
}

function validateInputs() {
  priceError.value = !sellPrice.value || sellPrice.value <= 0
  quantityError.value =
    !sellQuantity.value ||
    sellQuantity.value <= 0 ||
    sellQuantity.value > props.availableQuantity ||
    sellQuantity.value % 100 !== 0
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

async function submitSellOrder() {
  if (!validateInputs()) return
  try {
    const orderId = generateOrderId()
    const response = await request.post('/Stock/sell', {
      userId: user.value?.userId,
      accountId: user.value?.accountId,
      tsCode: props.tsCode,
      price: sellPrice.value,
      quantity: sellQuantity.value,
      type: 'sell',
      timestamp: new Date().toISOString(),
      orderId,
      number: props.number
    })
    if (response.data.msg === 'success') {
      // 更新账户信息
      try {
        const accountResponse = await request.get('/isLogin')
        if (accountResponse.data && accountResponse.data.account) {
          userStore.setAccount(accountResponse.data.account)
        }
      } catch (error) {
        console.error('Failed to update account info:', error)
      }
      toast.success('委托提交成功')
      emit('success')
      emit('close')
    } else {
      toast.error(response.data?.message || '委托提交失败')
    }
  } catch (e: any) {
    toast.error('提交委托失败，请稍后重试')
  }
}
</script>

<style scoped>
/* 模态框基础样式 */
.sell-modal {
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

.sell-modal.show {
  opacity: 1;
  visibility: visible;
}

.sell-modal-content {
  background: #fff;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  transform: scale(0.95);
  transition: transform 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.sell-modal.show .sell-modal-content {
  transform: scale(1);
}

/* 头部样式 */
.sell-modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  border-radius: 16px 16px 0 0;
}

.sell-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.close-modal {
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

.close-modal:hover {
  background: #e5e7eb;
  color: #4b5563;
  transform: rotate(90deg);
}

/* 表单样式 */
.sell-modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  color: #4b5563;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s;
  background: #f9fafb;
}

.form-group input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.form-group input[readonly] {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.form-error {
  color: #ef4444;
  font-size: 13px;
  margin-top: 4px;
}

/* 价格和数量输入组 */
.price-input-group,
.quantity-input-group {
  position: relative;
  width: 100%;
}

.price-input-group::after,
.quantity-input-group::after {
  content: '';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.price-input-group::after {
  content: '¥';
  color: #6b7280;
}



/* 底部按钮 */
.sell-modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-radius: 0 0 16px 16px;
  background: #f9fafb;
}

.sell-btn-cancel {
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

.sell-btn-cancel:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.sell-btn-confirm {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background: #ef4444;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.sell-btn-confirm:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
}

.sell-btn-confirm:active {
  transform: translateY(0);
}

/* 响应式调整 */
@media (max-width: 640px) {
  .sell-modal-content {
    width: 95%;
    margin: 0 10px;
  }

  .sell-modal-body {
    padding: 16px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-group label {
    font-size: 13px;
  }

  .form-group input {
    font-size: 14px;
    padding: 8px 12px;
  }
}
</style> 