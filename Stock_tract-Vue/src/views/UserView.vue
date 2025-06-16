<template>
  <div class="user-profile-container">
    <div class="profile-card" v-if="user">
      <div class="card-header">
        <h2><i class="fas fa-user"></i> 个人信息</h2>
        <button class="edit-button" @click="openEditModal">
          <i class="fas fa-edit"></i>
          编辑信息
        </button>
      </div>
      <div class="card-body">
        <div class="avatar-section">
          <div class="avatar-wrapper" @click="triggerFileInput">
            <div class="avatar">
              <img v-if="user.avatar" :src="`/avatar/${user.avatar}?t=${Date.now()}`" :alt="user.nickName || user.name">
              <i v-else class="fas fa-user"></i>
            </div>
            <div class="avatar-overlay">
              <i class="fas fa-camera"></i>
              <span>更换头像</span>
            </div>
            <input 
              type="file" 
              ref="fileInput" 
              accept="image/*" 
              style="display: none" 
              @change="handleFileUpload"
            >
          </div>
          <div class="user-basic-info">
            <h3>{{ user.nickName || user.name }}</h3>
            <p class="user-id">ID: {{ user.userId }}</p>
          </div>
        </div>

        <div class="info-section">
          <div class="section-title">
            <i class="fas fa-info-circle"></i>
            <span>基本信息</span>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>昵称</label>
              <div class="info-value">{{ user.nickName }}</div>
            </div>
            <div class="form-group">
              <label>姓名</label>
              <div class="info-value">{{ user.name }}</div>
            </div>
            <div class="form-group">
              <label>手机号码</label>
              <div class="info-value">{{ user.phone }}</div>
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <div class="info-value email-value">{{ user.email }}</div>
            </div>
            <div class="form-group">
              <label>性别</label>
              <div class="info-value">{{ user.sex }}</div>
            </div>
          </div>
        </div>

        <div class="info-section">
          <div class="section-title">
            <i class="fas fa-shield-alt"></i>
            <span>账户信息</span>
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label>角色</label>
              <div class="info-value">{{ user.role }}</div>
            </div>
            <div class="form-group">
              <label>账户状态</label>
              <div class="status-badge" :class="user.status === '正常' ? 'active' : 'inactive'">
                {{ user.status }}
              </div>
            </div>
            <div class="form-group">
              <label>创建时间</label>
              <div class="info-value">{{ user.createTime }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <div class="modal-overlay" v-if="showModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3><i class="fas fa-edit"></i> 编辑个人信息</h3>
          <button class="close-button" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>昵称</label>
            <input 
              type="text" 
              v-model="editedUser.nickName" 
              placeholder="请输入昵称"
            />
          </div>
          <div class="form-group">
            <label>姓名</label>
            <input 
              type="text" 
              v-model="editedUser.name" 
              placeholder="请输入姓名"
            />
          </div>
          <div class="form-group">
            <label>手机号码</label>
            <input 
              type="tel" 
              v-model="editedUser.phone" 
              placeholder="请输入手机号码"
            />
          </div>
          <div class="form-group">
            <label>性别</label>
            <select v-model="editedUser.sex">
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="closeModal">取消</button>
          <button class="save-button" @click="saveChanges">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import request from '../utils/request'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'
import { useToast } from 'vue-toastification'
import router from '../router'

const toast = useToast()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const fileInput = ref<HTMLInputElement | null>(null)
const showModal = ref(false)
const editedUser = reactive({
  nickName: '',
  name: '',
  phone: '',
  sex: ''
})

const openEditModal = () => {
  Object.assign(editedUser, {
    nickName: user.value?.nickName || '',
    name: user.value?.name || '',
    phone: user.value?.phone || '',
    sex: user.value?.sex || ''
  })
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveChanges = async () => {
  try {
    // 手机号格式校验
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(editedUser.phone)) {
      toast.error('请输入正确的手机号码')
      return
    }

    const response = await request.post('/updateUserInfo', {
      ...editedUser,
      userId: user.value?.userId
    })
    if (response.data.msg === 'success') {
      await fetchUserInfo()
      toast.success('保存成功')
      if (user.value) {
        userStore.setUser({
          ...user.value,
          ...editedUser
        })
      }
      closeModal()
    }
  } catch (error) {
    toast.error('保存失败')
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error('请上传图片文件')
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    toast.error('图片大小不能超过10MB')
    return
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await request.post('/uploadAvatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (response.data.msg === 'success') {
      await fetchUserInfo()
      if (user.value) {
        user.value.avatar = `${response.data.avatar}?t=${Date.now()}`
      }
      toast.success('头像上传成功')
    }
  } catch (error) {
    console.error('Upload failed:', error)
    toast.error('头像上传失败')
  }
  
  target.value = ''
}

const fetchUserInfo = async () => {
  try {
    const response = await request.get('/isLogin')
    if (response.data && response.data.user) {
      userStore.setUser(response.data.user)
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error)
  }
}

onMounted(async () => {
  try {
    const response = await request.get('/isLogin')
    if (response !== null && response.data && response.data.user) {
      userStore.setUser(response.data.user)
    } else {
      throw new Error('未获取到用户信息')
    }
  } catch (err) {
    toast.error('您尚未登录，请先登录')
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  }
})
</script>

<style scoped>
.user-profile-container {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.edit-button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #3498db;
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.edit-button:hover {
  background: #2980b9;
  transform: translateY(-1px);
}

.card-body {
  padding: 24px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.avatar-wrapper {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar i {
  font-size: 40px;
  color: #bdc3c7;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay i {
  font-size: 24px;
  margin-bottom: 4px;
}

.avatar-overlay span {
  font-size: 12px;
}

.user-basic-info h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 24px;
}

.user-id {
  color: #7f8c8d;
  margin: 0;
  font-size: 14px;
}

.info-section {
  margin-bottom: 32px;
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #7f8c8d;
  font-size: 14px;
}

.info-value {
  padding: 10px 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #2c3e50;
  font-size: 14px;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-badge.active {
  background-color: #e8f5e9;
  color: #2ecc71;
}

.status-badge.inactive {
  background-color: #ffebee;
  color: #e74c3c;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-button {
  background: none;
  border: none;
  color: #95a5a6;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s;
}

.close-button:hover {
  color: #e74c3c;
}

.modal-body {
  padding: 24px;
}

.modal-body .form-group {
  margin-bottom: 20px;
}

.modal-body input,
.modal-body select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.modal-body input:focus,
.modal-body select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-footer button {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-button {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  color: #7f8c8d;
}

.cancel-button:hover {
  background: #e9ecef;
}

.save-button {
  background: #3498db;
  border: none;
  color: white;
}

.save-button:hover {
  background: #2980b9;
}

@media (max-width: 768px) {
  .avatar-section {
    flex-direction: column;
    text-align: center;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
}

.email-value {
  color: #666;
  font-style: italic;
  position: relative;
}

.email-value::after {
  content: '(不可修改)';
  font-size: 12px;
  color: #999;
  margin-left: 8px;
  font-style: normal;
}
</style> 