document.addEventListener('DOMContentLoaded', function() {
    // 设置API基础URL
    const API_BASE_URL = 'http://localhost:8080/Stock_trading_war/api';
    // 侧边栏菜单功能
    initializeSidebar();
    loadUserPage();
    // 查询按钮事件
    const searchBtn = document.querySelector('.btn-primary');
    searchBtn.addEventListener('click', function() {
        fetchStockData();
    });
    // 重置按钮事件
    const resetBtn = document.querySelector('.btn-default');
    resetBtn.addEventListener('click', function() {
        document.querySelectorAll('.filter-group input').forEach(input => {
            input.value = '';
        });
    });
    
    // 添加按钮事件
    const addBtn = document.querySelector('.btn-add');
    addBtn.addEventListener('click', function() {
        fetchStockData();
    });
    // 获取所有的"详情"按钮
    console.log('Clicked on details for stock:', tsCode);
    document.querySelector('.data-table').addEventListener('click', function(e) {
        if (e.target.classList.contains('action-btn')) {
            const row = e.target.closest('tr');
            const tsCode = row.cells[0].textContent;
            const name = row.cells[2].textContent;
            showStockDetails(tsCode,name);
        }
    });
    // 侧边栏初始化
    function initializeSidebar() {
        const menuItems = document.querySelectorAll('.menu-item');
        const subMenuItems = document.querySelectorAll('.submenu-item');

        // 设置初始状态 - 显示激活的菜单的子菜单
        const activeMenuItem = document.querySelector('.menu-item.active');
        if (activeMenuItem) {
            const nextElement = activeMenuItem.nextElementSibling;
            if (nextElement && nextElement.classList.contains('submenu')) {
                nextElement.style.display = 'block';
            }
        }

        // 处理主菜单项点击
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();

                // 获取子菜单
                const menuId = this.id;
                const submenuId = menuId.replace('menu-', 'submenu-');
                const submenu = document.getElementById(submenuId);
                // 主菜单激活状态切换
                if (!submenu) {
                    // 如果没有子菜单，直接激活当前菜单
                    menuItems.forEach(mi => mi.classList.remove('active'));
                    this.classList.add('active');
                    // 隐藏所有子菜单
                    document.querySelectorAll('.submenu').forEach(submenu => {
                        submenu.style.display = 'none';
                    });

                    // 切换图标方向
                    document.querySelectorAll('.menu-item .fa-chevron-up').forEach(icon => {
                        icon.classList.remove('fa-chevron-up');
                        icon.classList.add('fa-chevron-down');
                    });

                    // 根据菜单项加载相应内容
                    loadContent(this.querySelector('span').textContent);
                } else {
                    // 有子菜单的情况下，切换子菜单的显示状态
                    const chevronIcon = this.querySelector('.fa-chevron-down, .fa-chevron-up');

                    if (submenu.style.display === 'none' || !submenu.style.display) {
                        // 隐藏其他子菜单
                        document.querySelectorAll('.submenu').forEach(sm => {
                            if (sm.id !== submenuId) {
                                sm.style.display = 'none';

                                // 更新其他菜单的图标
                                const parentMenu = document.getElementById(sm.id.replace('submenu-', 'menu-'));
                                if (parentMenu) {
                                    const icon = parentMenu.querySelector('.fa-chevron-up');
                                    if (icon) {
                                        icon.classList.remove('fa-chevron-up');
                                        icon.classList.add('fa-chevron-down');
                                    }
                                }
                            }
                        });

                        // 显示当前子菜单
                        submenu.style.display = 'block';

                        // 激活当前菜单
                        menuItems.forEach(mi => mi.classList.remove('active'));
                        this.classList.add('active');

                        // 切换图标为向上
                        if (chevronIcon) {
                            chevronIcon.classList.remove('fa-chevron-down');
                            chevronIcon.classList.add('fa-chevron-up');
                        }

                        // 默认选择第一个子菜单项
                        const firstSubmenuItem = submenu.querySelector('.submenu-item');
                        if (firstSubmenuItem && !submenu.querySelector('.submenu-item.active')) {
                            subMenuItems.forEach(item => item.classList.remove('active'));
                            firstSubmenuItem.classList.add('active');
                            loadContent(firstSubmenuItem.textContent, true);
                        } else if (submenu.querySelector('.submenu-item.active')) {
                            loadContent(submenu.querySelector('.submenu-item.active').textContent, true);
                        }
                    } else {
                        // 隐藏子菜单
                        submenu.style.display = 'none';

                        // 切换图标为向下
                        if (chevronIcon) {
                            chevronIcon.classList.remove('fa-chevron-up');
                            chevronIcon.classList.add('fa-chevron-down');
                        }
                    }
                }
            });
        });

        // 处理子菜单项点击
        subMenuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();

                // 子菜单激活状态切换
                subMenuItems.forEach(si => si.classList.remove('active'));
                this.classList.add('active');

                // 根据子菜单项加载相应内容
                loadContent(this.textContent, true);
            });
        });
    }

    // 加载内容
    function loadContent(menuName, isSubmenu = false) {
        // 首先隐藏所有页面容器
        const allPages = document.querySelectorAll('.page-container');
        allPages.forEach(page => page.classList.add('hidden'));

        // 根据菜单名称显示对应页面
        let targetPageId;
        switch(menuName) {
            case '主页面':
                targetPageId = 'home-page';
                break;
            case '股票行情':
            case '实时行情':
                targetPageId = 'market-page';
                break;
            case '股票交易':
            case '持仓':
                targetPageId = 'position-page';
                initializePositionPage();
                break;
            case '证券信息':
            case '基础信息':
                targetPageId = 'securities-page';
                break;
            case '订单管理':
            case '历史订单':
                targetPageId = 'orders-page';
                break;
            case '设置':
                targetPageId = 'settings-page';
                break;
            case '个人设置':
                targetPageId = 'user-page';
                break;
            default:
                targetPageId = 'home-page';
        }

        // 显示目标页面
        const targetPage = document.getElementById(targetPageId);
        if (targetPage) {
            if (targetPage.id === 'securities-page') {
                fetchStockData(); // 初始化数据
            }
            targetPage.classList.remove('hidden');
        }

        // 更新面包屑导航
        updateBreadcrumb(menuName, isSubmenu);

        // 当切换到实时行情页面时初始化
        if (targetPageId === 'market-page') {
            initializeMarketPage();
        }

        if (menuName === '个人设置') {
            loadUserPage();
        }
    }

    // 添加面包屑导航更新函数
    function updateBreadcrumb(menuName, isSubmenu) {
        const contentTitle = document.querySelector('.breadcrumb');
        if (isSubmenu) {
            const parentMenu = findParentMenu(menuName);
            contentTitle.innerHTML = `<span>${parentMenu}</span><span>/</span><span>${menuName}</span>`;
        } else {
            contentTitle.innerHTML = `<span>${menuName}</span>`;
        }
    }

    // 辅助函数：查找父菜单
    // 修改 findParentMenu 函数中的映射关系
    function findParentMenu(submenuName) {
        const submenuMappings = {
            '实时行情': '股票行情',
            '持仓': '股票交易',
            '基础信息': '证券信息',
            '历史订单': '订单管理'
        };
        return submenuMappings[submenuName] || '主页面';
    }

    // 更新标签页
    function updateTabs(menuName, isSubmenu, parentMenuName) {
        const tabs = document.querySelector('.tabs');

        // 清除现有标签页，除了主页面
        const existingTabs = Array.from(document.querySelectorAll('.tab'));
        existingTabs.forEach((tab, index) => {
            if (index > 0) {
                tab.remove();
            }
        });

        // 更新主页面标签状态
        const homeTab = document.querySelector('.tab');
        if (menuName === '主页面') {
            homeTab.classList.add('active');
        } else {
            homeTab.classList.remove('active');

            // 添加新标签
            let tabName = menuName;
            if (isSubmenu) {
                // 如果是子菜单项，使用子菜单名称
                tabName = menuName;
            } else if (menuName === '证券信息' || menuName === '股票行情' ||
                      menuName === '股票交易' || menuName === '订单管理') {
                // 如果是有子菜单的主菜单，默认使用第一个子菜单名称
                const submenuId = `submenu-${menuName === '证券信息' ? 'securities' : 
                                   menuName === '股票行情' ? 'market' : 
                                   menuName === '股票交易' ? 'trading' : 'orders'}`;
                const submenu = document.getElementById(submenuId);
                if (submenu) {
                    const firstSubmenuItem = submenu.querySelector('.submenu-item');
                    if (firstSubmenuItem) {
                        tabName = firstSubmenuItem.textContent;
                    }
                }
            }

            const newTab = document.createElement('a');
            newTab.href = '#';
            newTab.classList.add('tab', 'tab-with-close', 'active');
            newTab.innerHTML = `<span>${tabName}</span><i class="fas fa-times"></i>`;

            // 添加关闭事件
            newTab.querySelector('i').addEventListener('click', function(e) {
                e.stopPropagation();
                homeTab.classList.add('active');
                newTab.remove();
                document.querySelector('#menu-home').click();
            });

            // 添加标签点击事件
            newTab.addEventListener('click', function(e) {
                if (e.target !== newTab.querySelector('i')) {
                    e.preventDefault();
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');

                    // 重新加载对应内容
                    if (isSubmenu) {
                        // 查找正确的父菜单和子菜单
                        const parentMenuId = parentMenuName === '证券信息' ? 'menu-securities' :
                                            parentMenuName === '股票行情' ? 'menu-market' :
                                            parentMenuName === '股票交易' ? 'menu-trading' :
                                            parentMenuName === '订单管理' ? 'menu-orders' : '';

                        if (parentMenuId) {
                            const parentMenu = document.getElementById(parentMenuId);
                            const submenuId = parentMenuId.replace('menu-', 'submenu-');
                            const submenu = document.getElementById(submenuId);

                            if (parentMenu && submenu) {
                                // 激活父菜单
                                document.querySelectorAll('.menu-item').forEach(mi => mi.classList.remove('active'));
                                parentMenu.classList.add('active');

                                // 显示子菜单
                                document.querySelectorAll('.submenu').forEach(sm => sm.style.display = 'none');
                                submenu.style.display = 'block';

                                // 激活子菜单项
                                document.querySelectorAll('.submenu-item').forEach(si => si.classList.remove('active'));
                                const targetSubmenuItem = Array.from(submenu.querySelectorAll('.submenu-item'))
                                    .find(item => item.textContent === tabName);

                                if (targetSubmenuItem) {
                                    targetSubmenuItem.classList.add('active');
                                    loadContent(targetSubmenuItem.textContent, true);
                                }
                            }
                        }
                    } else {
                        // 主菜单点击
                        const targetMenu = Array.from(document.querySelectorAll('.menu-item'))
                            .find(item => item.querySelector('span').textContent === menuName);

                        if (targetMenu) {
                            targetMenu.click();
                        }
                    }
                }
            });

            tabs.appendChild(newTab);
        }
    }

    // 获取股票数据
    async function fetchStockData(page = 1) {
        const tsCode = document.getElementById('tsCode').value;
        const name = document.getElementById('name').value;
        const marketType = document.getElementById('marketType').value;

        try {
            const response = await axios.get(`${API_BASE_URL}/selectServlet`, {
                params: {
                    tsCode,
                    name,
                    marketType,
                    page,
                    pageSize: 10
                }
            });

            const { items, total, page: currentPage } = response.data.data;
            updateTable(items);
            updatePagination(total, currentPage);
            console.log('数据获取成功');
        } catch (error) {
            console.error('获取股票数据失败:', error);
            alert('获取数据失败，请稍后再试');
        }
    }
    function updateTable(stocks) {
        const tbody = document.querySelector('.data-table tbody');
        tbody.innerHTML = '';
        stocks.forEach(stock => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${stock.tsCode}</td>
                <td>${stock.symbol}</td>
                <td>${stock.name}</td>
                <td>${stock.area}</td>
                <td>${stock.industry}</td>
                <td>${stock.marketType}</td>
                <td>
                    <button class="action-btn">详情</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    // 更新分页
    function updatePagination(total, currentPage) {
        const totalPages = Math.ceil(total / 10);
        const paginationContainer = document.querySelector('.pagination');
        paginationContainer.innerHTML = ''; // 清空原分页内容
        const maxVisible = 7; // 最多显示的页码按钮数
        const half = Math.floor(maxVisible / 2);
        let startPage = Math.max(currentPage - half, 1);
        let endPage = startPage + maxVisible - 1;
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - maxVisible + 1, 1);
        }
        // 上一页
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '«';
        prevBtn.disabled = currentPage === 1;
        prevBtn.className = 'page-btn';
        prevBtn.addEventListener('click', () => fetchStockData(currentPage - 1));
        paginationContainer.appendChild(prevBtn);
        // 页码按钮
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = 'page-btn';
            if (i === currentPage) pageBtn.classList.add('active');
            pageBtn.addEventListener('click', () => fetchStockData(i));
            paginationContainer.appendChild(pageBtn);
        }

        // 下一页
        const nextBtn = document.createElement('button');
        nextBtn.textContent = '»';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.className = 'page-btn';
        nextBtn.addEventListener('click', () => fetchStockData(currentPage + 1));
        paginationContainer.appendChild(nextBtn);

        const pageJumpInput = document.querySelector('.page-input');
        if (pageJumpInput) {
            pageJumpInput.value = currentPage;
        }
    }
    // 显示股票详情
    async function showStockDetails(tsCode,name) {
        const detailPanel = document.getElementById('stock-detail-panel');
        console.log('Detail panel element:', detailPanel); // 调试信息

        try {
            // 显示加载状态
            detailPanel.classList.remove('hidden');
            console.log('Removed hidden class'); // 调试信息
            showLoading(detailPanel);

            // 调用API获取详细信息
            const response = await axios.get(`${API_BASE_URL}/companySelectServlet`, {
                params: { tsCode }
            });

            console.log('API response:', response.data); // 调试信息
            const stockDetail = response.data.data;

            // 更新详情面板内容
            updateStockDetail(stockDetail,name);

            // 隐藏加载状态
            hideLoading(detailPanel);

        } catch (error) {
            console.error('获取股票详情失败:', error);
            showErrorMessage('获取股票详情失败，请稍后重试');
            detailPanel.classList.add('hidden');
        }
    }
    // 更新股票详情内容
    function updateStockDetail(detail,name) {
        console.log('Updating stock detail with data:', detail);

        try {
            // 更新头部信息
            document.getElementById('detail-stock-name').textContent = name|| '--';
            document.getElementById('detail-stock-code').textContent = detail.tsCode || '--';
            
            // 更新公司资料（交易所信息移到这里）
            document.getElementById('detail-company-id').textContent = detail.companyId || '--';
            document.getElementById('detail-exchange-full').textContent = detail.exchange || '--';
            document.getElementById('detail-chairman').textContent = detail.chairman || '--';
            document.getElementById('detail-reg-capital').textContent = formatCapital(detail.regCapital) || '--';
            
            // 更新网站链接
            const websiteElement = document.getElementById('detail-website');
            if (detail.website) {
                websiteElement.innerHTML = `<a href="${detail.website}" target="_blank">
                    <i class="fas fa-external-link-alt"></i>
                    ${detail.website}
                </a>`;
            } else {
                websiteElement.textContent = '--';
            }
            
            // 更新公司简介和主营业务
            document.getElementById('detail-introduction').textContent = detail.introduction || '暂无公司简介';
            document.getElementById('detail-main-business').textContent = detail.mainBusiness || '暂无主营业务信息';
            
            console.log('Stock detail updated successfully');
        } catch (error) {
            console.error('Error updating stock detail:', error);
        }
    }
    // 格式化注册资本显示
    function formatCapital(capital) {
        if (!capital) return null;
        const num = parseFloat(capital);
        if (isNaN(num)) return capital;
        
        if (num >= 100000000) {
            return (num / 100000000).toFixed(2) + '亿元';
        } else if (num >= 10000) {
            return (num / 10000).toFixed(2) + '万元';
        }
        return num.toLocaleString() + '元';
    }
    // 显示加载状态
    function showLoading(element) {
        element.classList.add('loading');
    }
    // 隐藏加载状态
    function hideLoading(element) {
        element.classList.remove('loading');
    }
    // 显示错误消息
    function showErrorMessage(message) {
        // 可以使用toast或其他提示方式
        alert(message);
    }
    // 初始化详情面板事件
    function initializeDetailPanel() {
        console.log('Initializing detail panel...'); // 添加调试信息
        
        // 关闭按钮事件
        const closeBtn = document.querySelector('.close-detail-btn');
        if (!closeBtn) {
            console.error('Close button not found!'); // 添加错误检查
            return;
        }
        
        closeBtn.addEventListener('click', () => {
            console.log('Close button clicked'); // 添加调试信息
            const detailPanel = document.getElementById('stock-detail-panel');
            const mainContent = document.querySelector('.main-content');
            
            detailPanel.classList.add('hidden');
            mainContent.style.marginRight = '0'; // 恢复主内容区域的样式
        });
        
        // 标签切换事件
        const detailTabs = document.querySelectorAll('.detail-tab');
        console.log('Found detail tabs:', detailTabs.length); // 添加调试信息
        
        detailTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                console.log('Tab clicked:', tab.dataset.tab); // 添加调试信息
                
                // 移除所有标签的激活状态
                detailTabs.forEach(t => t.classList.remove('active'));
                // 激活当前标签
                tab.classList.add('active');
                
                // 切换内容显示
                const tabId = tab.dataset.tab;
                document.querySelectorAll('.detail-tab-content').forEach(content => {
                    content.classList.add('hidden');
                });
                document.getElementById(tabId).classList.remove('hidden');
            });
        });
        
        console.log('Detail panel initialized'); // 添加调试信息
    }
    const PageManager = {
        currentPage: null,

        switchTo(pageId) {
            // 如果当前页面与目标页面相同，不做任何操作
            if (this.currentPage === pageId) return;

            // 隐藏所有页面
            document.querySelectorAll('.page-container').forEach(page => {
                page.classList.add('hidden');
            });

            // 显示目标页面
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.remove('hidden');
                this.currentPage = pageId;

                // 触发页面切换事件
                this.onPageSwitch(pageId);
            }
        },

        onPageSwitch(pageId) {
            // 可以在这里添加页面切换时的额外逻辑
            // 例如：更新面包屑、更新标签页等
            console.log(`Switched to page: ${pageId}`);
        }
    };

    initializeDetailPanel();
    // 订单管理相关功能
    async function initializeOrdersPage() {
        await getUserInfo();
        // 初始化日期为今天
        const today = new Date();
        document.getElementById('operationDate').value = formatDate(today);
        
        // 查询按钮事件
        document.getElementById('searchOrders').addEventListener('click', () => {
            fetchOrders(1);
        });
        
        // 重置按钮事件
        document.getElementById('resetOrders').addEventListener('click', () => {
            resetOrderFilters();
        });
        
        // 初始加载订单数据
        fetchOrders(1);
    }
    // 获取订单数据
    async function fetchOrders(page = 1) {
        const filters = getOrderFilters();
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        const userId = storedUser?.userId;
        if (!userId) {
            console.error('用户信息不存在或用户未登录');
            showErrorMessage('请先登录');
            return;
        }
        try {
            showLoading(document.getElementById('orders-table'));
            const response = await axios.get(`${API_BASE_URL}/orderSelectServlet`, {
                params: {
                    userId,
                    page,
                    pageSize: 10,
                    ...filters
                }
            });
            const items = response.data?.data || [];
            const total = response.data?.total || 0;
            const currentPage = response.data?.currentPage || page;
            console.log(items);
            updateOrdersTable(items);
            updateOrdersPagination(total, currentPage, 'orders-pagination', fetchOrders);
            hideLoading(document.getElementById('orders-table'));
        } catch (error) {
            console.error('获取订单数据失败:', error);
            showErrorMessage('获取订单数据失败，请稍后重试');
            hideLoading(document.getElementById('orders-table'));
        }
    }
    // 获取筛选条件
    function getOrderFilters() {
        return {
            orderNo: document.getElementById('orderNo').value.trim(),
            tsCode: document.getElementById('orderTsCode').value.trim(),
            orderType: document.getElementById('orderType').value,
            orderStatus: document.getElementById('orderStatus').value,
            operationDate: document.getElementById('operationDate').value
        };
    }

    // 重置筛选条件
    function resetOrderFilters() {
        document.getElementById('orderNo').value = '';
        document.getElementById('orderTsCode').value = '';
        document.getElementById('orderType').value = '';
        document.getElementById('orderStatus').value = '';
        document.getElementById('operationDate').value = formatDate(new Date());
        
        fetchOrders(1);
    }

    // 更新订单表格
    function updateOrdersTable(orders) {
        const tbody = document.querySelector('#orders-table tbody');
        tbody.innerHTML = '';

        if (!orders || orders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="no-data">暂无订单数据</td>
                </tr>
            `;
            return;
        }

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.orderId}</td>
                <td>${order.tsCode}</td>
                <td>${formatOrderType(order.type)}</td>
                <td>${formatPrice(order.dealPrice)}</td>
                <td>${formatQuantity(order.dealNumber)}</td>
                <td>${formatPrice(order.dealValue)}</td>
                <td><span class="status-tag status-${order.status.toLowerCase()}">${formatOrderStatus(order.status)}</span></td>
                <td>${formatDateTime(order.dealDate)}</td>
                <td class="order-actions">
                    <button class="order-action-btn btn-view" data-order-no="${order.orderId}">
                        <i class="fas fa-eye"></i> 查看
                    </button>
                    ${order.status === 'pending' ? `
                        <button class="order-action-btn btn-cancel" data-order-no="${order.orderId}">
                            <i class="fas fa-times"></i> 取消
                        </button>
                    ` : ''}
                </td>
            `;
            
            // 添加事件监听器
            const viewBtn = row.querySelector('.btn-view');
            viewBtn.addEventListener('click', () => viewOrderDetail(order.orderNo));
            
            const cancelBtn = row.querySelector('.btn-cancel');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => cancelOrder(order.orderNo));
            }
            
            tbody.appendChild(row);
        });
    }

    // 格式化订单类型
    function formatOrderType(type) {
        const types = {
            'buy': '买入',
            'sell': '卖出'
        };
        return types[type] || type;
    }

    // 格式化订单状态
    function formatOrderStatus(status) {
        const statuses = {
            'pending': '待执行',
            'completed': '已完成',
            'cancelled': '已取消'
        };
        return statuses[status] || status;
    }

    // 查看订单详情
    async function viewOrderDetail(orderNo) {
        try {
            showLoading(document.getElementById('orders-table'));
            const response = await axios.get(`${API_BASE_URL}/orders/${orderNo}`);
            const orderDetail = response.data.data;
            
            // 显示订单详情弹窗
            showOrderDetailModal(orderDetail);
            hideLoading(document.getElementById('orders-table'));
        } catch (error) {
            console.error('获取订单详情失败:', error);
            showErrorMessage('获取订单详情失败，请稍后重试');
            hideLoading(document.getElementById('orders-table'));
        }
    }

    // 显示订单详情弹窗
    function showOrderDetailModal(orderDetail) {
        const modalHtml = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>订单详情</h3>
                        <button class="close-modal" onclick="closeOrderDetailModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>订单编号</label>
                                <span>${orderDetail.orderNo}</span>
                            </div>
                            <div class="detail-item">
                                <label>证券代码</label>
                                <span>${orderDetail.tsCode}</span>
                            </div>
                            <div class="detail-item">
                                <label>交易所</label>
                                <span>${orderDetail.exchange}</span>
                            </div>
                            <div class="detail-item">
                                <label>公司ID</label>
                                <span>${orderDetail.companyId}</span>
                            </div>
                            <div class="detail-item">
                                <label>委托价格</label>
                                <span>${formatPrice(orderDetail.price)}</span>
                            </div>
                            <div class="detail-item">
                                <label>委托数量</label>
                                <span>${formatQuantity(orderDetail.quantity)}</span>
                            </div>
                            <div class="detail-item">
                                <label>成交数量</label>
                                <span>${formatQuantity(orderDetail.executedQuantity)}</span>
                            </div>
                            <div class="detail-item">
                                <label>订单状态</label>
                                <span class="status-tag status-${orderDetail.status.toLowerCase()}">${formatOrderStatus(orderDetail.status)}</span>
                            </div>
                            <div class="detail-item">
                                <label>委托时间</label>
                                <span>${formatDateTime(orderDetail.createTime)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
    }

    // 格式化价格
    function formatPrice(price) {
        return price ? `¥${parseFloat(price).toFixed(2)}` : '--';
    }

    // 格式化数量
    function formatQuantity(quantity) {
        return quantity ? quantity.toLocaleString() : '--';
    }

    // 辅助函数：格式化日期
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function formatDateTime(dateString) {
        // 检查dateString是否有效
        if (!dateString || typeof dateString !== 'string') {
            console.error('Invalid date string:', dateString);
            return '';  // 返回空字符串或自定义错误信息
        }

        // 将空格替换为T，以符合ISO 8601标准格式
        const isoDateString = dateString.replace(' ', 'T');  // '2023-04-14T14:59:44'

        // 创建Date对象
        const date = new Date(isoDateString);

        // 判断是否是有效日期
        if (isNaN(date)) {
            console.error('Invalid date:', isoDateString);
            return '';  // 返回空字符串或自定义错误信息
        }

        // 格式化日期为 YYYY-MM-DD
        const formattedDate = formatDate(date);

        // 获取时间部分并格式化为 HH:mm:ss
        const formattedTime = date.toTimeString().split(' ')[0]; // '14:59:44'

        // 返回完整的日期时间字符串
        return `${formattedDate} ${formattedTime}`;
    }

// 示例：自定义的格式化日期函数（YYYY-MM-DD）
    function formatDate(date) {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

// 测试函数
    console.log(formatDateTime('2023-04-14 14:59:44')); // 2023-04-14 14:59:44
    console.log(formatDateTime('invalid date')); // Invalid date
    console.log(formatDateTime(undefined)); // Invalid date string: undefined
    console.log(formatDateTime(null)); // Invalid date string: null

    initializeOrdersPage();
    async function getUserInfo() {
        try {
            const response = await axios.get(`${API_BASE_URL}/getUserInfo`);
            const user = response.data;
            if (!user || Object.keys(user).length === 0) {
                console.log('用户未登录或无法获取用户信息');
                alert('用户未登录，请先登录');
                return;
            }

            if (user.name) {
                sessionStorage.setItem('user', JSON.stringify(user));
                const storedUser = JSON.parse(sessionStorage.getItem('user'));
                console.log(storedUser);
                console.log('用户信息已保存到 sessionStorage');
            } else {
                console.error('用户信息不完整:', user);
                alert('用户信息不完整，请重新登录');
            }
        } catch (error) {
            if (error.response) {
                // 服务器返回 401 错误，表示 Session 过期
                if (error.response.status === 401) {
                    console.log('用户 session 已过期');
                    sessionStorage.removeItem('user');
                    alert('您的 session 已过期，请重新登录');
                } else {
                    console.error('服务器响应错误:', error.response.status, error.response.data);
                    alert('服务器错误，请稍后再试');
                }
            } else if (error.request) {
                console.error('没有收到响应:', error.request);
                alert('网络错误，请检查网络连接');
            } else {
                console.error('请求失败:', error.message);
                alert('请求失败，请稍后再试');
            }
        }
    }
    // 更新订单分页
    function updateOrdersPagination(total, currentPage, containerId, callback) {
        const totalPages = Math.ceil(total / 10);
        const paginationContainer = document.getElementById(containerId);
        if (!paginationContainer) return;

        paginationContainer.innerHTML = '';

        // 最多显示的页码按钮数
        const maxVisible = 5;
        const half = Math.floor(maxVisible / 2);

        let startPage = Math.max(currentPage - half, 1);
        let endPage = Math.min(startPage + maxVisible - 1, totalPages);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(endPage - maxVisible + 1, 1);
        }

        // 上一页按钮
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '«';
        prevBtn.className = 'page-btn';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => callback(currentPage - 1));
        paginationContainer.appendChild(prevBtn);

        // 页码按钮
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = `page-btn${i === currentPage ? ' active' : ''}`;
            pageBtn.addEventListener('click', () => callback(i));
            paginationContainer.appendChild(pageBtn);
        }

        // 下一页按钮
        const nextBtn = document.createElement('button');
        nextBtn.textContent = '»';
        nextBtn.className = 'page-btn';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => callback(currentPage + 1));
        paginationContainer.appendChild(nextBtn);
    }

    // 持仓管理相关功能
    async function initializePositionPage() {
        await getUserInfo();
        // 初始加载持仓数据
        fetchPositions(1);
        
        // 添加刷新按钮事件监听
        const refreshBtn = document.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                // 添加旋转动画类
                const icon = refreshBtn.querySelector('i');
                icon.style.animation = 'spin 1s linear';
                
                // 禁用按钮防止重复点击
                refreshBtn.disabled = true;
                
                try {
                    await fetchPositions(1); // 重新获取第一页数据
                } catch (error) {
                    console.error('刷新数据失败:', error);
                    showErrorMessage('刷新数据失败，请稍后重试');
                } finally {
                    // 移除旋转动画并重新启用按钮
                    setTimeout(() => {
                        icon.style.animation = '';
                        refreshBtn.disabled = false;
                    }, 1000);
                }
            });
        }
    }

    // 获取持仓数据
    async function fetchPositions(page = 1) {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        const accountId = storedUser?.accountId;
        if (!accountId) {
            console.error('用户信息不存在或用户未登录');
            showErrorMessage('请先登录');
            return;
        }
        try {
            showLoading(document.getElementById('position-table'));
            const response = await axios.get(`${API_BASE_URL}/positionSelectServlet`, {
                params: {
                    accountId,
                    page,
                    pageSize: 10
                }
            });
            console.log(response.data);
            const  items = response.data.data||{};
            const  total = response.data.total;
            const  currentPage = response.data.currentPage;
            const  names=response.data.name;
            console.log(name);
            // 更新持仓概览
            updatePositionOverview(items,names);
            // 更新持仓列表
            updatePositionTable(items,names);
            // 更新分页
            updatePositionPagination(total, currentPage, 'position-pagination', fetchPositions);
            
            hideLoading(document.getElementById('position-table'));
        } catch (error) {
            console.error('获取持仓数据失败:', error);
            showErrorMessage('获取持仓数据失败，请稍后重试');
            hideLoading(document.getElementById('position-table'));
        }
    }

    // 更新持仓概览
    function updatePositionOverview(positions) {
        let totalMarketValue = 0;
        let totalProfitLoss = 0;
        console.log(positions);
        positions.forEach(position => {
            totalMarketValue += position.marketValue || 0;
            totalProfitLoss += position.profitLoss || 0;
        });

        // 更新总资产（假设有现金余额数据）
        const cashBalance = parseFloat(sessionStorage.getItem('cashBalance')) || 0;
        const totalAssets = totalMarketValue + cashBalance;

        document.querySelector('.total-assets').textContent = formatPrice(totalAssets);
        document.querySelector('.total-market-value').textContent = formatPrice(totalMarketValue);
        
        const totalProfitLossElement = document.querySelector('.total-profit-loss');
        totalProfitLossElement.textContent = formatPrice(totalProfitLoss);
        totalProfitLossElement.className = `total-profit-loss ${totalProfitLoss >= 0 ? 'positive' : 'negative'}`;
    }

    // 更新持仓表格
    function updatePositionTable(positions,names) {
        const tbody = document.querySelector('#position-table tbody');
        tbody.innerHTML = '';
        if (!positions || positions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" class="no-data">暂无持仓数据</td>
                </tr>
            `;
            return;
        }

        positions.forEach(position => {
            console.log(names[position.tsCode]? names[position.tsCode].name : '未知股票');
            const stockName = (names && names[position.tsCode]) ? names[position.tsCode].name : '未知股票';
            const profitLossPercent = (position.profitLoss / position.cost * 100).toFixed(2);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="align-center">${position.tsCode}</td>
                <td class="align-center">${stockName}</td>
                <td class="align-center">${formatQuantity(position.number)}</td>
                <td class="align-center">${formatPrice(position.dealPrice)}</td>
                <td class="align-center">${formatPrice(position.marketPrice)}</td>
                <td class="align-center">${formatPrice(position.marketValue)}</td>
                <td class="align-center">${formatPrice(position.cost)}</td>
                <td class="align-center">
                    <div class="profit-loss ${position.profitLoss >= 0 ? 'positive' : 'negative'}">
                        ${formatPrice(position.profitLoss)}
                        <span class="percentage">${profitLossPercent}%</span>
                    </div>
                </td>
                <td class="align-center">
                    <button class="position-action-btn btn-sell">
                        <i class="fas fa-sign-out-alt"></i> 卖出
                    </button>
                </td>
            `;

            // 添加卖出按钮点击事件
            const sellButton = row.querySelector('.btn-sell');
            sellButton.addEventListener('click', () => {
                showSellModal(position.tsCode, position.number, stockName, position.marketPrice,position.number);
            });

            tbody.appendChild(row);
        });
    }

    // 添加全局函数定义
    window.showSellModal = showSellModal;
    window.closeSellModal = closeSellModal;
    window.submitSellOrder = submitSellOrder;
    function closeSellModal() {
        const modal = document.querySelector('.sell-modal');
        if (modal) {
            // 添加淡出动画类
            modal.classList.add('fade-out');

            // 等待动画完成后移除模态框
            setTimeout(() => {
                modal.remove();
            }, 300); // 300ms 是动画持续时间
        }
    }
    // 添加验证函数到全局作用域
    window.validateInputs = function() {
        const priceInput = document.getElementById('sellPrice');
        const quantityInput = document.getElementById('sellQuantity');
        const priceError = document.getElementById('price-error');
        const quantityError = document.getElementById('quantity-error');
        let isValid = true;

        const price = parseFloat(priceInput.value);
        const quantity = parseInt(quantityInput.value);
        const availableQuantity = parseInt(quantityInput.getAttribute('max'));

        if (!price || price <= 0) {
            priceInput.classList.add('error');
            priceError.style.display = 'block';
            isValid = false;
        } else {
            priceInput.classList.remove('error');
            priceError.style.display = 'none';
        }

        if (!quantity || quantity <= 0 || quantity > availableQuantity || quantity % 100 !== 0) {
            quantityInput.classList.add('error');
            quantityError.style.display = 'block';
            isValid = false;
        } else {
            quantityInput.classList.remove('error');
            quantityError.style.display = 'none';
        }

        return isValid;
    };

    // 添加实时计算总金额的函数
    function setupTotalAmountCalculation() {
        const priceInput = document.getElementById('sellPrice');
        const quantityInput = document.getElementById('sellQuantity');
        const totalAmountInput = document.getElementById('totalAmount');

        function calculateTotal() {
            const price = parseFloat(priceInput.value) || 0;
            const quantity = parseInt(quantityInput.value) || 0;
            const total = price * quantity;
            totalAmountInput.value = formatPrice(total);
        }

        priceInput.addEventListener('input', calculateTotal);
        quantityInput.addEventListener('input', calculateTotal);
    }

    // 修改 showSellModal 函数，添加事件监听器的设置
    function showSellModal(tsCode, availableQuantity, stockName, currentPrice,number) {
        const modalHtml = `
            <div class="sell-modal">
                <div class="sell-modal-content">
                    <div class="sell-modal-header">
                        <h3>卖出股票</h3>
                        <button class="close-modal" onclick="closeSellModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="sell-modal-body">
                        <div class="form-group">
                            <label>股票名称</label>
                            <input type="text" value="${stockName}" readonly>
                        </div>
                        <div class="form-group">
                            <label>证券代码</label>
                            <input type="text" value="${tsCode}" readonly>
                        </div>
                        <div class="form-group">
                            <label>可卖数量</label>
                            <input type="text" value="${formatQuantity(availableQuantity)}" readonly>
                        </div>
                        <div class="form-group">
                            <label>当前价格</label>
                            <input type="text" value="${formatPrice(currentPrice)}" readonly>
                        </div>
                        <div class="form-group">
                            <label>卖出价格</label>
                            <div class="price-input-group">
                                <input type="number" 
                                       id="sellPrice" 
                                       step="0.01" 
                                       min="0" 
                                       placeholder="请输入卖出价格"
                                       value="${currentPrice}">
                            </div>
                            <div class="form-error" id="price-error">请输入有效的卖出价格</div>
                        </div>
                        <div class="form-group">
                            <label>卖出数量</label>
                            <div class="quantity-input-group">
                                <input type="number" 
                                       id="sellQuantity" 
                                       max="${availableQuantity}" 
                                       min="100" 
                                       step="100"
                                       placeholder="请输入卖出数量">
                            </div>
                            <div class="form-error" id="quantity-error">请输入有效的卖出数量（100的整数倍）</div>
                        </div>
                        <div class="form-group">
                            <label>预计交易金额</label>
                            <input type="text" id="totalAmount" value="--" readonly>
                        </div>
                    </div>
                    <div class="sell-modal-footer">
                        <button class="sell-btn-cancel" onclick="closeSellModal()">取消</button>
                        <button class="sell-btn-confirm" onclick="submitSellOrder('${tsCode}','${number}')">确认卖出</button>
                    </div>
                </div>
            </div>
        `;

        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);

        // 设置实时计算总金额
        setupTotalAmountCalculation();

        // 添加输入验证
        const priceInput = document.getElementById('sellPrice');
        const quantityInput = document.getElementById('sellQuantity');
        
        priceInput.addEventListener('blur', window.validateInputs);
        quantityInput.addEventListener('blur', window.validateInputs);
    }

    // 修改 submitSellOrder 函数，添加验证
    async function submitSellOrder(tsCode,number) {
        if (!window.validateInputs()) {
            return;
        }
        const orderId= generateOrderId();
        const price = document.getElementById('sellPrice').value;
        const quantity = document.getElementById('sellQuantity').value;

        try {
            const currentTime = new Date().toISOString();
            const response = await axios.get(`${API_BASE_URL}/submitOrderServlet`, {
                params: {
                    tsCode,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                    type: 'sell',
                    timestamp: currentTime,
                    orderId: orderId,
                    number: number
                }
            });
                console.log(response.data);
                console.log(response.data.data.success);
            if (response.data.data.success) {
                showSuccessMessage('卖出委托已提交');
                closeSellModal();
                fetchPositions(1); // 刷新持仓数据
            } else {
                showErrorMessage(response.data.message || '委托提交失败');
            }
        } catch (error) {
            console.error('提交卖出委托失败:', error);
            showErrorMessage('提交委托失败，请稍后重试');
        }
        fetchPositions(page=1)
    }

    // 添加成功提示函数
    function showSuccessMessage(message) {
        // 这里可以使用更优雅的提示方式，比如 Toast
        alert(message);
    }

    // 更新持仓分页
    function updatePositionPagination(total, currentPage, containerId, callback) {
        const totalPages = Math.ceil(total / 10);
        const paginationContainer = document.getElementById(containerId);
        if (!paginationContainer) return;

        paginationContainer.innerHTML = '';

        // 最多显示的页码按钮数
        const maxVisible = 5;
        const half = Math.floor(maxVisible / 2);

        let startPage = Math.max(currentPage - half, 1);
        let endPage = Math.min(startPage + maxVisible - 1, totalPages);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(endPage - maxVisible + 1, 1);
        }

        // 添加分页按钮
        if (totalPages > 1) {
            // 上一页按钮
            const prevBtn = document.createElement('button');
            prevBtn.textContent = '«';
            prevBtn.className = 'page-btn';
            prevBtn.disabled = currentPage === 1;
            prevBtn.addEventListener('click', () => callback(currentPage - 1));
            paginationContainer.appendChild(prevBtn);

            // 页码按钮
            for (let i = startPage; i <= endPage; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.textContent = i;
                pageBtn.className = `page-btn${i === currentPage ? ' active' : ''}`;
                pageBtn.addEventListener('click', () => callback(i));
                paginationContainer.appendChild(pageBtn);
            }

            // 下一页按钮
            const nextBtn = document.createElement('button');
            nextBtn.textContent = '»';
            nextBtn.className = 'page-btn';
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.addEventListener('click', () => callback(currentPage + 1));
            paginationContainer.appendChild(nextBtn);
        }
    }
    function generateOrderId() {
        // 获取当前时间，格式为：yyyyMMddHHmmss（年年年年月月日日时时分分秒秒）
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');  // 月份从0开始，所以加1
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // 时间部分
        const timePart = `${year}${month}${day}${hours}${minutes}${seconds}`;

        // 生成随机数部分（例如生成 6 位随机数字符串）
        const randomPart = Math.floor(100000 + Math.random() * 900000);  // 生成六位数随机数

        // 返回拼接后的字符串：时间部分 + 随机数部分
        return `${timePart}${randomPart}`;
    }

    // 实时行情相关功能
    function initializeMarketPage() {
        fetchMarketData('全部');
        // 初始化筛选标签点击事件
        const filterTags = document.querySelectorAll('.filter-tag');
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                filterTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                fetchMarketData(tag.textContent);
            });
        });

        // 初始化搜索功能
        const searchBtn = document.querySelector('.search-btn');
        const searchInput = document.querySelector('.search-input');
        
        // 添加点击搜索按钮事件
        searchBtn.addEventListener('click', () => {
            const keyword = searchInput.value.trim();
            if (keyword) {
                searchStocks(keyword);
            }
        });

        // 添加回车键搜索功能
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const keyword = searchInput.value.trim();
                if (keyword) {
                    searchStocks(keyword);
                }
            }
        });
        // 添加刷新按钮事件监听
        const refreshBtn = document.querySelector('.refresh-market-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                const activeTag = document.querySelector('.filter-tag.active');
                const filterType = activeTag ? activeTag.textContent : '全部';
                
                // 添加加载动画
                refreshBtn.classList.add('loading');
                refreshBtn.disabled = true;
                
                try {
                    await fetchMarketData(filterType);
                } catch (error) {
                    console.error('刷新数据失败:', error);
                    showErrorMessage('刷新数据失败，请稍后重试');
                } finally {
                    // 移除加载动画
                    setTimeout(() => {
                        refreshBtn.classList.remove('loading');
                        refreshBtn.disabled = false;
                    }, 500);
                }
            });
        }
    }

    // 获取行情数据
    async function fetchMarketData(filterType = '全部') {
        try {
            console.log(filterType);
            const response = await axios.get(`${API_BASE_URL}/marketDataServlet`, {
                params: {filterType }
            });
            
            if (response.data.success) {
                updateMarketTable(response.data.data);
            } else {
                showErrorMessage('获取行情数据失败');
            }
        } catch (error) {
            console.error('获取行情数据失败:', error);
            showErrorMessage('获取数据失败，请稍后重试');
        }
    }

    // 更新行情表格
    function updateMarketTable(stocks) {
        const tbody = document.querySelector('.market-table tbody');
        tbody.innerHTML = '';

        stocks.forEach(stock => {
            const row = document.createElement('tr');
            const pctChangeClass = stock.pctChange >= 0 ? 'up' : 'down';
            const netAmountClass = stock.netAmount >= 0 ? 'up' : 'down';

            row.innerHTML = `
                <td>${stock.tsCode}</td>
                <td>${stock.name}</td>
                <td>${formatPrice(stock.close)}</td>
                <td class="price-change ${pctChangeClass}">
                    ${formatPercent(stock.pctChange)}
                </td>
                <td>${formatPercent(stock.turnoverRate)}</td>
                <td>${formatAmount(stock.amount)}</td>
                <td class="price-change ${netAmountClass}">
                    ${formatAmount(stock.netAmount)}
                </td>
                <td>${formatAmount(stock.floatValues)}</td>
                <td>
                    <button class="buy-btn">
                        <i class="fas fa-shopping-cart"></i>
                        买入
                    </button>
                </td>
            `;

            // 为买入按钮添加事件监听器
            const buyBtn = row.querySelector('.buy-btn');
            buyBtn.addEventListener('click', () => {
                showBuyModal({
                    name: stock.name,
                    tsCode: stock.tsCode,
                    close: stock.close,
                    pctChange: stock.pctChange,
                    turnoverRate: stock.turnoverRate,
                    amount: stock.amount,
                    netAmount: stock.netAmount,
                    floatValues: stock.floatValues
                });
            });

            tbody.appendChild(row);
        });
    }

    // 格式化工具函数
    function formatPrice(price) {
        return price ? price.toFixed(2) : '--';
    }

    function formatPercent(value) {
        if (!value) return '--';
        return (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
    }

    function formatAmount(amount) {
        if (!amount) return '--';
        if (Math.abs(amount) >= 100000000) {
            return (amount / 100000000).toFixed(2) + '亿';
        }
        if (Math.abs(amount) >= 10000) {
            return (amount / 10000).toFixed(2) + '万';
        }
        return amount.toFixed(2);
    }

    // 显示买入模态框
    function showBuyModal(stockData) {
        console.log('Opening buy modal with data:', stockData);
        const modal = document.getElementById('buy-modal');
        
        if (!modal) {
            console.error('Buy modal element not found');
            return;
        }

        try {
            // 更新股票基本信息
            document.getElementById('modal-stock-name').textContent = stockData.name;
            document.getElementById('modal-stock-code').textContent = stockData.tsCode;
            
            // 更新价格信息
            const priceElement = document.getElementById('modal-current-price');
            const changeElement = document.getElementById('modal-price-change');
            const changePercentElement = document.getElementById('modal-price-change-percent');
            
            priceElement.textContent = formatPrice(stockData.close);
            const priceChange = stockData.close - stockData.close / (1 + stockData.pctChange / 100);
            changeElement.textContent = formatPriceChange(priceChange);
            changePercentElement.textContent = `(${formatPercent(stockData.pctChange)})`;
            
            // 设置涨跌色
            const priceClass = stockData.pctChange >= 0 ? 'up' : 'down';
            [priceElement, changeElement, changePercentElement].forEach(el => {
                el.className = priceClass;
            });

            // 更新市场信息
            document.getElementById('modal-turnover-rate').textContent = formatPercent(stockData.turnoverRate);
            document.getElementById('modal-amount').textContent = formatAmount(stockData.amount);
            document.getElementById('modal-net-amount').textContent = formatAmount(stockData.netAmount);

            // 设置默认买入价格
            document.getElementById('buy-price').value = stockData.close;
            const account = JSON.parse(sessionStorage.getItem('account'));
            console.log(account);
            const accountAsset =account.moneyRest;
            // 获取并显示可用资金
            const availableCash = parseFloat(accountAsset) || 0;
            document.getElementById('available-cash').value = formatPrice(availableCash);

            // 清空数量输入和错误提示
            document.getElementById('buy-quantity').value = '';
            document.getElementById('total-amount').value = '';
            hideErrors();

            // 绑定关闭按钮事件
            const closeBtn = modal.querySelector('.close-modal-btn');
            const cancelBtn = modal.querySelector('.btn-cancel');
            const confirmBtn = modal.querySelector('.btn-confirm');

            if (closeBtn) {
                closeBtn.addEventListener('click', closeBuyModal);
            }
            if (cancelBtn) {
                cancelBtn.addEventListener('click', closeBuyModal);
            }
            if (confirmBtn) {
                confirmBtn.addEventListener('click', submitBuyOrder);
            }

            // 显示模态框
            modal.classList.remove('hidden');
            modal.classList.add('show');

            // 设置实时计算
            setupCalculation();

            console.log('Modal opened successfully');
        } catch (error) {
            console.error('Error opening buy modal:', error);
            showErrorMessage('打开买入窗口时发生错误，请稍后重试');
        }
    }

    // 关闭买入模态框
    function closeBuyModal() {
        console.log('Closing buy modal');
        try {
            const modal = document.getElementById('buy-modal');
            if (!modal) {
                console.error('Buy modal element not found');
                return;
            }

            modal.classList.remove('show');
            modal.classList.add('hidden');

            // 清空输入
            const priceInput = document.getElementById('buy-price');
            const quantityInput = document.getElementById('buy-quantity');
            const totalAmount = document.getElementById('total-amount');
            
            if (priceInput) priceInput.value = '';
            if (quantityInput) quantityInput.value = '';
            if (totalAmount) totalAmount.value = '';

            // 隐藏错误提示
            hideErrors();

            console.log('Modal closed successfully');
        } catch (error) {
            console.error('Error closing buy modal:', error);
        }
    }

    // 调整价格
    function adjustPrice(amount) {
        const priceInput = document.getElementById('buy-price');
        const currentPrice = parseFloat(priceInput.value) || 0;
        priceInput.value = Math.max(0, (currentPrice + amount).toFixed(2));
        calculateTotal();
    }

    // 调整数量
    function adjustQuantity(amount) {
        const quantityInput = document.getElementById('buy-quantity');
        const currentQuantity = parseInt(quantityInput.value) || 0;
        quantityInput.value = Math.max(0, currentQuantity + amount);
        calculateTotal();
    }

    // 设置实时计算
    function setupCalculation() {
        const priceInput = document.getElementById('buy-price');
        const quantityInput = document.getElementById('buy-quantity');
        
        [priceInput, quantityInput].forEach(input => {
            input.addEventListener('input', calculateTotal);
        });
    }

    // 计算总金额
    function calculateTotal() {
        const price = parseFloat(document.getElementById('buy-price').value) || 0;
        const quantity = parseInt(document.getElementById('buy-quantity').value) || 0;
        const total = price * quantity;
        document.getElementById('total-amount').value = formatPrice(total);
    }

    // 隐藏错误提示
    function hideErrors() {
        document.getElementById('price-error').style.display = 'none';
        document.getElementById('quantity-error').style.display = 'none';
    }

    // 提交买入订单
    // 修改 submitBuyOrder 函数
    async function submitBuyOrder() {
        if (!validateInputs()) return;

        const orderId = generateOrderId();
        const tsCode = document.getElementById('modal-stock-code').textContent;
        const price = parseFloat(document.getElementById('buy-price').value);
        const quantity = parseInt(document.getElementById('buy-quantity').value);
        const marketValue = parseFloat(document.getElementById('modal-current-price').textContent); // 获取初始价格

        try {
            const response = await axios.get(`${API_BASE_URL}/submitBuyOrderServlet`, {
                params: {
                    orderId,
                    tsCode,
                    price,
                    quantity,
                    marketValue,
                    type: 'buy',
                    timestamp: new Date().toISOString()
                }
            });
            console.log(response.data);
            if (response.data.data.success) {
                showSuccessMessage('买入委托已提交');
                closeBuyModal();
                // 刷新市场数据
                fetchMarketData('全部');
            } else {
                showErrorMessage(response.data.message || '委托提交失败');
            }
        } catch (error) {
            console.error('提交买入委托失败:', error);
            showErrorMessage('提交委托失败，请稍后重试');
        }
    }

    // 验证输入
    function validateInputs() {
        const priceInput = document.getElementById('buy-price');
        const quantityInput = document.getElementById('buy-quantity');
        const priceError = document.getElementById('price-error');
        const quantityError = document.getElementById('quantity-error');
        let isValid = true;

        const price = parseFloat(priceInput.value);
        const quantity = parseInt(quantityInput.value);
        const availableCash = parseFloat(document.getElementById('available-cash').value.replace(/[^0-9.-]+/g, ''));

        // 验证价格
        if (!price || price <= 0) {
            priceError.textContent = '请输入有效的价格';
            priceError.style.display = 'block';
            isValid = false;
        } else {
            priceError.style.display = 'none';
        }

        // 验证数量
        if (!quantity || quantity <= 0 || quantity % 100 !== 0) {
            quantityError.textContent = '请输入有效的数量（100的整数倍）';
            quantityError.style.display = 'block';
            isValid = false;
        } else {
            quantityError.style.display = 'none';
        }

        // 验证资金是否充足
        const totalAmount = price * quantity;
        if (totalAmount > availableCash) {
            showErrorMessage('可用资金不足');
            isValid = false;
        }

        return isValid;
    }

    // 搜索股票函数
    async function searchStocks(keyword) {
        if (!keyword) return;
        console.log(keyword);
        try {
            // 添加加载状态
            const tableBody = document.querySelector('.market-table tbody');
            tableBody.innerHTML = '<tr><td colspan="9" class="loading">搜索中...</td></tr>';
            
            const response = await axios.get(`${API_BASE_URL}/marketDataServlet`, {
                params: {
                    keyword: keyword,
                    filterType: 'search'
                }
            });

            if (response.data.success) {
                console.log('Search results:', response.data.data);
                updateMarketTable(response.data.data);
            } else {
                showErrorMessage('搜索失败：' + response.data.message);
            }
        } catch (error) {
            console.error('搜索股票失败:', error);
            showErrorMessage('搜索失败，请稍后重试');
        }
    }

    // 添加其他必要的辅助函数
    function formatPriceChange(change) {
        return change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2);
    }

    // 确保在 DOM 加载完成后初始化所有事件监听器
    document.addEventListener('DOMContentLoaded', function() {
        // 初始化关闭按钮事件
        const closeBtn = document.querySelector('.close-modal-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeBuyModal);
        }

        // 初始化取消按钮事件
        const cancelBtn = document.querySelector('.btn-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeBuyModal);
        }

        // 初始化确认按钮事件
        const confirmBtn = document.querySelector('.btn-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', submitBuyOrder);
        }
    });

    // 在 index.js 中添加全局函数定义
    window.showBuyModal = showBuyModal;
    window.closeBuyModal = closeBuyModal;
    window.adjustPrice = adjustPrice;
    window.adjustQuantity = adjustQuantity;
    window.submitBuyOrder = submitBuyOrder;

    // 初始化个人设置页面
    async function initializeUserSettings() {
        try {
            const response = await axios.get(`${API_BASE_URL}/getUserSettings`);
            console.log("response", response);
            console.log("response.data", response.data);
            console.log("response.data.data", response.data.data);
            const { user, account } = response.data.data;
            sessionStorage.setItem('account', JSON.stringify(account));
            // 填充用户基本信息 - 修改这里的ID以匹配HTML
            document.getElementById('userId').value = user.userId;
            document.getElementById('nickName').value = user.nickName;
            document.getElementById('uname').value = user.name;  // 修改这里，从 'name' 改为 'uname'
            document.getElementById('sex').value = user.sex;
            document.getElementById('phone').value = user.phone;
            document.getElementById('role').value = user.role;
            document.getElementById('status').value = user.status;
            document.getElementById('createTime').value = formatDateTime(user.createTime);
            
            // 填充账户信息
            document.getElementById('accountId').value = account.accountId;
            document.getElementById('asset').value = formatPrice(account.asset);
            document.getElementById('marketValue').value = formatPrice(account.marketValue);
            document.getElementById('moneyRest').value = formatPrice(account.moneyRest);
            
        } catch (error) {
            console.error('获取用户设置失败:', error);
            showErrorMessage('获取用户设置失败，请稍后重试');
        }
    }

    // 保存用户设置
    async function saveUserSettings() {
        try {
            const userData = {
                nickName: document.getElementById('nickName').value,
                sex: document.getElementById('sex').value,
                phone: document.getElementById('phone').value
            };

            const response = await axios.post(`${API_BASE_URL}/updateUserSettings`, userData);
            
            if (response.data.success) {
                showSuccessMessage('保存成功');
                initializeUserSettings(); // 刷新数据
            } else {
                showErrorMessage(response.data.message || '保存失败');
            }
        } catch (error) {
            console.error('保存用户设置失败:', error);
            showErrorMessage('保存失败，请稍后重试');
        }
    }

    // 修改密码
    async function changePassword() {
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // 验证密码
        if (!oldPassword || !newPassword || !confirmPassword) {
            showErrorMessage('请填写完整的密码信息');
            return;
        }

        if (newPassword !== confirmPassword) {
            showErrorMessage('两次输入的新密码不一致');
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/changePassword`, {
                oldPassword,
                newPassword
            });

            if (response.data.success) {
                showSuccessMessage('密码修改成功');
                // 清空密码输入框
                document.getElementById('oldPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
            } else {
                showErrorMessage(response.data.message || '密码修改失败');
            }
        } catch (error) {
            console.error('修改密码失败:', error);
            showErrorMessage('修改密码失败，请稍后重试');
        }
    }

    // 在加载个人设置页面时初始化
    function loadUserPage() {
        initializeUserSettings();
    }
});