
//切换个人页面
var personTab = document.getElementsByClassName('side-tabs');
var personPage = document.getElementsByClassName('operation-part');
for(let i = 0; i < personTab.length; i++){
    personTab[i].index = i;
    personTab[i].onclick = function(){
        hidePerPage();
        personPage[this.index].classList.remove('hide');
        personTab[this.index].classList.add('side-now');

    }
}

function hidePerPage(){
    for(let i = 0; i < personPage.length; i++){
        personPage[i].classList.add('hide');
        personTab[i].classList.remove('side-now');
    }
}