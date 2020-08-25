window.onload = function () {
    // 登录界面->忘记密码
    toPage('#to-rechieve', '#rechieve')
    // 登录界面->注册界面
    toPage('#to-register', '#register')
    // 忘记密码->登陆界面
    toPage('#rechieve-log', '#login')
    // 注册界面->登录界面
    toPage('#reg-log', '#login');

    // 记住我
    remember();
    if (getCookie('pwd')) {
        $('#log-rem').data('checked', true);
        $('#log-rem').prop('checked', true);
        $('#log-email').val(getCookie('email'));
        let b = new Base64();
        let pwd = b.decode(getCookie('pwd'));
        $('#log-password').val(pwd);

    }

    // 功能事件
    loginBind();
    registerBind();
    codeBind();
    rechieveBind();

    // 表单验证
    checkForm('#log-email', isEmailValid);
    checkForm('#log-password', isPwdValid);
    checkForm('#reg-email', isEmailValid);
    checkForm('#reg-password', isPwdValid);
    checkForm('#reg-confirm', isPwdComfirm('#reg-password', '#reg-confirm'));
    checkForm('#reg-nickname', isNicknameValid);
    checkForm('#rechieve-email', isEmailValid);
    checkForm('#rechieve-password', isPwdValid);
    checkForm('#rechieve-confirm', isPwdComfirm('#rechieve-password', '#rechieve-confirm'));
    hideLoading();

}

// 页面切换
function toPage(dom, target) {
    $(dom).click(function () {
        $('.panel').fadeOut(0);
        $(target).fadeIn(500).css('display', 'flex');
    })
}


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

// 记住我
function remember() {
    $('#log-rem').click(ev => {
        ev.stopPropagation();
    })
    $('#remember').click(function () {
        if ($('#log-rem').data('checked')) {
            $('#log-rem').data('checked', false);
        } else {
            $('#log-rem').data('checked', true);
        }
    })
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

// 登录事件
function loginBind() {
    $('#login-btn').bind('click', function () {

        $(this).unbind('click');
        let email = $('#log-email').val();
        let pwd = $('#log-password').val();
        if (email == '' || pwd == '' || !email || !pwd) {
            alertIt('用户名或密码不能为空!');
            loginBind();
            return;
        }
        if (isEmailValid(email) && isPwdValid(pwd)) {
            let data = {
                "email": email,
                "password": pwd
            }
            let url = 'http://39.98.41.126:30004/api/user/login';
            showLoading();
            doPost(url, data).then(res => {
                if (res.code == 1) {
                    alertIt('登录成功！')
                    // 设置cookie
                    let base = new Base64();
                    pwd = base.encode(pwd);
                    if ($('#log-rem').prop('checked')) {
                        setCookie('email', email, 7);
                        setCookie('pwd', pwd, 7);
                    } else {
                        delCookie('pwd');
                    }
                    setCookie('Buuid', res.msg, 7);
                    $('#log-email').val('');
                    $('#log-password').val('');
                    $('#log-rem').data('checked', false);
                    $('#log-rem').prop('checked', false);
                    location.assign('./pages/personal.html');

                } else {
                    alertIt(res.msg);
                    loginBind();
                    hideLoading();
                    return;
                }
            })
        } else {
            alertIt('请检查密码和邮箱格式！')
            loginBind();
            return;
        }
    })
}

// 校验邮箱
function isEmailValid(email) {
    let re = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return re.test(email);
}
// 校验密码
function isPwdValid(pwd) {
    return (pwd.length >= 6 && pwd.length <= 15);
}

// 使用post请求
function doPost(url, data, bindFn) {
    return new Promise((resolve) => {
        $.ajax({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json",
                "Auuid": getCookie('Auuid'),
                "Buuid": getCookie('Buuid')
            },
            data: JSON.stringify(data),
            success: function (res, status, xhr) {
                resolve(res)
            },
            error: function () {
                alertIt("服务器连接失败！请联系管理员！");
                hideLoading();
                if (bindFn) {
                    bindFn();
                }
            }
        })
    })
}

