// 文件下载不了(好像是数据库网速问题),求助威哥
// 项目导入，求助威哥



/* 左边导航栏的内容 */

// 从cookie获取
var email = "3014899575@qq.com";
var Buuid = "5668cbba-630f-4968-894e-bcd2a0a4ddc3";



var tBody = document.getElementById("api-tbody");
var apiManegementPID = 0;
var apiManegementMID = 0;


/* 获取项目 */
var apiUl = document.getElementById("api-module");
var oData = {
    "email": email
}
getData("http://39.98.41.126:30008/api/member/list", oData).then((res) => {
    let str = "";
    for (let i = 0; i < res.length; i++) {
        str += `
                <li>
                    <div class="api-main-li api-li project" projectId="${res[i].id}">
                        <img src="../images/list.png" class="list">
                        <img src="../images/pack.png">
                        <span>${res[i].name}</span>
                        <img src="../images/more.png" class="api-more proj-con">
                    </div>
                </li>
        `;
    }
    apiUl.innerHTML = str;

    addProjControl();
    addModule();
});

/* 创建新项目 */
document.getElementById("new-groud").onclick = function () {
    let sec = document.getElementById("add-new-module");
    sec.classList.remove("hide");

    sec.getElementsByTagName("button")[0].onclick = function () {
        if (sec.getElementsByTagName("input")[0].value) {
            let oData = {
                "name": sec.getElementsByTagName("input")[0].value,
                "email": email
            }
            getData("http://39.98.41.126:30008/api/pro/createProject", oData).then((res) => {
                if (res.code == 1)
                    location.reload();
                else
                    alertIt(res.msg);
            });
        } else {
            alertIt("项目名不能为空");
        }
    }

}

/* 导入 */
document.getElementById("add-new-file").onclick = function () {
    document.getElementById("input-file").classList.remove("hide");
}












// 点击模块获取接口
function addClickModule(dom) {
    let mode = dom.getElementsByTagName("div");
    for (let i = 0; i < mode.length; i++) {
        mode[i].onclick = function (event) {
            event.stopPropagation();

            apiManegementPID = mode[i].getAttribute("projectid");
            apiManegementMID = mode[i].getAttribute("myID");
            let oData = {
                "moduleId": mode[i].getAttribute("myID")
            }
            getData("http://39.98.41.126:30004/api/apis/findAPI", oData).then((res) => {

                /* 添加apis */
                if (tBody) {
                    let apis = res.data;
                    if (apis) {
                        let apiStr = "";
                        for (let j = 0; j < apis.length; j++) {
                            apiStr += `
                        <tr apiID=${apis[j].id}>
                            <td class="w50"><input type="checkbox"></td>
                            <td>
                                <div class="my-border my-border-${getStatusColor(apis[j].status)}">${getStatus(apis[j].status)}</div>
                                ${apis[j].url}
                            </td>
                            <td>
                                <div class="my-border my-border-blue">${apis[j].method}</div>
                            </td>
                            <td>${apis[j].url}</td>
                            <td>${apis[j].updater}</td>
                            <td>${apis[j].updateTime}</td>
                            <td>
                                <span>编辑</span> | <span>新标签页打开</span> | <span>删除</span>
                            </td>
                        </tr>
                            `
                        }

                        tBody.innerHTML = apiStr;

                        document.getElementById("table-bottom").innerHTML = `已加载${apis.length}条信息，共${apis.length}条记录`;

                        manegement();
                    }
                }
            });
        }
    }

}

