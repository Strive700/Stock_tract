<template>
  <div class="container">
    <div class="login-container">
      <div class="login-header">
        <h1>股票交易系统</h1>
        <p>专业的交易平台，助您投资成功</p>
      </div>

      <div class="tab-selector">
        <div 
          :class="{ 'tab-item': true, 'active': currentTab === 'username' }" 
          @click="currentTab = 'username'"
        >
          用户名登录
        </div>
        <div 
          :class="{ 'tab-item': true, 'active': currentTab === 'phone' }" 
          @click="currentTab = 'phone'"
        >
          手机号登录
        </div>
      </div>

      <div class="login-form">
        <div v-if="currentTab === 'username'">
          <div class="form-group">
            <label for="name"><i class="iconfont icon-yonghu"></i></label>
            <input 
              v-model="name" 
              type="text" 
              id="name" 
              placeholder="用户名"
              :disabled="isLoading"
              @keyup.enter="handleLogin"
            />
          </div>

          <div class="form-group">
            <label for="password"><i class="iconfont icon-mima"></i></label>
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              placeholder="密码"
              :disabled="isLoading"
              @keyup.enter="handleLogin"
            />
            <i 
              class="iconfont" 
              :class="showPassword ? 'icon-yanjing' : 'icon-yanjing1'"
              @click="showPassword = !showPassword"
              style="position: absolute; right: 15px; top: 13px; cursor: pointer;"
            ></i>
          </div>
        </div>

        <div v-else-if="currentTab === 'phone'">
          <div class="form-group">
            <label for="phone"><i class="iconfont icon-dianhua1"></i></label>
            <input 
              v-model="phone" 
              type="tel" 
              id="phone" 
              placeholder="手机号"
              :disabled="isLoading"
              @keyup.enter="handleLogin"
            />
          </div>

          <div class="form-group">
            <label for="phone-password"><i class="iconfont icon-mima"></i></label>
            <input 
              v-model="phonePassword" 
              :type="showPassword ? 'text' : 'password'" 
              id="phone-password" 
              placeholder="密码"
              :disabled="isLoading"
              @keyup.enter="handleLogin"
            />
            <i 
              class="iconfont" 
              :class="showPassword ? 'icon-yanjing' : 'icon-yanjing1'"
              @click="showPassword = !showPassword"
              style="position: absolute; right: 15px; top: 13px; cursor: pointer;"
            ></i>
          </div>
        </div>

        <div class="form-options">
          <div class="remember-me">
            <input 
              v-model="remember" 
              type="checkbox" 
              id="remember"
              :disabled="isLoading"
            />
            <label for="remember">记住我</label>
          </div>
          <a href="#" class="forgot-password" @click.prevent="showForgotPassword = true">忘记密码?</a>
        </div>

        <button 
          @click="handleLogin" 
          class="btn-login"
          :disabled="isLoading"
        >
          <span v-if="isLoading">
            <i class="fas fa-spinner fa-spin"></i> 登录中...
          </span>
          <span v-else>登录</span>
        </button>

        <div class="login-footer">
          <p>还没有账号? <router-link to="/register" class="register-link">立即注册</router-link></p>
        </div>
      </div>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
    <ForgotPassword 
      :show="showForgotPassword" 
      @close="showForgotPassword = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import request from '../utils/request'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import ForgotPassword from '../components/ForgotPassword.vue'

const name = ref('')
const phone = ref('')
const password = ref('')
const phonePassword = ref('')
const showPassword = ref(false)
const remember = ref(false)
const message = ref('')
const messageType = ref('')
const isLoading = ref(false)
const currentTab = ref('username')
const showForgotPassword = ref(false)

const router = useRouter()
const userStore = useUserStore()

// 处理键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') handleLogin()
}

onMounted(() => {
  // 检查是否有保存的登录信息
  if (localStorage.getItem('remembered') === 'true') {
    name.value = localStorage.getItem('name') || ''
    phone.value = localStorage.getItem('phone') || ''
    password.value = localStorage.getItem('password') || ''
    phonePassword.value = localStorage.getItem('phonePassword') || ''
    remember.value = true
    currentTab.value = localStorage.getItem('loginMethod') || 'username'
  }

  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  // 移除键盘事件监听
  document.removeEventListener('keydown', handleKeyDown)
})

const handleLogin = async () => {
  if (isLoading.value) return
  
  message.value = ''
  messageType.value = ''

  let payload: any = {}
  let loginEndpoint = ''

  if (currentTab.value === 'username') {
    if (!name.value || !password.value) {
      showMessage('请输入用户名和密码', 'error')
      return
    }
    payload = { username: name.value, password: password.value }
    loginEndpoint = '/login/username'
  } else if (currentTab.value === 'phone') {
    if (!phone.value || !phonePassword.value) {
      showMessage('请输入手机号和密码', 'error')
      return
    }
    payload = { phone: phone.value, password: phonePassword.value }
    loginEndpoint = '/login/phone'
  }

  isLoading.value = true

  try {
    const response = await request.post(loginEndpoint, payload)
    console.log('Login response:', response.data)
    // 假设 将用户信息存储到用户状态管理中
    userStore.setUser(response.data.user)
    // 处理"记住我"选项
    if (remember.value) {
      localStorage.setItem('remembered', 'true')
      localStorage.setItem('name', name.value)
      localStorage.setItem('phone', phone.value)
      localStorage.setItem('password', password.value)
      localStorage.setItem('phonePassword', phonePassword.value)
    } else {
      localStorage.removeItem('remembered')
      localStorage.removeItem('name')
      localStorage.removeItem('phone')
      localStorage.removeItem('password')
      localStorage.removeItem('phonePassword')
    }


    localStorage.setItem('token', response.data.token)
    if(response.data.code==200) {
      setTimeout(() => {
      router.push('/home')
    }, 1000)
    showMessage('登录成功，正在跳转...', 'success')
    } else {
    showMessage('用户名或密码不正确', 'error')
    }
  } catch (error: any) {
    handleLoginError(error)
  } finally {
    isLoading.value = false
  }
}
const handleLoginError = (error: any) => {
  if (error.response) {
    const status = error.response.status
    if (status === 401) {
      showMessage('用户名或密码不正确', 'error')
    } else if (status === 403) {
      showMessage('账号已被禁用，请联系管理员', 'error')
    } else {
      showMessage('登录失败: ' + (error.response.data.message || '未知错误'), 'error')
    }
  } else if (error.request) {
    showMessage('无法连接到服务器，请检查网络连接', 'error')
  } else {
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

.login-container {
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: all 0.3s ease;
}

.login-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #2e4765;
  font-size: 28px;
  margin-bottom: 8px;
}

.login-header p {
  color: #222;
  font-size: 14px;
}

.tab-selector {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  color: #555;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.tab-item:hover {
  color: #4a90e2;
}

.tab-item.active {
  color: #4a90e2;
  border-bottom-color: #4a90e2;
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
  color: #222;
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #222;
}

.form-options label {
  color: #222;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 5px;
}

.remember-me label {
  color: #222;
}

.forgot-password {
  color: #4a90e2;
  text-decoration: none;
  transition: color 0.3s;
  cursor: pointer;
}

.forgot-password:hover {
  color: #2e5d9f;
}
.icon-demo {
  font-size: 24px;
  color: #333;
}
.btn-login {
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

.btn-login:hover:not(:disabled) {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  margin-top: 25px;
  font-size: 14px;
  color: #222;
}

.register-link {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.register-link:hover {
  color: #2e5d9f;
}

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  display: none;
  color: #222;
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
</style>