// 注册事件
function registerBind() {
    $('#reg-in').bind('click', function () {
        $('#reg-in').unbind('click')
        let nickname = $('#reg-nickname').val();
        let email = $("#reg-email").val();
        let pwd1 = $('#reg-password').val();
        let pwd2 = $('#reg-confirm').val();

        if (email == '' || pwd1 == '' || nickname == '' || !email || !pwd1 || !nickname) {
            alertIt('信息不能为空！');
            registerBind();
            return;
        }
        if (isEmailValid(email) && isPwdComfirm(pwd1, pwd2) && isNicknameValid(nickname)) {
            let url = 'http://39.98.41.126:30004/api/user/register';
            let data = {
                "email": email,
                "password": pwd1,
                "nickname": nickname
            }
            showLoading();
            doPost(url, data, registerBind).then(res => {
                hideLoading();
                if (res.code == 1) {
                    alertIt('注册成功！');
                    $('#reg-nickname').val('');
                    $("#reg-email").val('');
                    $('#reg-password').val('');
                    $('#reg-confirm').val('');
                } else {
                    alertIt(res.msg);
                    registerBind();
                    hideLoading();
                    return;
                }
            })
        } else {
            alertIt('信息填写错误！');
            registerBind();
            hideLoading();
            return;
        }
    })
}

// 确认密码
function isPwdComfirm(p1, p2) {
    let pwd1 = $(p1).val();
    let pwd2 = $(p2).val();
    return pwd1 == pwd2;
}

// 昵称是否合法
function isNicknameValid(name) {
    return (name.length >= 3 && name.length <= 10)
}


// 获取验证码
function codeBind() {
    $('.rechieve-send').bind('click', function () {
        let email = $('#rechieve-email').val();
        if (isEmailValid(email)) {
            $('.rechieve-send').unbind('click');
            let time = 60;
            let timer = null;
            if (!timer) {
                timer = setInterval(() => {
                    $('.rechieve-send').text(time);
                    if (time) {
                        time--;
                    } else {
                        clearInterval(timer);
                        time = 60;
                        $('.rechieve-send').text('获取验证码');
                        codeBind();
                    }
                }, 1000)
            }

            let url = 'http://39.98.41.126:30004/api/user/getCode';
            let data = {
                "email": email
            }
            alertIt('正在发送验证码......')
            doPost(url, data).then(res => {
                if (res.code == 1) {
                    setCookie('Auuid', res.msg);
                    hideLoading();
                    alertIt('验证码已发送，请留意邮箱！');
                } else {
                    hideLoading();
                    alertIt(res.msg + '!请' + time + '秒后重试！');
                }
            })

        } else {
            alertIt('邮箱格式错误！');
            codeBind();
            return;
        }
    })
}
// 找回密码
function rechieveBind() {
    $('#rechieve-reset').bind('click', function () {
        $('#rechieve-reset').unbind('click')
        let email = $('#rechieve-email').val();
        let pwd1 = $('#rechieve-password').val();
        let pwd2 = $('#rechieve-confirm').val();
        let code = $('#rechieve-code').val();

        if (email == '' || pwd1 == '' || code == '' || !email || !pwd1 || !code) {
            alertIt('信息不能为空！');
            rechieveBind();
            return;
        }
        if (isEmailValid(email) && isPwdComfirm(pwd1, pwd2)) {
            let url = 'http://39.98.41.126:30004/api/user/findPass';
            let data = {
                "email": email,
                "password": pwd1,
                "code": code
            };
            showLoading();
            doPost(url, data, rechieveBind)
                .then(res => {
                    if (res.code == 1) {
                        alertIt('密码修改成功！');
                        $('#rechieve-email').val('');
                        $('#rechieve-password').val('');
                        $('#rechieve-confirm').val('');
                        $('#rechieve-code').val('');
                        hideLoading();
                        return;
                    } else {
                        alertIt(res.msg);
                        rechieveBind();
                        hideLoading();
                        return;
                    }
                })
        } else {
            alertIt('请检查信息格式！');
            rechieveBind();
            return;
        }

    })
}

// 警告颜色
function warnIt(domId) {
    let style = '1px solid red'
    $(domId).css('border', style);
}

// 恢复颜色
function recover(domId) {
    let style = '1px solid rgba(128, 128, 128, 1)'
    $(domId).css('border', style);
}



// 表单验证
function checkForm(domID, checkFn) {
    if (domID != '#reg-confirm' && domID != '#rechieve-confirm') {
        $(domID).blur(function () {
            if (checkFn($(domID).val())) {
                recover(domID);
            } else {
                warnIt(domID);
            }
        })
    } else {
        $(domID).blur(function () {
            if (checkFn) {
                recover(domID);
            } else {
                warnIt(domID);
            }
        })
    }

}

// loading
function showLoading() {
    $('#loading').fadeIn(500);
}

function hideLoading() {
    $('#loading').fadeOut(300);
}