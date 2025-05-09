document.getElementById('logout-btn').addEventListener('click', function () {
  if (confirm('Are you sure you want to logout?')) {
    // 清除所有登录状态
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');

    // 智能路径处理（兼容本地和服务端）
    const currentPath = window.location.pathname;
    let basePath = '';

    // 检测是否在本地文件系统
    if (window.location.protocol === 'file:') {
      if (currentPath.includes('/softeng/')) {
        basePath = currentPath.split('/softeng/')[0] + '/softeng/';
      } else {
        // 如果不在softeng目录，可能需要调整
        basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
      }
    }

    // 跳转到登录页（路径已修正）
    window.location.href = `${basePath}login/login.html`;
  }
});