<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <div class="container">
    <div class="register-container">
      <div class="register-header">
        <h1>创建账号</h1>
        <p>欢迎加入股票交易平台</p>
      </div>
      <div class="register-form">
        <!-- 昵称 -->
        <div class="form-group">
          <label for="nickName"><i class="fas fa-user"></i></label>
          <input v-model="nickName" type="text" id="nickName" placeholder="昵称" :disabled="isLoading" />
        </div>
        <!-- 真实姓名 -->
        <div class="form-group">
          <label for="name"><i class="fas fa-id-card"></i></label>
          <input v-model="name" type="text" id="name" placeholder="真实姓名" :disabled="isLoading" />
        </div>
        <!-- 手机号码 -->
        <div class="form-group">
          <label for="phone"><i class="iconfont icon-dianhua1"></i></label>
          <input v-model="phone" type="tel" id="phone" placeholder="手机号码" :disabled="isLoading" />
        </div>
        <!-- 邮箱 -->
        <div class="form-group">
          <label for="email"><i class="fas fa-envelope"></i></label>
          <input v-model="email" type="email" id="email" placeholder="邮箱" :disabled="isLoading" />
        </div>
        <!-- 验证码 -->
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
        <!-- 密码 -->
        <div class="form-group">
          <label for="password"><i class="iconfont icon-mima"></i></label>
          <input 
            v-model="password" 
            :type="showPassword ? 'text' : 'password'" 
            id="password" 
            placeholder="密码" 
            :disabled="isLoading" 
          />
          <i 
            class="iconfont" 
            :class="showPassword ? 'icon-yanjing' : 'icon-yanjing1'"
            @click="showPassword = !showPassword"
            style="position: absolute; right: 15px; top: 13px; cursor: pointer;"
          ></i>
          <small class="password-hint">密码至少8位，包含字母和数字</small>
        </div>
        <!-- 确认密码 -->
        <div class="form-group">
          <label for="confirm-password"><i class="iconfont icon-mima"></i></label>
          <input 
            v-model="confirmPassword" 
            :type="showConfirmPassword ? 'text' : 'password'" 
            id="confirm-password" 
            placeholder="确认密码" 
            :disabled="isLoading" 
          />
          <i 
            class="iconfont" 
            :class="showConfirmPassword ? 'icon-yanjing' : 'icon-yanjing1'"
            @click="showConfirmPassword = !showConfirmPassword"
            style="position: absolute; right: 15px; top: 13px; cursor: pointer;"
          ></i>
        </div>
        <!-- 性别 -->
        <div class="form-group radio-group">
          <label class="radio-label">性别：</label>
          <div class="radio-options">
            <input type="radio" id="male" value="男" v-model="sex" :disabled="isLoading" />
            <label for="male">男</label>
            <input type="radio" id="female" value="女" v-model="sex" :disabled="isLoading" />
            <label for="female">女</label>
          </div>
        </div>
        <!-- 服务条款 -->
        <div class="form-options">
          <div class="agree-terms">
            <input type="checkbox" id="agree" v-model="agree" :disabled="isLoading" />
            <label for="agree">我同意 <a href="#" class="terms-link">服务条款</a> 和 <a href="#" class="privacy-link">隐私政策</a></label>
          </div>
        </div>
        <button @click="handleRegister" class="btn-register" :disabled="isLoading">
          <span v-if="isLoading">
            <i class="fas fa-spinner fa-spin"></i> 注册中...
          </span>
          <span v-else>注册</span>
        </button>
        <div class="register-footer">
          <p>已有账号? <router-link to="/login" class="login-link">返回登录</router-link></p>
        </div>
      </div>
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '../utils/request'

const nickName = ref('')
const name = ref('')
const phone = ref('')
const email = ref('')
const verificationCode = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const sex = ref('男')
const agree = ref(false)
const message = ref('')
const messageType = ref('')
const isLoading = ref(false)
const countdown = ref(0)

const router = useRouter()

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
    const response = await request.post('/register/send-code', { email: email.value })
    console.log('发送验证码响应:', response.data)
    if (response.data.code === 200) {
      showMessage('验证码已发送到您的邮箱', 'success')
      startCountdown()
    } else {
      console.error('发送验证码失败:', response.data)
      showMessage(response.data.message || '发送失败', 'error')
    }
  } catch (error: any) {
    console.error('发送验证码错误:', error)
    if (error.response) {
      console.error('错误状态码:', error.response.status)
      console.error('错误信息:', error.response.data)
    }
    showMessage(error.response?.data?.message || '发送失败', 'error')
  } finally {
    isLoading.value = false
  }
}

