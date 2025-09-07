document.addEventListener('DOMContentLoaded', function() {
    // 模拟数据
    let topics = JSON.parse(localStorage.getItem('forum_topics')) || [];
    let users = JSON.parse(localStorage.getItem('forum_users')) || [];
    let currentUser = null;
    
    // DOM元素
    const topicsList = document.querySelector('.topics-list');
    const topicCount = document.getElementById('topic-count');
    const replyCount = document.getElementById('reply-count');
    const userCount = document.getElementById('user-count');
    const usernameSpan = document.getElementById('username');
    
    // 模态框元素
    const newTopicModal = document.getElementById('new-topic-modal');
    const authModal = document.getElementById('auth-modal');
    const topicDetailModal = document.getElementById('topic-detail-modal');
    
    // 按钮元素
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const newTopicBtn = document.getElementById('new-topic-btn');
    
    // 表单元素
    const newTopicForm = document.getElementById('new-topic-form');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const newReplyForm = document.getElementById('new-reply-form');
    
    // 初始化论坛数据
    updateStats();
    renderTopics();
    
    // 事件监听器
    loginBtn.addEventListener('click', () => showModal(authModal));
    registerBtn.addEventListener('click', () => showModal(authModal));
    newTopicBtn.addEventListener('click', () => {
        if (currentUser) {
            showModal(newTopicModal);
        } else {
            showModal(authModal);
        }
    });
    
    // 关闭模态框
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            hideAllModals();
        });
    });
    
    // 点击模态框背景关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideAllModals();
            }
        });
    });
    
    // 标签切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // 更新激活的标签
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 更新显示的表单
            document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
            document.getElementById(`${tab}-form`).classList.add('active');
        });
    });
    
    // 表单提交
    newTopicForm.addEventListener('submit', handleNewTopic);
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    // 功能函数
    function updateStats() {
        let totalReplies = 0;
        topics.forEach(topic => {
            totalReplies += topic.replies ? topic.replies.length : 0;
        });
        
        topicCount.textContent = topics.length;
        replyCount.textContent = totalReplies;
        userCount.textContent = users.length + 1; // 包括默认用户
    }
    
    function renderTopics() {
        topicsList.innerHTML = '';
        
        if (topics.length === 0) {
            topicsList.innerHTML = '<div class="no-topics">暂无主题，成为第一个发帖的人吧！</div>';
            return;
        }
        
        topics.forEach((topic, index) => {
            const topicItem = document.createElement('div');
            topicItem.className = 'topic-item';
            topicItem.innerHTML = `
                <div class="topic-title">${topic.title}</div>
                <div class="topic-meta">
                    <span>作者: ${topic.author}</span>
                    <span>分类: ${topic.category}</span>
                    <span>回复: ${topic.replies ? topic.replies.length : 0}</span>
                    <span>时间: ${topic.date}</span>
                </div>
            `;
            
            topicItem.addEventListener('click', () => {
                showTopicDetail(index);
            });
            
            topicsList.appendChild(topicItem);
        });
    }
    
    function showTopicDetail(index) {
        const topic = topics[index];
        document.getElementById('detail-title').textContent = topic.title;
        document.getElementById('detail-author').textContent = `作者: ${topic.author}`;
        document.getElementById('detail-category').textContent = `分类: ${topic.category}`;
        document.getElementById('detail-date').textContent = `时间: ${topic.date}`;
        document.getElementById('detail-content').textContent = topic.content;
        
        // 渲染回复列表
        const repliesList = document.getElementById('replies-list');
        repliesList.innerHTML = '';
        
        if (topic.replies && topic.replies.length > 0) {
            topic.replies.forEach(reply => {
                const replyItem = doc