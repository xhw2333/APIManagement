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
                getData("http://39.98.41.126:30003/api/interface/delete", oData).then((res) => {
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