/* 点击项目获取接口和子模块 */
function addModule() {
    let div = apiUl.getElementsByClassName("project");

    /* 遍历项目 */
    for (let i = 0; i < div.length; i++) {
        div[i].onclick = function (event) {
            event.stopPropagation();

            this.getElementsByTagName('img')[0].classList.add("rount");
            this.classList.add("api-shadow");

            apiManegementPID = this.getAttribute("projectId");
            apiManegementMID = 0;
            let id = {
                "projectId": apiManegementPID
            };

            let that = this.parentElement;

            getData("http://39.98.41.126:30004/api/apis/getModulesAndApis", id).then((res) => {
                let data = res.data;

                /* 左边栏目 */
                let modules = data.modules;
                if (modules && !that.getElementsByTagName('ul').length) {

                    /* 循环一个个插入 */
                    let unAdd = new Array();
                    for (let i = 0; i < modules.length; i++) {
                        /* 找到父节点 */
                        let pID;

                        if (modules[i].parentId == 0) {
                            pID = that;
                        } else {
                            pID = that.querySelector(`li[myID="${modules[i].parentId}"]`);
                        }

                        if (pID) {
                            let str = `
                        <li myID="${modules[i].id}" projectId="${modules[i].projectId}">
                            <div class="api-li api-child-main" parentId="${modules[i].parentId}" myID="${modules[i].id}" projectId="${modules[i].projectId}">
                                <img src="../images/list.png" class="rount list">
                                <img src="../images/pack.png">
                                <span>${modules[i].name}</span>
                                <img src="../images/more.png" class="api-more api-more-modu">
                            </div>
                        </li>
                        `;

                            if (pID.getElementsByTagName('ul').length) {
                                /* 如果已经有子模块 */
                                pID = pID.getElementsByTagName('ul')[0];
                                pID.innerHTML += str;
                            } else {
                                pID.innerHTML = pID.innerHTML + `
                            <ul class="api-child-module">` + str + `
                            </ul>`;
                            }
                        } else {
                            unAdd.push(i);
                        }

                    }

                    /* 只进行一次排序 */
                    if (unAdd.length) {
                        while (unAdd.length) {
                            let i = unAdd.pop();
                            /* 找到父节点 */
                            let pID;

                            if (modules[i].parentId == 0) {
                                pID = that;
                            } else {
                                pID = that.querySelector(`li[myID="${modules[i].parentId}"]`);
                            }

                            if (pID) {
                                let str = `
                            <li myID="${modules[i].id}" projectId="${modules[i].projectId}">
                                <div class="api-li api-child-main" parentId="${modules[i].parentId}" myID="${modules[i].id}" projectId="${modules[i].projectId}">
                                    <img src="../images/list.png" class="rount list">
                                    <img src="../images/pack.png">
                                    <span>${modules[i].name}</span>
                                    <img src="../images/more.png" class="api-more api-more-modu">
                                </div>
                            </li>
                            `;

                                if (pID.getElementsByTagName('ul').length) {
                                    /* 如果已经有子模块 */
                                    pID = pID.getElementsByTagName('ul')[0];
                                    pID.innerHTML += str;
                                } else {
                                    pID.innerHTML = pID.innerHTML + `
                                <ul class="api-child-module">` + str + `
                                </ul>`;
                                }

                            } else {
                                unAdd.push(i);
                            }

                        }
                    }

                }

                /* 添加apis */
                if (tBody) {
                    let apis = data.apis;
                    if (apis) {
                        let apiStr = "";
                        for (let j = 0; j < apis.length; j++) {
                            apiStr += `
                        <tr apiID=${apis[j].id}>
                            <td class="w50"><input type="checkbox"></td>
                            <td>
                                <div class="my-border my-border-${getStatusColor(apis[j].status)}">${getStatus(apis[j].status)}</div>
                                ${apis[j].url}
                            </td>
                            <td>
                                <div class="my-border my-border-blue">${apis[j].method}</div>
                            </td>
                            <td>${apis[j].url}</td>
                            <td>${apis[j].updater}</td>
                            <td>${apis[j].updateTime}</td>
                            <td>
                                <span>编辑</span> | <span>新标签页打开</span> | <span>删除</span>
                            </td>
                        </tr>
                            `
                        }

                        tBody.innerHTML = apiStr;

                        document.getElementById("table-bottom").innerHTML = `已加载${apis.length}条信息，共${apis.length}条记录`;

                        manegement();
                    }
                }

                addClickModule(that);
                addHideList();
                addModule();
                addProjControl();
                addModuleControl();
            });
        }
    }
}

// 项目的操作
let modList = document.getElementById("modu-list");
let modListDiv = modList.getElementsByTagName("div");
function addProjControl() {
    let btn = document.getElementsByClassName("proj-con");

    for (let i = 0; i < btn.length; i++) {
        btn[i].onclick = function (event) {
            event.stopPropagation();

            modListDiv[2].classList.remove('hide');
            modListDiv[4].classList.add('hide');
            modListDiv[5].classList.add('hide');
            modList.classList.toggle("hide");

            let topY = event.clientY + 15;
            modList.getElementsByTagName("div")[0].style.top = topY + 'px';

            // 操作
            // 新建子模块
            let projectId = this.parentElement.getAttribute("projectid");
            let parentId = 0;
            addSonModule(projectId, parentId);
            // 导出api文档
            exportApiMd(projectId);
            // 修改名字
            changeProjName(projectId);
        }

    }
    document.body.onclick = function () {
        modList.classList.add("hide");
    }
}

