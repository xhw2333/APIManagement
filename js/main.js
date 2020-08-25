
// 获取cookie
function getCookie(name) {
    var reg = RegExp(name + '=([^;]+)');
    var arr = document.cookie.match(reg);
    if (arr) {
        return arr[1];
    } else {
        return '';
    }
}

// 设置cookie
function setCookie(name, value, day) {
    var date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires=' + date + ';path=/';
};

// 删除cookie
function delCookie(name) {
    setCookie(name, null, -1);
}

// 提示框
let alertTimer = null;
function alertIt(content) {
    $('#alert-div').html(content);
    $('#alert-div').slideDown(500);
    if (alertTimer) {
        alertTimer = null;
        clearTimeout(alertTimer);
    } else {
        alertTimer = setTimeout(() => {
            $('#alert-div').slideUp(500);
            alertTimer = null;
        }, 3000);
    }
}

// 退出登录
$('.exit').click( function(){
    delCookie('Buuid');
    location.assign('../index.html');
})


// loading
function showLoading(){
    $('#loading').fadeIn(500);
}

function hideLoading(){
    $('#loading').fadeOut(300);
}


// 判断Buuid
if(!getCookie('Buuid')){
    alert('请先登录！');
    location.assign('../index.html');
}

// 返回事件
$('.return-manage').click(function(){
    location.assign('./apiManagement.html');
})

hideLoading();