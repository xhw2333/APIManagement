// 标签切换
function switchPage(tag,page,alltag,allpage){
    $(tag).click(function(){
        $(alltag).removeClass('detail-req-res-nav-choose');
        $(tag).addClass('detail-req-res-nav-choose');
        $(allpage).addClass('hide');
        $(page).removeClass('hide');
    })
}

// 请求参数
switchPage('#detail-attr-tag-body','#detail-req-body','.detail-attr-tag','.detail-req-div')
switchPage('#detail-attr-tag-head','#detail-req-head','.detail-attr-tag','.detail-req-div')

// 相应内容
switchPage('#detail-return-tag-result','#detail-return-result','.detail-return-tag','.detail-return-div')
switchPage('#detail-return-tag-head','#detail-return-head','.detail-return-tag','.detail-return-div')

