<template>
  <div class="forgot-password-modal" v-if="show">
    <div class="modal-content">
      <div class="modal-header">
        <h2>重置密码</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label for="email"><i class="iconfont icon-youxiang"></i></label>
          <input 
            v-model="email" 
            type="email" 
            id="email" 
            placeholder="请输入邮箱"
            :disabled="isLoading"
          />
        </div>

        <div class="form-group verification-group">
          <label for="verification"><i class="iconfont icon-yanzhengma"></i></label>
          <input 
            v-model="verificationCode" 
            type="text" 
            id="verification" 
            placeholder="请输入验证码"
            :disabled="isLoading"
          />
          <button 
            class="send-code-btn" 
            @click="sendVerificationCode"
            :disabled="isLoading || countdown > 0"
          >
            {{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
          </button>
        </div>

        <div class="form-group">
          <label for="newPassword"><i class="iconfont icon-mima"></i></label>
          <input 
            v-model="newPassword" 
            :type="showPassword ? 'text' : 'password'" 
            id="newPassword" 
            placeholder="请输入新密码"
            :disabled="isLoading"
          />
          <i 
            class="iconfont" 
            :class="showPassword ? 'icon-yanjing' : 'icon-yanjing1'"
            @click="showPassword = !showPassword"
            style="position: absolute; right: 15px; top: 13px; cursor: pointer;"
          ></i>
        </div>

        <div class="form-group">
          <label for="confirmPassword"><i class="iconfont icon-mima"></i></label>
          <input 
            v-model="confirmPassword" 
            :type="showPassword ? 'text' : 'password'" 
            id="confirmPassword" 
            placeholder="请确认新密码"
            :disabled="isLoading"
          />
        </div>

        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>

        <button 
          @click="handleResetPassword" 
          class="reset-btn"
          :disabled="isLoading"
        >
          <span v-if="isLoading">
            <i class="fas fa-spinner fa-spin"></i> 处理中...
          </span>
          <span v-else>重置密码</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import request from '../utils/request'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const email = ref('')
const verificationCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const message = ref('')
const messageType = ref('')
const countdown = ref(0)

const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  email.value = ''
  verificationCode.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  showPassword.value = false
  message.value = ''
  messageType.value = ''
}

const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const validateEmail = (email: string) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(email)
}

const sendVerificationCode = async () => {
  if (!email.value) {
    showMessage('请输入邮箱', 'error')
    return
  }

  if (!validateEmail(email.value)) {
    showMessage('请输入正确的邮箱格式', 'error')
    return
  }

  isLoading.value = true
  try {
    const response = await request.post('/login/send-code', { email: email.value })
    console.log(response)
    if (response.data.code === 200) {
      showMessage('验证码已发送到您的邮箱', 'success')
      startCountdown()
    } else {
      showMessage(response.data.message || '发送失败', 'error')
    }
  } catch (error: any) {
    showMessage(error.response?.data?.message || '发送失败', 'error')
  } finally {
    isLoading.value = false
  }
}

const handleResetPassword = async () => {
  if (!email.value || !verificationCode.value || !newPassword.value || !confirmPassword.value) {
    showMessage('请填写所有字段', 'error')
    return
  }

  if (!validateEmail(email.value)) {
    showMessage('请输入正确的邮箱格式', 'error')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    showMessage('两次输入的密码不一致', 'error')
    return
  }

  if (newPassword.value.length < 6) {
    showMessage('密码长度不能少于6位', 'error')
    return
  }

  isLoading.value = true
  try {
    const response = await request.post('/login/verify-code', {
      email: email.value,
      verificationCode: verificationCode.value,
      newPassword: newPassword.value
    })

    if (response.data.code === 200) {
      showMessage('密码重置成功', 'success')
      setTimeout(() => {
        closeModal()
      }, 1500)
    } else {
      showMessage(response.data.message || '重置失败', 'error')
    }
  } catch (error: any) {
    showMessage(error.response?.data?.message || '重置失败', 'error')
  } finally {
    isLoading.value = false
  }
}

const showMessage = (msg: string, type: string) => {
  message.value = msg
  messageType.value = type
}
</script>

<style scoped>
.forgot-password-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transform: translateY(0);
  animation: slideIn 0.3s ease;
  overflow: hidden;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.modal-header h2 {
  margin: 0;
  color: #2e4765;
  font-size: 22px;
  font-weight: 600;
  background: linear-gradient(135deg, #2e4765 0%, #1a2c3d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  line-height: 1;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
  transform: rotate(90deg);
}

.modal-body {
  padding: 24px;
}

.form-group {
  position: relative;
  margin-bottom: 24px;
}

.form-group label {
  position: absolute;
  left: 15px;
  top: 13px;
  color: #666;
  transition: all 0.3s ease;
}

.form-group input {
  width: 100%;
  padding: 14px 14px 14px 45px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.form-group input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.1);
  outline: none;
  background-color: white;
}

.form-group input:focus + label {
  color: #4a90e2;
}

.form-group input:disabled {
  background-color: #f1f3f5;
  cursor: not-allowed;
}

.verification-group {
  display: flex;
  gap: 12px;
}

.verification-group input {
  flex: 1;
}

.send-code-btn {
  padding: 0 20px;
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-code-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #357abd 0%, #2e5d9f 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
}

.send-code-btn:disabled {
  background: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.reset-btn {
  width: 100%;
  background: linear-gradient(135deg, #42a5f5 0%, #4a90e2 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.reset-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
}

.reset-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.2);
}

.reset-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.message {
  margin-bottom: 20px;
  padding: 12px 16px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  animation: slideDown 0.3s ease;
}

.message.error {
  background-color: #fee2e2;
  color: #ef4444;
  border: 1px solid #fecaca;
}

.message.success {
  background-color: #dcfce7;
  color: #22c55e;
  border: 1px solid #bbf7d0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fa-spinner {
  animation: spin 1s linear infinite;
}

/* 添加响应式设计 */
@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    margin: 10px;
  }

  .modal-header {
    padding: 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .form-group input {
    padding: 12px 12px 12px 40px;
    font-size: 14px;
  }

  .send-code-btn {
    padding: 0 15px;
    font-size: 13px;
  }
}
</style> 