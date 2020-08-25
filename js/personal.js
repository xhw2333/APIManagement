
var server1 = 'http://39.98.41.126:30008/api/member';
var server2 = 'http://39.98.41.126:30004/api/user';
var server3 = 'http://39.98.41.126:30004/api/apis';

//切换个人页面
var personTab = document.getElementsByClassName('side-tabs');
var personPage = document.getElementsByClassName('operation-part');

var email = getCookie('email');
var Buuid = getCookie('Buuid');
var data = {
    email:email
}
console.log(email);
console.log(Buuid);
//加载
showLoading();

//展示项目及其接口
showApis();
//基本信息展示
showMessage();


//点击我的信息
personTab[0].onclick = function(){
    hidePerPage();
    personPage[0].classList.remove('hide');
    personTab[0].classList.add('side-now');
    //清空
    clearContent();
    //加载
    showLoading();

    //展示项目及其接口
    showApis();
    //基本信息展示
    showMessage();

}

//点击我的团队
personTab[1].onclick = function(){
    hidePerPage();
    personPage[1].classList.remove('hide');
    personTab[1].classList.add('side-now');
    //清空
    clearContent();
    //加载
    showLoading();
    //项目列表以及成员查看
    lookProject();
}

//点击邀请信息
personTab[2].onclick = function(){
    hidePerPage();
    personPage[2].classList.remove('hide');
    personTab[2].classList.add('side-now');
    //清空
    clearContent();
    //加载
    showLoading();
    //基本信息展示
    showMessage();
    //查看邀请信息
    lookInvite(data);
}

//隐藏页面
function hidePerPage(){
    for(let i = 0; i < personPage.length; i++){
        personPage[i].classList.add('hide');
        personTab[i].classList.remove('side-now');
    }
}

//请求后做某事
function postDo(url,data){
    return new Promise((resolve)=>{
        $.ajax({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json",
                "Buuid" : Buuid
            },
            data: JSON.stringify(data),
            success: function (res) {
                resolve(res);
            },
            error: function () {
                alertIt('服务器有问题，请联系管理员');
                //消失
                hideLoading();
            }
        })
    })
}






var projectId = [];
var projectName = [];
//我参与的项目


let nozzleList = document.getElementById('nozzle-list');


function showApis(){
    postDo(server1+'/list',data).then((res)=>{
    
        // nozzleList.innerHTML = ''
        for(let i = 0; i < res.length; i++){
            var data = {
                projectId: res[i].id
            }        
            
            postDo(server3 + '/getModulesAndApis',data).then((res)=>{
                let apis = res.data.apis;
                nozzleList.innerHTML += `<tr id="nozzle-item" class="nozzle-item">
                                                <td>
                                                    <i>${res.data.name}</i> 
                                                </td>
                                            </tr>`;
                for(let i = 0; i < apis.length; i++){
                    nozzleList.innerHTML += createAPIs(apis[i]);
                }
    
                let nozzleTr = nozzleList.getElementsByTagName('tr');
                diviPage(nozzleTr);
                addPageChange();
                //页面跳转
                toPage();

                //消失
                hideLoading();
            })
        }    
        
    })
}


//数字对应的状态
function getStatus(status){
    if(status == 1) return "已发布";
    else if(status == 2) return "设计中";
    else if(status == 3) return "测试";
    else if(status == 4) return "维护";
    else if(status == 5) return "废弃";
}

//数字对应的颜色
function getStatusColor(status) {
    if (status == 1) return "green";
    if (status == 2) return "yellow";
    if (status == 3) return "yellow";
    if (status == 4) return "red";
    if (status == 5) return "red";
}

//创建接口名单
function createAPIs(res){

    return `<tr>
                <td>
                    <span class="nozzle-border-${getStatusColor(res.status)}">${getStatus(res.status)}</span>
                    ${res.name}
                </td>
                <td>
                    <span class="nozzle-border-blue">${res.method}</span>
                </td>
                <td>${res.url}</td>
                <td>${res.updater}</td>
                <td>${res.updateTime}</td>
            </tr>`;
}



