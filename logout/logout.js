document.getElementById('logout-btn').addEventListener('click', function () {
    // ����洢���û���Ϣ
    localStorage.removeItem('user');  // �����û���Ϣ�洢�� localStorage

    // �ض��򵽵�¼ҳ��
    window.location.href = 'login.html';  // �����¼ҳ��Ϊ login.html

    // ��ѡ����ʾ�ǳ�ȷ����Ϣ
    alert('You have been logged out successfully!');
});
