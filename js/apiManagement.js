/* 右边api列表内容 */

function manegement() {
    let allSpan = tBody.getElementsByTagName("span");
    let allTr = tBody.getElementsByTagName("tr");

    /* 操作 */
    for (let i = 0; i < allTr.length; i++) {
        // 编辑
        allSpan[i * 3 + 0].onclick = function () {
            location.assign(`../pages/apiDetail.html?apiID=${allTr[i].getAttribute("apiid")}`);
        }
        // 新标签页打开
        allSpan[i * 3 + 1].onclick = function () {
            window.open(`../pages/apiDetail.html?apiID=${allTr[i].getAttribute("apiid")}`);
        }
        // 删除
        allSpan[i * 3 + 2].onclick = function () {
            if (confirm("是否确认删除?")) {
                let oData = {
                    "id": allTr[i].getAttribute("apiid")
                }
                showLoading();
                getData(domain + "api/interface/delete", oData).then((res) => {
                    hideLoading();
                    if (res.code == 1)
                        location.reload();
                    else
                        alertIt(res.msg);
                });
            }
        }
    }


}

// 新建api接口
document.getElementById("add-new-api").onclick = function () {
    if (!apiManegementPID) {
        alertIt("请选择项目！");
    } else if (!apiManegementMID) {
        alertIt("请选择模块！");
    } else {
        window.open(`../pages/createApi.html?pID=${apiManegementPID}&&mID=${apiManegementMID}`);
    }
}

/* 回车搜索 */
document.getElementById("search-api").onkeypress = function (event) {
    if (event.keyCode == 13) {

        if (apiManegementPID) {
            apiManegementMID = 0;

            let oData = {
                "projectId": apiManegementPID,
                "param": this.value
            }

            showLoading();
            getData(domain + "api/apis/findAPI", oData).then((res) => {
                hideLoading();

                /* 添加apis */
                let apis = res.data;
                if (apis.length) {
                    let apiStr = "";
                    for (let j = 0; j < apis.length; j++) {
                        apiStr += `
                        <tr apiID=${apis[j].id}>
                            <td class="w50"><input type="checkbox"></td>
                            <td>
                                <div class="my-border my-border-${getStatusColor(apis[j].status)}">${getStatus(apis[j].status)}</div>
                                ${apis[j].name}
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
                } else {
                    alertIt("搜索内容为空");
                }

            });
        } else {
            alertIt("请选择项目！");
        }

    }
}

// 批量删除
document.getElementById("pl-delete").onclick = function () {
    if (getSelect()) {
        if (confirm("是否确定删除")) {
            let oData = {
                "ids": getSelect()
            }
            showLoading();
            getData(domain + "api/apis/delete", oData).then((res) => {
                hideLoading();
                if (res.code == 1)
                    location.reload();
                else
                    alertIt(res.msg);
            });
        }
    } else {
        alertIt("未选择接口")
    }
}

// 批量移动
document.getElementById("pi-move").onclick = function () {
    if (getSelect()) {
        if (apiManegementPID) {
            apiManegementMID = 0;

            plMoveModu(apiManegementPID)

        } else {
            alertIt("请选择项目！");
        }
    } else {
        alertIt("未选择接口")
    }
}

// 根据请求方式筛选
document.getElementById("search-for-method").onchange = function () {
    notSelectAll();
    let allLi = tBody.getElementsByTagName("tr");
    if (allLi.length) {

        if (this.value == "all") {
            allAppear();
        } else {
            let met = this.value;
            let allMethod = tBody.getElementsByTagName("div");
            for (let i = 0; i < allLi.length; i++) {
                if ((allMethod[i * 2 + 1].innerHTML).toLowerCase() == met.toLowerCase()) {
                    allLi[i].classList.remove("hide");
                } else {
                    allLi[i].classList.add("hide");
                }
            }
        }
    } else {
        alertIt("内容为空");
        this.value = "all";
    }
}




// 移动
function plMoveModu(pID) {
    let parentId = 0;
    let dom = document.getElementById("pl-move-api");
    dom.classList.remove("hide");

    // 回写项目
    let proj = document.getElementById("pl-move-proj");
    let project = document.getElementsByClassName("project");
    let str = `<option disabled selected value="0">请选择项目</option>`;
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
        dom.classList.add("hide");

        let oData = {
            "ids": getSelect(),
            "projectId": pID,
            "moduleId": parentId
        }

        if (parentId) {
            showLoading();
            getData(domain + "api/apis/remove", oData).then((res) => {
                hideLoading();
                if (res.code == 1)
                    location.reload();
                else
                    alertIt(res.msg);
            });
        }

        else
            alertIt("不可以跨项目移动");

    }

    dom.getElementsByTagName("button")[1].onclick = () => {
        dom.classList.add("hide");
    }
}

/* 获取所有的选中框对应的id，返回xxx-xxx字符串 */
function getSelect() {
    let all = tBody.getElementsByTagName("input");
    let allTr = tBody.getElementsByTagName("tr");
    let str = "";
    for (let i = 0; i < all.length; i++) {
        if (all[i].checked) {
            str += (allTr[i].getAttribute("apiID") + "-");
        }
    }
    return str.substring(0, str.length - 1);
}

// 全选按钮
document.getElementById("select-all-input").onclick = function () {
    if (tBody.getElementsByTagName("tr").length) {
        if (this.checked) selectAll();
        else notSelectAll();
    }
}

// 全选
function selectAll() {
    let all = tBody.getElementsByTagName("input");
    let allTr = tBody.getElementsByTagName("tr");
    for (let i = 0; i < all.length; i++) {
        if (!allTr[i].classList.contains("hide")) {
            all[i].checked = true;
        }
    }
}

// 全不选
function notSelectAll() {
    let all = document.querySelector(".table").getElementsByTagName("input");
    for (let i = 0; i < all.length; i++) {
        all[i].checked = false;
    }
}

// 全部显示
function allAppear() {
    let allTr = tBody.getElementsByTagName("tr");
    for (let i = 0; i < allTr.length; i++) {
        allTr[i].classList.remove("hide");
    }
}