//基本信息编辑操作
let messageBtn = document.getElementById('message-btn');
let portraitUp = document.getElementById('portrait-upload');
let mineNick = document.getElementById('mine-nickname');
let mineEmail = document.getElementById('mine-email');
let messageEdit = document.getElementById('message-edit');
let editCancel = document.getElementById('message-cancel');
let editSave = document.getElementById('message-save');
let portraitHead = document.getElementById('portrait-head');
var nickBefore;
var portraitBefore;
//点击编辑
messageEdit.onclick = function(){
    nickBefore = mineNick.innerHTML;
    portraitBefore = portraitHead.src;
    mineNick.contentEditable = "true";
    mineNick.focus();
    messageBtn.classList.remove('hide');
    portraitUp.classList.remove('hide');
}

//点击取消
editCancel.onclick = function(){
    mineNick.innerHTML = nickBefore;
    portraitHead.src = portraitBefore;
    mineNick.contentEditable = "false";
    messageBtn.classList.add('hide');
    portraitUp.classList.add('hide');
}

var portraitAfter = '';
//上传头像
let upFile = document.getElementById('upload-file');
//发送请求给后台
upFile.onchange = function(){
    let photo = upFile.files[0];
    if(upFile.value){
        var formData = new FormData();
        formData.append('file',photo);
        $.ajax({
            method:"POST",
            url: 'http://39.98.41.126:30004/api/user/saveUrl',
            headers: {
                "Buuid" : Buuid
            },
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            success: function(res){
                console.log(res.msg);
                portraitAfter = res.msg;
            }
        })
         // 实例化一个阅读器对象
         var reader = new FileReader();

         // 读取文件的路径，没有返回值,结果在reader.result里
         reader.readAsDataURL(photo);

         // 读取需要时间，读完后再修改图片路径
         reader.onload = function () {

             //回显给上方图片中
             portraitHead.src = this.result;
         }
    }

}

//点击保存
editSave.onclick = function(){
    let data = {
        nickname: nickBefore,
        url: portraitAfter || portraitBefore
    }
    //加载
    showLoading();
    postDo(server2 +'/updateMsg',data).then((res)=>{
        
        if(res.code == 1){
            alertIt('已保存');
            mineNick.contentEditable = "false";
            messageBtn.classList.add('hide');
            portraitUp.classList.add('hide');
            //基本信息展示
            showMessage();
        } else {
            //消失
            hideLoading();
            alertIt('保存失败');
        }
    })
}



//基本信息展示
// showMessage();
function showMessage(){
    postDo(server2 +'/getMyMsg',data).then((res)=>{
        // console.log(res.data);
        var message = createMessage(res.data);
        portraitHead.src = res.data.url;
        mineNick.innerHTML = res.data.nickname;
        mineEmail.innerHTML = res.data.email;
        document.getElementById('notice-message').innerHTML = message;
        //消失
        hideLoading();
    })
}


//基本信息
function createMessage(res){
    return `<h3 class="message-title">基本信息</h3>
            <div class="message-portrait">
                <img src="${res.url}" alt="">
            </div>
            <div class="message-name">
                <h4>昵称（建议使用真实姓名）</h4>
                <p>${res.nickname}</p>
            </div>
            <div class="message-email">
                <h4>注册邮箱</h4>
                <p>${res.email}</p>
            </div>`
}






//存项目id
// var projectId = [];

//存邮箱
var emails = [];


//项目列表以及成员查看
// lookProject();
function lookProject(){
    postDo(server1+'/list',data).then((res)=>{

        var itemListul = document.getElementById('item-list');
        var str = '';
        projectId = [];
        for(let i = 0; i < res.length; i++){
            //生成项目列表
            str += `<li>${res[i].name}</li>`;
            //将项目id存入数组
            projectId.push(res[i].id);
        }
        //插入“项目列表”
        itemListul.innerHTML = str;
    
        var itemList = document.getElementById('item-list').getElementsByTagName('li');
        for(let i = 0; i < itemList.length; i++){
            itemList[i].index = i;
            
            itemList[i].onclick = function(){
    
                //加载
                showLoading();
                selectId = this.index;
    
                for(let i = 0; i < itemList.length; i++){
                    itemList[i].classList.remove('item-choose');
                }
                itemList[this.index].classList.add('item-choose');
                let data = {
                    //对应项目的id
                    projectId: projectId[this.index]
                }
                // 成员管理
                memberManage(data);
    
            }
            
        }
        //消失
        hideLoading();
        
    });
}

