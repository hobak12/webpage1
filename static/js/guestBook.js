    let guestBook = {
    num: null,
    postBox: null,
    updateStatus: false,

    init: function () {
        this.settingList();

        this.postBox = $("#postBox");

        this.registEvent();
    },
    registEvent: function () {
        let _this = this;
        $('#fil').on('keyup', function(){
            _this.listFilter();
        });
    },

    settingList: function () {
        $.ajax({
        type: "GET",
        url: "/guestBook/list",
        data: {},
        success: function (response) {
            let rows = JSON.parse(response["supports"]);
            $("#cards-box").empty();
            for (let i = 0; i < rows.length; i++) {
            let oid = rows[i]["_id"]["$oid"];
            let name = rows[i]["name"];
            let conents = rows[i]["contents"];

            let temp_html = `<div class="card" id="listCard${oid}">
                                                        <div class="card-body">
                                                            <blockquote class="blockquote mb-0">
                                                                <p class="nick_name">${conents}</p>
                                                                <footer class="blockquote-footer">${name}</footer>
                                                            </blockquote>
                                                            <button onclick="guestBook.openUpdateForm('${oid}')" type="button" class="btn btn-outline-dark">수정</button>
                                                            <button onclick="guestBook.deleteGuestBook('${oid}')" type="button" class="btn btn-outline-dark">삭제</button>
                                                        </div>
                                                    </div>`;
            $("#cards-box").append(temp_html);
            }
        },
        });
    }

    ,listFilter : function(){
        let value, contents, nick, item, i;

            value = document.getElementById("fil").value;
            // "fil"아이디에 포함된 모든 문자열의 입력값을 value에 넣어준다. 쉽게 보면 글검색창에 단어를 입력시 value에 넣어준다
            // 라고 생각하면됨

            item = document.getElementsByClassName("card");
            // "block"클래스, 즉 이미 있는 글내용과 닉네임이 있는 클래스에 포함된 모든 문자열을 item에 넣어준다.

            for (i = 0; i < item.length; i++) {
                // item에는 item[0], item[1], item[2] 현재 이렇게 담겨져있다.

                contents = item[i].getElementsByClassName("nick_name");
                // 각 아이템 배열에서 클래스 contents, 즉 글내용 부분을 담는다
                console.log(contents)
                nick = item[i].getElementsByClassName("blockquote-footer");
                // 각 아이템 배열에서 클래스 nick, 즉 닉네임 부분을 담는다
                if (contents[0].innerHTML.indexOf(value) > -1 ||
                    nick[0].innerHTML.indexOf(value) > -1) {
                    // innerHTML은 HTML의 컨텐츠, 즉 내용에 접근할 수 있는 변수이고
                    // indexOf()는 괄호안 값 문자열의 위치가 0,1,2,3,4... 인지 반환, 만약 없으면 -1을 반환한다.

                    //만약 첫번째 글내용에 HTML의 컨텐츠값인 value(이건 검색창에서 입력한 문자열)가 존재하거나
                    //|| 혹은 첫번째 닉네임에 HTML의 컨텐츠값인 value(이건 검색창에서 입력한 문자열)이 존재할경우

                    item[i].style.display = "block";
                    // 지금 전체 글내용중에서 해당 번째의 글내용을 보여준다
                } else {
                    item[i].style.display = "none";
                    // 지금 전체 글내용중에서 해당 번째의 글내용을 보여주지 않는다.
                }
            }
    }

    ,insertGuestBook: function () {
        let _this = this;

        if (confirm("등록하시겠습니까?")) {
        let name = $(this.postBox).find('input[name="guestBookName"]').val();
        let contents = $(this.postBox)
            .find('textarea[name="guestBookContents"]')
            .val();

        if (name == "" || typeof name == "undefined") {
            alert("닉네임을 입력해주세요");
            return false;
        }

        if (contents == "" || typeof contents == "undefined") {
            alert("내용을 작성해주세요");
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/guestBook/insert",
            data: {
            guestName: name,
            guestContents: contents,
            },
            success: function (response) {
            alert(response["msg"]);
            _this.settingList();
            },
        });
        }
    },

    updateGuestBook: function () {
        let _this = this;

        if (!this.updateStatus) {
        if (confirm("변경하시겠습니까?")) {
            this.updateStatus = true;

            let name = $(this.postBox).find('input[name="guestBookName"]').val();
            let contents = $(this.postBox)
            .find('textarea[name="guestBookContents"]')
            .val();

            if (name == "" || typeof name == "undefined") {
            alert("닉네임을 입력해주세요");
            return false;
            }

            if (contents == "" || typeof contents == "undefined") {
            alert("내용을 작성해주세요");
            return false;
            }

            $.ajax({
            type: "POST",
            url: "/guestBook/update",
            data: {
                id: _this.num,
                guestName: name,
                guestContents: contents,
            },
            success: function (response) {
                alert(response["msg"]);
                _this.closeUpdateForm();
                _this.settingList();
            },
            });
        }
        }
    },

    deleteGuestBook: function (num) {
        let _this = this;
        if (confirm("삭제하시겠습니까?")) {
        $.ajax({
            type: "POST",
            url: "/guestBook/delete",
            data: {
            id: num,
            },
            success: function (response) {
            alert(response["msg"]);
            _this.settingList();
            },
        });
        }
    },

    //변경 창 세팅
    openUpdateForm: function (num) {
        this.num = num;
        let target = $("#listCard" + num);
        let targetName = $(target).find("footer").text();
        let targetContents = $(target).find("p").text();

        $(this.postBox).find("> p").text("수정 창");
        $(this.postBox).find('input[name="guestBookName"]').val(targetName);
        $(this.postBox).find('textarea[name="guestBookContents"]').val(targetContents);
        $(this.postBox).find("button").attr("onclick", "guestBook.updateGuestBook()");
        $(this.postBox).find("button").text("방명록 수정");
    },

    //변경 창 닫기
    closeUpdateForm: function () {
        this.num = null;
        $(this.postBox).find("> p").text("등록 창");
        $(this.postBox).find('input[name="guestBookName"]').val("");
        $(this.postBox).find('textarea[name="guestBookContents"]').val("");
        $(this.postBox).find("button").attr("onclick", "guestBook.insertGuestBook()");
        $(this.postBox).find("button").text("방명록 남기기");
    },

    removeEvent: function () {},
    destroy: function () {}
};

// 파도 애니메이션
const svgDraw = function (el, cor, sp) {
    const path = document.querySelector(el);
    let speed = sp;
    let offset = speed;
    let color = cor;

    set();
    function set() {
        path.style.stroke = color;
        path.style.strokeWidth = 3;
        path.style.strokeDasharray =
        path.getTotalLength() + "," + path.getTotalLength();
        path.style.strokeDashoffset = path.getTotalLength();

    window.requestAnimationFrame(draw.bind(this));
    }

    function draw() {
        if (speed < path.getTotalLength()) {
        path.style.strokeDashoffset = path.getTotalLength() - speed;

        window.requestAnimationFrame(draw.bind(this));
        speed = speed + offset;
        } else if (speed > path.getTotalLength()) {
        path.style.fill = color;
        }
    }
};


$(document).ready(function () {
    guestBook.init();
    svgDraw("#waves_svg path", "#5000ca", 30);
});
