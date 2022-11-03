let guestBook = {
    num : null
    ,postBox : null
    ,updateStatus : false

    ,init : function(){
        this.settingList();

        this.postBox = $('#postBox');

    }
    ,registEvent : function(){
    }

    ,settingList : function(){
        $.ajax({
                type: 'GET',
                url: '/guestBook/list',
                data: {},
                success: function (response) {
                    let rows = JSON.parse(response['supports']);
                    for (let i = 0; i < rows.length; i++) {
                        let name = rows[i]['name']
                        let support = rows[i]['support']
                        let oid = rows[i]['_id']['$oid']

                        let temp_html = `<div class="card" id="listCard${oid}">
                                        <div class="card-body">
                                            <blockquote class="blockquote mb-0">
                                                <p>${support}</p>
                                                <footer class="blockquote-footer">${name}</footer>
                                            </blockquote>
                                             <button onclick="guestBook.openUpdateForm('${oid}')" type="button" class="btn btn-outline-dark">수정</button>
                                             <button onclick="guestBook.deleteGuestBook('${oid}')" type="button" class="btn btn-outline-dark">삭제</button>
                                        </div>
                                    </div>`;
                        $('#cards-box').append(temp_html);
                    }
                }
        });
    }

    ,insertGuestBook : function(){
            let _this = this;

            if(confirm('등록하시겠습니까?')){
                let name = $(this).find('input[name="guestBookName"]').val();
                let contents = $(this).find('textarea[name="guestBookContents"]').val();

                if (name == '' || typeof(name) == "undefined"){
                    alert('닉네임을 입력해주세요');
                    return false;
                }

                if (contents == '' || typeof(contents) == "undefined"){
                    alert('내용을 작성해주세요');
                    return false;
                }

            $.ajax({
                   type: 'POST',
                   url: '/guestBook/insert',
                   data: {
                    guestName: name,
                    guestContents: contents
                    },
                    success: function (response) {
                         alert(response['msg'])
                        _this.settingList()
                    }
            });
        }

    }

    ,updateGuestBook : function(){
        let _this = this;

        if( !this.updateStatus ){
            if(confirm('변경하시겠습니까?')){
                this.updateStatus = true;

                let name = $(this).find('input[name="guestBookName"]').val();
                let contents = $(this).find('textarea[name="guestBookContents"]').val();

                if (name == '' || typeof(name) == "undefined"){
                    alert('닉네임을 입력해주세요');
                    return false;
                }

                if (contents == '' || typeof(contents) == "undefined"){
                    alert('내용을 작성해주세요');
                    return false;
                }

                $.ajax({
                       type: 'POST',
                       url: '/guestBook/update',
                     data: {

                        id : _this.num,
                        guestName: name,
                        guestContents: contents
                     },
                     success: function (response) {
                             alert(response['msg']);
                             _this.closeUpdateForm();
                             _this.settingList();
                     }
                });
            }
        }

    }

    ,deleteGuestBook : function(num){
        let _this = this;
        if(confirm('삭제하시겠습니까?')){
            $.ajax({
                type: 'POST',
                url: '/guestBook/delete',
                data: {
                    id: num,
                },
                success: function (response) {
                    alert(response['msg'])
                    _this.settingList();
                }
            });
        }
    }

    //변경 창 세팅
    ,openUpdateForm : function(num){
        this.num = num;
        let target = $('#listCard' + num);
        let targetName = $(target).find('footer').text();
        let targetContents = $(target).find('p').text();
        
        $(this.postBox).find('> p').text('수정 창');
        $(this.postBox).find('input[name="guestBookName"]').val(targetName);
        $(this.postBox).find('textarea[name="guestBookContents"]').val(targetContents);
        $(this.postBox).find('button').attr('onclick', 'guestBook.updateGuestBook()');
        $(this.postBox).find('button').text('방명록 수정');
    }

    //변경 창 닫기
    ,closeUpdateForm : function(){
        this.num = null
        $(this.postBox).find('> p').text('등록 창');
        $(this.postBox).find('input[name="guestBookName"]').val('');
        $(this.postBox).find('textarea[name="guestBookContents"]').val('');
        $(this.postBox).find('button').attr('onclick', 'guestBook.insertGuestBook()');
        $(this.postBox).find('button').text('방명록 남기기');
    }

    ,removeEvent : function(){

    }
    ,destroy: function(){

    }
}


$(document).ready(function () {
    guestBook.init();
});