//成员管理
function memberManage(data){

    postDo(server1+'/member',data).then((res)=>{
        //存邮箱
        emails = [];
        emails.push(res.creator.email);
        document.getElementById('member-creator').innerHTML = createCreator(res.creator);
        let memberJoiner = document.getElementById('member-joiner');  
        memberJoiner.innerHTML  = '';   
        for(let i = 0; i < res.others.length; i++){
            memberJoiner.innerHTML += createJoiner(res.others[i]); 
            emails.push(res.others[i].email);
        }
        // 添加“添加成员模块”
        if(res.creator.email == email){
            memberJoiner.innerHTML += `<li id="joiner-add" class="joiner-add">
                                        <p>+</p>
                                        <div class="">
                                            添加新成员
                                        </div>
                                    </li>`;
            //给添加成员绑定事件
            document.getElementById('joiner-add').addEventListener('click',function(){
                addContainer.classList.remove('hide');
            })
        }
        //绑定退出项目事件
        let joinerMore = document.getElementsByClassName('joiner-more');
        let exitCancel = document.getElementsByClassName('joiner-exit-cancel');
        let joinerExit = document.getElementsByClassName('joiner-exit');
        let exitProject = document.getElementsByClassName('joiner-exit-project');
        
        for(let i = 0; i < joinerMore.length; i++){
            joinerMore[i].index = i;
            //给“...”绑定事件
            joinerMore[i].addEventListener('click',function(){
                joinerExit[this.index].classList.remove('hide');
            })
        }
        for(let i = 0; i < exitCancel.length; i++){
            exitCancel[i].index = i;
            //给每个“x”绑定事件
            exitCancel[i].onclick =function(){
                joinerExit[this.index].classList.add('hide');
            }
        }
        
        //取消
        hideLoading();
        
        //点击退出项目
        for(let i = 0; i < exitProject.length; i++){
            exitProject[i].index = i;
            exitProject[i].onclick = function(){
                let data;
                let selectMan = this.index;
                joinerExit[this.index].classList.add('hide');
                //创建者是自己
                if(res.creator.email == email){
                    //解散项目
                    if(this.index == 0){
                        data = {
                            projectId: projectId[selectId]
                        }
                        postDo(server1+'/dissolutionProject',data).then((res)=>{
                            // console.log(res);
                            alertIt(res.msg);
                            document.getElementById('member-creator').innerHTML = '';
                            memberJoiner.innerHTML = '';
                            let itemList = document.getElementById('item-list').getElementsByTagName('li');
                            document.getElementById('item-list').removeChild(itemList[selectId]);
                        })
                    } else {
                        data = {
                            email: emails[this.index],
                            projectId: projectId[selectId]
                        }
                        postDo(server1 + '/deleteMember',data).then((res)=>{
                            let joiners = memberJoiner.getElementsByTagName('li');
                            // console.log(res);
                            alertIt(res.msg);
                            if(res.code == 1){
                                //移除
                                joiners[selectMan - 1].parentNode.removeChild(joiners[selectMan - 1]);
                            }
                            
                        })
                    }
                } else {
                    //自己退出
                    if(selectMan != 0 && res.others[selectMan-1].email == email){
                        data = {
                            email: email,
                            projectId: projectId[selectId]
                        }
                        postDo(server1 + '/deleteMember',data).then((res)=>{
                            // let joiners = memberJoiner.getElementsByTagName('li');
                            alertIt(res.msg);
                            if(res.code == 1){
                                //移除自身
                                // joiners[selectMan - 1].parentNode.removeChild(joiners[selectMan - 1]);
                                document.getElementById('member-creator').innerHTML = '';
                                memberJoiner.innerHTML = '';
                                let itemList = document.getElementById('item-list').getElementsByTagName('li');
                                document.getElementById('item-list').removeChild(itemList[selectId]);
                            }
                            
                        })
                    } else {
                        alertIt('无权限');
                    }
                }
            }
        }
    })
}

//项目列表生成
function creatProjectTable(res){
    return `<tr>
                <td>${res.name}</td>
                <td>V 1.0</td>
                <td>Web</td>
                <td>2020-08-18 13:07:18</td>
                <td>编辑</td>
                <td>新标签页打开</td>
                <td>更多></td>
            </tr>`
}

