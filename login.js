document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const loginBtn = document.getElementById('login-btn');
    const nameInput = document.getElementById('name');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    const loginMessage = document.getElementById('login-message');
    
    // 检查localStorage中是否有保存的用户名密码
    if (localStorage.getItem('remembered') === 'true') {
        nameInput.value = localStorage.getItem('name') || '';
        passwordInput.value = localStorage.getItem('password') || '';
        rememberCheckbox.checked = true;
    }
    
    // 设置API的基础URL
    const API_BASE_URL = 'http://localhost:8080/Stock_trading_war/api';
    
    // 配置axios默认设置
    axios.defaults.baseURL = API_BASE_URL;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    
    // 登录按钮点击事件
    loginBtn.addEventListener('click', async function() {
        // 清空之前的提示信息
        loginMessage.className = 'message';
        loginMessage.style.display = 'none';
        loginMessage.textContent = '';
        
        // 获取用户输入
        const name = nameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // 简单的表单验证
        if (!name || !password) {
            showMessage('请输入用户名和密码', 'error');
            return;
        }
        
        try {
            // 调用登录API
            const response = await login(name, password);
            
            // 处理"记住我"选项
            if (rememberCheckbox.checked) {
                localStorage.setItem('remembered', 'true');
                localStorage.setItem('name', name);
                localStorage.setItem('password', password);
            } else {
                localStorage.removeItem('remembered');
                localStorage.removeItem('name');
                localStorage.removeItem('password');
            }
            
            // 登录成功，显示成功消息
            showMessage('登录成功，正在跳转...', 'success');
            
            // 存储token到localStorage
            localStorage.setItem('token', response.data.token);
            
            // 延迟后跳转到主页
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            
        } catch (error) {
            // 登录失败，显示错误消息
            handleLoginError(error);
        }
    });
    
    // 登录API
    async function login(name, password) {
        return await axios.post('/loginServlet', {
            name: name,
            password: password
        });
    }
    
    // 处理登录错误
    function handleLoginError(error) {
        if (error.response) {
            // 服务器返回了错误响应
            const status = error.response.status;
            
            if (status === 401) {
                showMessage('用户名或密码不正确', 'error');
            } else if (status === 403) {
                showMessage('账号已被禁用，请联系管理员', 'error');
            } else {
                showMessage('登录失败: ' + (error.response.data.message || '未知错误'), 'error');
            }
        } else if (error.request) {
            // 请求已发送但没有收到响应
            showMessage('无法连接到服务器，请检查网络连接', 'error');
        } else {
            // 请求设置时发生错误
            showMessage('请求错误: ' + error.message, 'error');
        }
    }
    
    // 显示消息函数
    function showMessage(message, type) {
        loginMessage.textContent = message;
        loginMessage.className = 'message ' + type;
        loginMessage.style.display = 'block';
    }
    
    // 添加键盘事件，按Enter键登录
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            loginBtn.click();
        }
    });
}); 