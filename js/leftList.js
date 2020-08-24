/* 左边导航栏的内容 */

// 从cookie获取
var email = getCookie('email');
var Buuid = getCookie('Buuid');



var tBody = document.getElementById("api-tbody");

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
    /* 创建新项目 */
    document.getElementById("new-group").onclick = function () {
        let sec = document.getElementById("add-new-module");
        sec.classList.remove("hide");

        sec.getElementsByTagName("button")[0].onclick = function () {
            if (sec.getElementsByTagName("input")[0].value) {
                let oData = {
                    "name": sec.getElementsByTagName("input")[0].value,
                    "email": email
                }
                getData("http://39.98.41.126:30008/api/pro/createProject", oData).then((res) => {
                    location.reload();
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

    addProjControl();
    addModule();
});