//生成创建者名单
function createCreator(res){
    if(res.email == email){
        res.nickname +=  '（我）';
    } 
    var str = `<li>
                    <img src="${res.url}" alt="">
                    <div class="creator-message">
                        <span>${res.nickname}</span>
                    <i>创建者</i>
                    <p class="creator-email">${res.email}</p>
                </div>
                <img id="creator-more" class="joiner-more" src="../images/more.png" alt="">
                <p id="creator-exit" class="joiner-exit hide">
                    <i class="joiner-exit-project">解散项目</i>
                    <span class="joiner-exit-cancel">x</span>
                </p>
            </li>`;
    return str;
}

//生成成员名单
function createJoiner(res){
    var nick = res.nickname
    if(res.email == email){
        nick += '（我）';
    } 
    var str = `<li>
                    <img src="${res.url}" alt="">
                    <div class="joiner-message">
                        <span>${nick}</span>
                        <i>成员</i>
                        <p class="joiner-email">${res.email}</p>
                    </div>
                    <img class="joiner-more" src="../images/more.png" alt="">
                    <p class="joiner-exit hide">
                        <i class="joiner-exit-project">离开项目</i>
                        <span class="joiner-exit-cancel">x</span>
                    </p>
                </li>`;
    return str;            
}


//所选项目的id对应的索引
var selectId;
//邀请成员
let addInvite = document.getElementById('add-invite');
let addMember = document.getElementById('add-member');

//填选框变化
addMember.onchange = function(){
    if(!this.value){
        return false;
    }
    // addInvite.style.opacity = 1;
}
//点击邀请
addInvite.onclick =function(){
    
    let addMember = document.getElementById('add-member');
    if(!addMember.value || !isEmailValid(addMember.value)){
        // alertIt('请输入邮箱');
        alertIt('请输入邮箱或邮箱格式不对');
        return false;
    }
    //加载
    showLoading();
    let data = {
        email:addMember.value,
        projectId: projectId[selectId]
    }
    postDo(server1 + '/inviteMember',data).then((res)=>{
        //消失
        hideLoading();
        alertIt(res.msg);
        addContainer.classList.add('hide');
        addMember.value = '';
    })
}

//添加成员面板
var addContainer = document.getElementById('joiner-add-container');
//点击取消
var addClose = document.getElementById('add-close');
addClose.onclick = function(){
    addContainer.classList.add('hide');
    addMember.value = '';
}


//邀请信息查看
// var inviteList = document.getElementById('invite-list');
// lookInvite();
function lookInvite(data){
    postDo(server1 + '/viewInvite',data).then((res)=>{

        let inviteList = document.getElementById('invite-list');
        inviteList.innerHTML = '';
        var selectLi = '';
        for(let i = 0; i < res.length; i++){
            inviteList.innerHTML += createInvite(res[i]);
        }
        let inviteListLi = inviteList.getElementsByTagName('li');
        let inProject = document.getElementsByClassName('invite-project');
        let inviteAccept = document.getElementsByClassName('invite-accept');
        let inviteRefuse = document.getElementsByClassName('invite-refuse');
        let data = {
            status: '',
            email: email,
            projectName: ''
        }
        for(let i = 0; i < inProject.length; i++){
            inProject[i].index = i;
            inviteAccept[i].index = i;
            inviteRefuse[i].index = i;
            //同意
            inviteAccept[i].onclick = function(){
                //加载
                showLoading();
                selectLi = this.index;
                data.status = 'y';
                data.projectName = inProject[this.index].innerHTML;
      
                postDo(server1+'/handleInvite',data).then((res)=>{
                    //消失
                    hideLoading();
                    alertIt(res.msg);
                    if(res.code == 1){
                        inviteList.removeChild(inviteListLi[selectLi]);
                    }
                })
            }
            //拒绝
            inviteRefuse[i].onclick = function(){
                //加载
                showLoading();
                selectLi = this.index;
                data.status = 'n';
                data.projectName = inProject[this.index].innerHTML;
            
                postDo(server1+'/handleInvite',data).then((res)=>{
                    //消失
                    hideLoading();
                    alertIt(res.msg);
                    if(res.code == -1){
                        inviteList.removeChild(inviteListLi[selectLi]);
                    }
                    
                })
            }
        }
        //消失
        hideLoading();
    })
    
}