const validateForm = () => {
  if (!nickName.value.trim()) {
    showMessage('请输入昵称', 'error')
    return false
  }
  if (!name.value.trim()) {
    showMessage('请输入真实姓名', 'error')
    return false
  }
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(phone.value.trim())) {
    showMessage('请输入有效的手机号码', 'error')
    return false
  }
  if (!validateEmail(email.value.trim())) {
    showMessage('请输入有效的邮箱地址', 'error')
    return false
  }
  if (!verificationCode.value) {
    showMessage('请输入验证码', 'error')
    return false
  }
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  if (!passwordRegex.test(password.value)) {
    showMessage('密码必须至少8位，包含字母和数字', 'error')
    return false
  }
  if (password.value !== confirmPassword.value) {
    showMessage('两次输入的密码不一致', 'error')
    return false
  }
  if (!sex.value) {
    showMessage('请选择性别', 'error')
    return false
  }
  if (!agree.value) {
    showMessage('请阅读并同意服务条款和隐私政策', 'error')
    return false
  }
  return true
}

const handleRegister = async () => {
  if (isLoading.value) return
  message.value = ''
  messageType.value = ''
  if (!validateForm()) return
  isLoading.value = true
  try {
    const currentTime = new Date().toISOString().replace('T', ' ').replace('Z', '')
    const registerData = {
      nickName: nickName.value.trim(),
      name: name.value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim(),
      verificationCode: verificationCode.value,
      password: password.value,
      sex: sex.value,
      status: '正常',
      role: 'user',
      createTime: currentTime,
      updateTime: currentTime
    }
    console.log('注册请求数据:', registerData)
    const response = await request.post('/register/verify-code', registerData)
    console.log('注册响应:', response.data)
    if (response.data.code === 200) {
      showMessage('注册成功！正在跳转到登录页面...', 'success')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      console.error('注册失败:', response.data)
      showMessage(response.data.message || '注册失败', 'error')
    }
  } catch (error: any) {
    console.error('注册错误:', error)
    if (error.response) {
      console.error('错误状态码:', error.response.status)
      console.error('错误信息:', error.response.data)
    }
    handleApiError(error)
  } finally {
    isLoading.value = false
  }
}

const handleApiError = (error: any) => {
  if (error.response) {
    const status = error.response.status
    const msg = error.response.data.message || '未知错误'
    console.error('API错误状态码:', status)
    console.error('API错误信息:', msg)
    if (status === 400) {
      showMessage('请求参数错误: ' + msg, 'error')
    } else if (status === 409) {
      showMessage('用户已存在: ' + msg, 'error')
    } else {
      showMessage('注册失败: ' + msg, 'error')
    }
  } else if (error.request) {
    console.error('网络请求错误:', error.request)
    showMessage('无法连接到服务器，请检查网络连接', 'error')
  } else {
    console.error('请求错误:', error.message)
    showMessage('请求错误: ' + error.message, 'error')
  }
}

const showMessage = (msg: string, type: string) => {
  message.value = msg
  messageType.value = type
}
</script>

<style scoped>
:global(body) {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.register-container {
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: all 0.3s ease;
}
.register-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
.register-header {
  text-align: center;
  margin-bottom: 30px;
}
.register-header h1 {
  color: #2e4765;
  font-size: 28px;
  margin-bottom: 8px;
}
.register-header p {
  color: #222;
  font-size: 14px;
}
.form-group {
  position: relative;
  margin-bottom: 20px;
}
.form-group label {
  position: absolute;
  left: 15px;
  top: 13px;
  color: #222;
}
.form-group input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: all 0.3s;
}
.form-group input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  outline: none;
}
.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
.password-hint {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #222;
}
.radio-group {
  display: flex;
  align-items: center;
  padding: 10px 0;
}
.radio-label {
  position: static !important;
  margin-right: 15px;
  color: #2e4765;
}
.radio-options {
  display: flex;
  align-items: center;
  gap: 20px;
}
.radio-options input[type="radio"] {
  width: auto;
  margin-right: 5px;
}
.radio-options label {
  position: static !important;
  color: #222;
  cursor: pointer;
}
.form-options {
  margin-bottom: 20px;
}
.agree-terms {
  display: flex;
  align-items: center;
  font-size: 14px;
}
.agree-terms input {
  margin-right: 8px;
}
.terms-link, .privacy-link {
  color: #4a90e2;
  text-decoration: none;
}
.terms-link:hover, .privacy-link:hover {
  text-decoration: underline;
}
.btn-register {
  width: 100%;
  background: linear-gradient(135deg, #42a5f5 0%, #4a90e2 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-register:hover:not(:disabled) {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
}
.btn-register:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.register-footer {
  text-align: center;
  margin-top: 25px;
  font-size: 14px;
  color: #222;
}
.login-link {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}
.login-link:hover {
  color: #2e5d9f;
}
.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  display: none;
}
.message.error {
  background-color: #fee2e2;
  color: #ef4444;
  display: block;
}
.message.success {
  background-color: #dcfce7;
  color: #22c55e;
  display: block;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.fa-spinner {
  animation: spin 1s linear infinite;
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
</style>