// 模块的操作
function addModuleControl() {
    let btn = document.getElementsByClassName("api-more-modu");

    for (let i = 0; i < btn.length; i++) {
        btn[i].onclick = function (event) {
            event.stopPropagation();

            modListDiv[2].classList.add('hide');
            modListDiv[4].classList.remove('hide');
            modListDiv[5].classList.remove('hide');
            modList.classList.toggle("hide");

            let topY = event.clientY + 10;
            modList.getElementsByTagName("div")[0].style.top = topY + 'px';

            // 操作
            // 新建子模块
            let projectId = this.parentElement.getAttribute("projectId");
            let parentId = this.parentElement.getAttribute("myID");
            let name = this.parentElement.getElementsByTagName("span")[0].innerHTML;
            addSonModule(projectId, parentId);
            // 修改名字
            changeModuName(parentId);
            // 移动
            moveModu(name, parentId);
            // 删除
            deleModu(parentId)
        }

    }
    document.body.onclick = function () {
        modList.classList.add("hide");
    }
}

// modListDiv控制section
function modListDivSection() {
    modListDiv[1].onclick = (event) => {
        event.stopPropagation();
        modList.classList.add("hide");
        document.getElementById("add-new-true-module").classList.remove("hide");
    }
    modListDiv[2].onclick = (event) => {
        event.stopPropagation();
        modList.classList.add("hide");
        document.getElementById("sec-export").classList.remove("hide");
    }
    modListDiv[3].onclick = (event) => {
        event.stopPropagation();
        modList.classList.add("hide");
        document.getElementById("change-name").classList.remove("hide");
    }
    modListDiv[4].onclick = (event) => {
        event.stopPropagation();
        modList.classList.add("hide");
        document.getElementById("move-api").classList.remove("hide");
    }
    modListDiv[5].onclick = (event) => {
        event.stopPropagation();
        modList.classList.add("hide");
        document.getElementById("sec-module-de").classList.remove("hide");
    }
}
modListDivSection();

// 新建子模块
function addSonModule(projectId, parentId) {
    let dom = document.getElementById("add-new-true-module");
    dom.getElementsByTagName("button")[0].onclick = () => {
        let name = dom.getElementsByTagName("input")[0].value;
        let oData = {
            "name": name,
            "parentId": parentId,
            "projectId": projectId
        };
        if (name)
            getData("http://39.98.41.126:30004/api/module/createModule", oData).then((res) => {
                if (res.code == 1)
                    location.reload();
                else
                    alertIt(res.msg);
            });
        else
            alertIt("模块名不能为空")
    }
}

// 导出api文档
function exportApiMd(projectId) {
    let dom = document.getElementById('sec-export');
    dom.getElementsByTagName("button")[0].onclick = () => {
        let oData = {
            "projectId": projectId
        };

        alertIt("开始建立连接……");
        dom.classList.add("hide");
        getData("http://39.98.41.126:30008/api/pro/export", oData).then((res) => {
            //location.reload();
            //console.log(res);
            window.open(res);
        });
    }
}

// 修改项目名称
function changeProjName(projectId) {
    let dom = document.getElementById("change-name");
    dom.getElementsByTagName("button")[0].onclick = () => {
        let name = dom.getElementsByTagName("input")[0].value;
        let oData = {
            "projectId": projectId,
            "email": email,
            "newName": name
        };
        if (name)
            getData("http://39.98.41.126:30008/api/pro/updateProject", oData).then((res) => {
                if (res.code == 1)
                    location.reload();
                else
                    alertIt(res.msg);
            });
        else
            alertIt("模块名不能为空")
    }
}

// 修改模块名称
function changeModuName(parentId) {
    let dom = document.getElementById("change-name");
    dom.getElementsByTagName("button")[0].onclick = () => {
        let name = dom.getElementsByTagName("input")[0].value;
        let oData = {
            "name": name,
            "id": parentId
        };
        if (name)
            getData("http://39.98.41.126:30004/api/module/updateName", oData).then((res) => {
                if (res.code == 1)
                    location.reload();
                else
                    alertIt(res.msg);
            });
        else
            alertIt("模块名不能为空")
    }
}