// 校验邮箱
function isEmailValid(email) {
    let re = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return re.test(email);
}



//生成邀请信息
function createInvite(res){
    return `<li>
                <img src="${res.url}" alt="">
                <div class="invite-message">
                    <span>${res.nickName}</span>
                    <span>${res.time}</span>
                    <p>
                        邀请你加入
                        <strong class="invite-project">${res.projectName}</strong>
                    </p>
                </div>
                <div class="invite-confirm">
                    <button class="invite-accept">同意</button>
                    <button class="invite-refuse">拒绝</button>
                </div>
            </li>`
}



// 当前页面
var nowPage = 1;

// 分页显示
function diviPage(stuArr){
    // 页数
    let totalPage = Math.ceil(stuArr.length/6);
    // 往ul中添加页码
    let ul = document.getElementById('nozzle-page-ul');
    nowPage = 1;
    let pages = '';
    for(let i=1;i<=totalPage;i++){
        pages += `<li class="nozzle-page-tab" >${i}</li>`;
    }
    ul.innerHTML = pages;
    appearPage(nowPage);
}

// 根据页码显示
function appearPage(page){
    page = parseInt(page);
    let tbody = document.getElementById("nozzle-list");
    let pages = document.getElementById("nozzle-page-ul");
    let myTr = tbody.getElementsByTagName("tr");
    for(let i = 0; i < myTr.length; i++){
        myTr[i].classList.add('hide');
        if(i >= (page - 1)* 6 && i < page*6){
            myTr[i].classList.remove('hide');
        }
    }
    /* 修改当前页面的页码颜色 */
    let pageLi = pages.getElementsByTagName("li");
    if (pageLi[nowPage - 1]) {
        pageLi[nowPage - 1].classList.remove("page-choose");
    }
    pageLi[page - 1].classList.add("page-choose");
    /* 修改当前页面 */
    nowPage = page;
}

function addPageChange() {

    let pages = document.getElementById("nozzle-page-ul");
    let pageLi = pages.getElementsByTagName("li");
    for (let i = 0; i < pageLi.length; i++) {
        pageLi[i].index = i;
        pageLi[i].onclick = function () {
            appearPage(pageLi[this.index].innerHTML);
        }
    }
    /* 上一页 */
    document.querySelector(".nozzle-footer-pre").onclick = function () {
        if (nowPage != 1) {
            appearPage(nowPage - 1);
        }
    }
    /* 下一页 */
    document.querySelector(".nozzle-footer-nxt").onclick = function () {
        if (nowPage != pageLi.length) {
            appearPage(nowPage + 1);
        }
    }
}


// 页面跳转
function toPage() {
           
    let thepage = document.getElementById('nozzle-topage');     
    setTimeout(function () {         
        let pages = document.getElementById('nozzle-page-ul').getElementsByTagName('li');        
        let maxpage = pages.length;        
        thepage.onkeypress = function (event) {           
            if (event.keyCode == 13) {               
                let num = parseInt(thepage.value)             
                if (num > 0 && num <= maxpage) {                 
                    appearPage(num);             
                } else {
                    appearPage(pages.length);             
                }       
            }   
        }
    }, 1000)
}

/*
function insertAfter( newElement, targetElement ){ // newElement是要追加的元素 targetElement 是指定元素的位置
    var parent = targetElement.parentNode; // 找到指定元素的父节点
    if( parent.lastChild == targetElement ){ // 判断指定元素的是否是节点中的最后一个位置 如果是的话就直接使用appendChild方法
    parent.appendChild( newElement, targetElement );
    }else{
    parent.insertBefore( newElement, targetElement.nextSibling );
    };
};*/

//清空内容
function clearContent(){
    
    document.getElementById('nozzle-list').innerHTML ='';
    document.getElementById('nozzle-page-ul').innerHTML = '';
    document.getElementById('item-list').innerHTML = '';
    document.getElementById('member-joiner').innerHTML = '';
    document.getElementById('member-creator').innerHTML = '';
    document.getElementById('invite-list').innerHTML = '';
}