// 页面切换
function toPage(dom, target) {
    $(dom).click(function () {
        $('.panel').fadeOut(0);
        $(target).fadeIn(500).css('display', 'flex');
    })
}
// 登录界面->忘记密码
toPage('#to-rechieve', '#rechieve')
// 登录界面->注册界面
toPage('#to-register', '#register')
// 忘记密码->登陆界面
toPage('#rechieve-log', '#login')
// 注册界面->登录界面
toPage('#reg-log', '#login');

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
    document.cookie = name + '=' + value + ';expires=' + date;
};

// 删除cookie
function delCookie(name) {
    setCookie(name, null, -1);
}

// 记住我
$('#log-rem').click(ev => {
    ev.stopPropagation();
})
$('#remember').click(function () {
    if ($('#log-rem').data('checked') || $('#log-rem').prop('checked')) {
        $('#log-rem').data('checked', false);
        $('#log-rem').prop('checked', false);
    } else {
        $('#log-rem').data('checked', true);
        $('#log-rem').prop('checked', true);
    }
})

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

// 登录事件
$('#login-btn').bind('click', function () {
    alertIt('登录中，请稍后！')
    // $(this).unbind('click');
    let email = $('#log-email').val();
    let pwd  = $('#log-password').val();
    if (email == '' || pwd == '' || !email || !pwd) {
        alertIt('用户名或密码不能为空!')
        return;
    }
    if (isEamilValid(email) && isPwdValid(pwd)) {
        let data = {
            "email": email,
            "password": pwd
        }
        let url = 'http://39.98.41.126:30004/api/user/login';
        doPost(url, data).then(res => {
            if(res.code){
                alertIt(res.msg);
                $('#log-email').val('');
                $('#log-password').val('');
            }else{
                alertIt(res.msg);
                return;
            }
        })
    } else {
        return;
    }
})

// 校验邮箱
function isEamilValid(email) {
    let re = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return re.test(email);
}
// 校验密码
function isPwdValid(pwd) {
    return (pwd.length >= 6 && pwd.length <= 15);
}

// 使用post请求
function doPost(url, data) {
    return new Promise((resolve) => {
        $.ajax({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            success: function (res, status, xhr) {
                // setCookie('session',xhr.getResponseHeader('SESSION'))
                resolve(res)
            },
            error: function () {
                alertIt("服务器连接失败！请联系管理员！")
            }
        })
    })
}

// 注册事件
$('#reg-in').click(function () {
    let nickname = $('#reg-nickname').val();
    let email = $("#reg-email").val();
    let pwd = $('#reg-password').val();
    let pwd2 = $('#reg-confirm').val();

    if (email == '' || pwd == '' || nickname == '' || !email || !pwd || !nickname) {
        alertIt('信息不能为空！')
        return;
    }
    if (isEamilValid(email) && isPwdComfirm(pwd, pwd2) && isNicknameValid(nickname)) {
        let url = 'http://39.98.41.126:30004/api/user/register';
        let data = {
            "email": email,
            "password": pwd,
            "nickname": nickname
        }

        doPost(url, data).then(res => {
            if (res.code) {
                alertIt(res.msg);
                $('#reg-nickname').val('');
                $("#reg-email").val('');
                $('#reg-password').val('');
                $('#reg-confirm').val('');
            } else {
                alertIt(res.msg);
                return;
            }
        })
    } else {
        alertIt('信息填写错误！');
        return;
    }
})

// 确认密码
function isPwdComfirm(p1, p2) {
    return p1 == p2
}

// 昵称是否合法
function isNicknameValid(name) {
    return (name.length >= 3 && name.length <= 10)
}
