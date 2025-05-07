document.getElementById('logout-btn').addEventListener('click', function () {
    // 清除存储的用户信息
    localStorage.removeItem('user');  // 假设用户信息存储在 localStorage

    // 重定向到登录页面
    window.location.href = 'login.html';  // 假设登录页面为 login.html

    // 可选：显示登出确认消息
    alert('You have been logged out successfully!');
});