// 移动
function moveModu(name, myId) {
    let parentId = 0;
    let dom = document.getElementById("move-api");
    // 回写名字
    dom.getElementsByTagName("input")[0].value = name;
    // 回写项目
    let proj = document.getElementById("move-proj");
    let project = document.getElementsByClassName("project");
    let str = `<option disabled selected value="0">请选择模块</option>`;
    for (let i = 0; i < project.length; i++) {
        let pNmae = project[i].getElementsByTagName("span")[0].innerHTML;
        str += `
            <option value="${project[i].getAttribute("projectid")}">${pNmae}</option>
            `
    }
    proj.innerHTML = str;

    // 选择项目后
    proj.onchange = function () {
        parentId = 0;
        //console.log(parentId);
        if (getNextElement(document.getElementById("move-proj")))
            getNextElement(document.getElementById("move-proj")).remove();
        let projID = proj.value;
        let dom;
        for (let i = 0; i < project.length; i++) {
            if (projID == project[i].getAttribute("projectid")) dom = project[i];
        }

        let myUl = getNextElement(dom);
        let str = "";
        if (myUl) {
            let pdiv = myUl.querySelectorAll(`div[parentid="0"]`)
            str = addScelect(pdiv, 1);
        }

        if (str) {
            let div = document.createElement('div');
            proj.parentElement.appendChild(div);
            getNextElement(proj).innerHTML = str;

            let newSelect = getNextElement(proj).children[0];

            // 选择模块
            newSelect.onchange = function () {
                parentId = newSelect.value;
                //console.log(parentId);

                if (getNextElement(newSelect))
                    getNextElement(newSelect).remove();
                let ppdiv = document.querySelector(`div[myid="${newSelect.value}"]`);

                if (getNextElement(ppdiv)) {
                    let ddiv = getNextElement(ppdiv).getElementsByTagName("div");


                    let div = document.createElement('div');
                    newSelect.parentElement.appendChild(div);
                    getNextElement(newSelect).innerHTML = addScelect(ddiv, 0);

                    // 选择所有子模块
                    let se = getNextElement(newSelect).children[0];
                    se.onchange = function () {
                        parentId = se.value;

                    }
                }

            }
        }
    }


    dom.getElementsByTagName("button")[0].onclick = () => {

        let oData = {
            "parentId": parentId,
            "id": myId
        };
        if (parentId)
            getData("http://39.98.41.126:30004/api/module/remove", oData).then((res) => {
                if (res.code == 1)
                    location.reload();
                else
                    alertIt(res.msg);
            });
        else
            alertIt("不可以跨项目移动");

    }
}

// 删除模块
function deleModu(parentId) {
    let dom = document.getElementById("sec-module-de");
    dom.getElementsByTagName("button")[0].onclick = () => {
        let oData = {
            "id": parentId
        };
        getData("http://39.98.41.126:30004/api/module/delete", oData).then((res) => {
            if (res.code == 1)
                location.reload();
            else
                alertIt(res.msg);
        });
    }
}

// 根据父节点id封装select
function addScelect(div, flag) {
    let str = "";

    for (let i = 0; i < div.length; i++) {
        let pNmae = div[i].getElementsByTagName("span")[0].innerHTML;
        str += `
            <option value="${div[i].getAttribute("myid")}">${pNmae}</option>
            `
    }

    if (div != null)
        if (flag) {
            str = `<select>
                    <option disabled selected value="0">请选择模块</option>`
                + str + `
                </select>`;
        } else {
            str = `<select>
                    <option disabled selected value="0">请选择子模块</option>`
                + str + `
                </select>`;
        }


    return str;
}






// 展开收起
function addHideList() {
    let list = document.querySelectorAll(".list");
    for (let i = 0; i < list.length; i++) {
        list[i].onclick = function (event) {
            event.stopPropagation();
            this.classList.toggle("rount");
            let ul = this.parentElement.parentElement.getElementsByTagName('ul')
            if (ul.length) {
                ul[0].classList.toggle("hide");
            }
        }
    }

}

// ajax
function getData(url, data) {
    return new Promise((resolve) => {
        $.ajax({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json",
                "Buuid": Buuid
            },
            data: JSON.stringify(data),
            success: function (res) {
                resolve(res)
            },
            error: function () {
                alertIt("服务器连接失败！请联系管理员！")
            }
        })
    })
}

// 提示框
alertTimer = null;
function alertIt(content) {
    $('#alert-div').html(content);
    $('#alert-div').slideDown(500);
    if (alertTimer) {
        alertTimer = null;
    } else {
        alertTimer = setTimeout(() => {
            $('#alert-div').slideUp(500);
            alertTimer = null;
        }, 3000);
    }
}

// 状态码
function getStatus(num) {
    if (num == 1) return "已发布";
    if (num == 2) return "设计中";
    if (num == 3) return "测试";
    if (num == 4) return "维护";
    if (num == 5) return "废弃";
}
function getStatusColor(num) {
    if (num == 1) return "green";
    if (num == 2) return "yellow";
    if (num == 3) return "yellow";
    if (num == 4) return "red";
    if (num == 5) return "red";
}

// 隐藏section
function hideSection() {
    let quxiao = document.getElementsByClassName("quxiao");
    let section = document.getElementsByTagName("section");
    for (let i = 0; i < quxiao.length; i++) {
        quxiao[i].onclick = () => section[i].classList.add("hide");
    }
}
hideSection()

//获取下一个兄弟元素的兼容函数
function getNextElement(element) {
    if (element.nextElementSibling) {
        return element.nextElementSibling;
    } else {
        var next = element.nextSibling;//下一个兄弟节点
        while (next && 1 !== next.nodeType) {//有 并且 不是我想要的
            next = next.nextSibling;
        }
        return next;
    }
}