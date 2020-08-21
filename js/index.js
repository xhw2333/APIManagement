
var server = "http://39.98.41.126:30004/api/user";



//切换“登录”、“注册”、“找回密码”页面
var mainPage = document.getElementsByClassName("main-page");

//登录-->注册
var logToreg = document.getElementById('log-reg');
logToreg.onclick = function(){
    showPage(1);
}

//注册->登录
var regTolog = document.getElementById('reg-log');
regTolog.onclick = function(){
    showPage(0);
}

//登录->找回密码
var logToback = document.getElementById('log-back');
logToback.onclick = function(){
    showPage(2);
}

//找回密码->登录
var backTolog = document.getElementById('back-log');
backTolog.onclick = function(){
    showPage(0);
} 

//展示特定页面
function showPage(num){
    for(let i = 0; i < mainPage.length; i++){
        mainPage[i].classList.add('hide');
    }
    mainPage[num].classList.remove('hide');
}




function postDo(url,data){
    return new Promise((resolve)=>{
        $.ajax({
            method: "POST",
            url: server+ url,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            success: function (res) {
                resolve(res);
            },
            error: function () {
                alert('error!^_^!');
            }
        })
    })
}

//点击登录按钮
var logIn = document.getElementById("log-in");
logIn.onclick = function(){
    let logEmail = document.getElementById("log-email");
    let logPassword = document.getElementById('log-password');
    let data = {
        email: logEmail.value,
        password: logPassword.value
    }
    console.log(data);
    postDo('/login',data).then((res)=>{
        console.log(res.msg);
    });
}


//点击注册按钮
var regIn = document.getElementById("reg-in");
regIn.onclick = function(){
    let regEmail = document.getElementById("reg-email");
    let regUsername = document.getElementById("reg-username");
    let regPassword = document.getElementById("reg-password");
    let data = {
        email: regEmail.value,
        password: regPassword.value,
        nickname: regUsername.value
    }
    console.log(data);
    postDo('/register',data);
   
}

























//发送请求做某事
function postDoD(url,data){
    //发送请求
    fetch(server+url, {
       method: 'POST',
       body: JSON.stringify(data),
       headers: {
           "Content-Type": "application/json"
       }
   })
   .then(res => {
       return res.json();      //返回一个promise对象
   })
   .then(resjson => {
       console.log(resjson);

    //    callback(resjson);
   })
   .catch(e=>{
    //    hideLoading();
       alert("服务器连接失败！请联系管理员！")
   });
}