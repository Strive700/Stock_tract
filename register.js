document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const registerBtn = document.getElementById('register-btn');
    const nickNameInput = document.getElementById('nickName');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const sexInputs = document.getElementsByName('sex');
    const agreeCheckbox = document.getElementById('agree');
    const registerMessage = document.getElementById('register-message');
    
    // 设置API的基础URL
    const API_BASE_URL = 'http://localhost:8080/Stock_trading_war/api';
    
    // 配置axios默认设置
    axios.defaults.baseURL = API_BASE_URL;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    
    // 表单验证函数
    function validateForm() {
        // 昵称验证
        if (!nickNameInput.value.trim()) {
            showMessage('请输入昵称', 'error');
            return false;
        }
        
        // 真实姓名验证
        if (!nameInput.value.trim()) {
            showMessage('请输入真实姓名', 'error');
            return false;
        }
        
        // 手机号验证
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phoneInput.value.trim())) {
            showMessage('请输入有效的手机号码', 'error');
            return false;
        }
        
        // 密码验证
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(passwordInput.value)) {
            showMessage('密码必须至少8位，包含字母和数字', 'error');
            return false;
        }
        
        // 确认密码验证
        if (passwordInput.value !== confirmPasswordInput.value) {
            showMessage('两次输入的密码不一致', 'error');
            return false;
        }
        
        // 性别验证
        let selectedSex = null;
        for (const radio of sexInputs) {
            if (radio.checked) {
                selectedSex = radio.value;
                break;
            }
        }
        if (!selectedSex) {
            showMessage('请选择性别', 'error');
            return false;
        }
        
        // 服务条款同意验证
        if (!agreeCheckbox.checked) {
            showMessage('请阅读并同意服务条款和隐私政策', 'error');
            return false;
        }
        
        return true;
    }
    
    // 注册函数
    async function register() {
        if (!validateForm()) {
            return;
        }
        
        try {
            const response = await axios.post('registerServlet', {
                nickName: nickNameInput.value.trim(),
                name: nameInput.value.trim(),
                phone: phoneInput.value.trim(),
                password: passwordInput.value,
                sex: Array.from(sexInputs).find(radio => radio.checked).value,
                status: 'active',
                role: 'user',
                createTime: new Date().toISOString().replace('T', ' ').replace('Z', ''),
                updateTime: new Date().toISOString().replace('T', ' ').replace('Z', '')
            });
            
            showMessage('注册成功！正在跳转到登录页面...', 'success');
            
            // 3秒后跳转到登录页
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
            
        } catch (error) {
            handleApiError(error);
        }
    }
    
    // 错误处理函数
    function handleApiError(error) {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data.message || '未知错误';
            
            switch (status) {
                case 400:
                    showMessage('请求参数错误: ' + message, 'error');
                    break;
                case 409:
                    showMessage('用户已存在: ' + message, 'error');
                    break;
                default:
                    showMessage('注册失败: ' + message, 'error');
            }
        } else if (error.request) {
            showMessage('无法连接到服务器，请检查网络连接', 'error');
        } else {
            showMessage('请求错误: ' + error.message, 'error');
        }
    }
    
    // 显示消息函数
    function showMessage(message, type) {
        registerMessage.textContent = message;
        registerMessage.className = 'message ' + type;
        registerMessage.style.display = 'block';
    }
    
    // 事件监听
    registerBtn.addEventListener('click', register);
    
    // 实时表单验证
    const inputs = [nickNameInput, nameInput, phoneInput, passwordInput, confirmPasswordInput];
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });
    });
    
    // 输入验证函数
    function validateInput(input) {
        switch(input.id) {
            case 'phone':
                const phoneRegex = /^1[3-9]\d{9}$/;
                input.style.borderColor = phoneRegex.test(input.value) ? '#22c55e' : '#ef4444';
                break;
            case 'password':
                const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
                input.style.borderColor = passwordRegex.test(input.value) ? '#22c55e' : '#ef4444';
                break;
            case 'confirm-password':
                input.style.borderColor = input.value === passwordInput.value ? '#22c55e' : '#ef4444';
                break;
            default:
                input.style.borderColor = input.value.trim() ? '#22c55e' : '#ef4444';
        }
    }
}); 