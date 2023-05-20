const API = 'http://rockyroad.02580.me/api/questions.json';
const RESULT_API = 'http://rockyroad.02580.me/';
const URL = './rockyroad/../mp4/';

// const API = 'js/api.json';
// const URL = './mp4/';

let dataURL;
let gameInitCount = 3; // 遊戲開始前的倒數
let totalScore = 0;// 總分計算
let scoreList = [
    0,0,0,0,0,0
];
let isVideoMuted = isMobileDevice() ? true : false; // 影片是否靜音
let isAudioMuted = false; // 背景音是否靜音
let isPlayIntroAnimation = true; // 是否撥放導引動畫
let volumeList = [
    0.2,
    0.4,
    0.6,
    0.8,
    1
];
let userNumber;
let volumeCount = 2;
let maxVolumeCount = volumeList.length - 1;
let currentAudioVolume = volumeList[volumeCount]; // 背景音音量: 0.2 /0.4 / 0.6 / 0.8 / 1
let topicLevel = 0; // 從第幾關開始
let topicMaxLenght;
let topicList;
let mycar;
let nextLevelCode;
let isShowMessage = false;
let isAvoid = false;
let transList = {
        "car":[
            {prev: "1-2", next:"1-3",video_code: "1-2_1-3"},
            {prev: "1-4", next:"2-1",video_code: "1-4_2-1"},
            {prev: "2-1", next:"2-2",video_code: "2-1_2-2"},
            {prev: "2-2", next:"2-3",video_code: "2-2_2-3"},
            {prev: "2-4", next:"3-0",video_code: "2-4_3-0"},
            {prev: "3-2", next:"3-3",video_code: "3-2_3-3"}
        ],
        "motor":[
            {prev: "1-2", next:"1-3",video_code: "1-2_1-3"},
            {prev: "1-4", next:"2-1",video_code: "1-4_2-1"},
            {prev: "2-2", next:"2-3",video_code: "2-2_2-3"},
            {prev: "2-4", next:"3-0",video_code: "2-4_3-0"},
            {prev: "3-2", next:"3-3",video_code: "3-2_3-3"}
        ]
    };



$(function(){

    // let maxScore = Math.max(...scoreList);
    //     let maxScoreIndex = 1;
    //     $('#result-licence').attr('src','images/result_'+ maxScoreIndex +'_licence.svg');
    //     $('#result-licence-message').attr('src','images/result_'+ maxScoreIndex +'_msg.svg');

    //     let resultConfig = {
    //         type : 'radar',
    //         plot : {
    //             aspect : 'area',
    //             stacked: true,
    //         },
    //         scaleV: {
    //             values: "0:15:4",
    //             labels: [ '', '', '', '', '' ],
    //             item: {
    //                 "font-color": "orange",
    //                 "font-family": "Georgia",
    //                 "font-size": 12,
    //                 "font-weight": "bold",
    //                 "font-style": "italic"
    //             },
    //             refLine: {
    //                 'line-color': "none"
    //             },
    //             "guide": {
    //                 "line-color": "#000",
    //                 "line-width": 2,
    //                 "line-style": "solid",
    //             }
    //             },
    //         scaleK : {
    //             labels : ['咄咄逼人型','老子最屌型','就是很想贏型', '要你好看型', '下車PK型'],
    //             item : {
    //             fontColor : '#383738',
    //             padding : '5 10',
    //             fontSize: '16px'
    //             },
    //             tick: {
    //             lineWidth: 0,
    //             placement: "outer"
    //             },

    //             guide : {
    //             lineColor : "#000",
    //             lineStyle : 'solid',
    //             lineWidth: 2,
    //             backgroundColor: "#fff #fff"
    //             }
    //         },
    //         series : [
    //             {
    //                 values: [
    //                     scoreList[1],
    //                     scoreList[2],
    //                     scoreList[3],
    //                     scoreList[4],
    //                     scoreList[5],
    //                 ]
    //             }
    //         ]
    //     };

    //     zingchart.render({
    //         id : 'myChart',
    //         data : resultConfig,
    //         height: '100%',
    //         width: '100%'
    //     });


    // ------------------------------------------------------

    let $game_topice =  $('#game-animation .topic');

    mycar = localStorage.getItem('myCar') == '極速哺哺' ? 'car' : 'motor';
    $.ajax({
        url: API,
        type: "GET",
        dataType: "json",
        success: function (data) {
            topicList = data[mycar];

            topicMaxLenght = data[mycar].length - 1;

            // 先埋入所有的影片
            topicList.forEach(function(value){
                let videos = `<video id="ani-${value.video_code}" ${isMobileDevice()? '':'controls="false"'} playsinline preload="auto" style="pointer-events: none;" paused ${isVideoMuted ? `muted="true"`:''}><source src="${URL}${mycar== 'motor' ? 'motor/': ''}${value.video_code}.mp4" type="video/mp4"></video>`
                console.log(videos)
                $game_topice.append(videos);
            });

            transList[mycar].forEach(function(value){
                let videos = `<video id="ani-${value.video_code}" ${isMobileDevice()? '':'controls="false"'} playsinline preload="auto" style="pointer-events: none;" paused ${isVideoMuted ? `muted="true"`:''}><source src="${URL}${mycar== 'motor' ? 'motor/': ''}${value.video_code}.mp4" type="video/mp4"></video>`
                console.log(videos)
                $game_topice.append(videos);
            });

        }
    });



    // 播放開頭打字動畫
    playIntroAnimation();


    // 切換成選音樂 popup 並設定第一個為預設音樂
    $('#init-popup #btn-play-game').click(function(e){
        e.preventDefault();
        SwitchPopup('#init-popup','#init-music-popup');
        $('.music-menu a').eq(0).click();
    });

    $(document).on('click','#audio-select a',function(e){
        let _this = $(this).attr('class');


        if(_this == 'up' && volumeCount <= maxVolumeCount){
            console.log('up');
            $('#audio-select a').show();
            volumeCount++;

            if(volumeCount >= maxVolumeCount){
                volumeCount = maxVolumeCount
                $('#audio-select .up').hide();
            }
        }else if(_this == 'down' && volumeCount >= 0){
            console.log('down');
            $('#audio-select a').show();
            volumeCount--;

            if(volumeCount <= 0){
                volumeCount = 0;
                $('#audio-select .down').hide();
            }
        }

        console.log(volumeCount);


        switch(volumeCount){
            case 0:
                currentAudioVolume = volumeList[0];
                break;
            case 1:
                currentAudioVolume = volumeList[1];
                break;
            case 2:
                currentAudioVolume = volumeList[2];
                break;
            case 3:
                currentAudioVolume = volumeList[3];
                break;
            default:
                currentAudioVolume = volumeList[4];
                break;
        }
        $('#audio-select .volume').removeClass().addClass(`volume volume-${currentAudioVolume * 100}`);
        document.getElementById("bg-audio").volume = currentAudioVolume * 0.8;
    });

    // 選音樂 popup
    $(document).on('click','.music-menu a',function(e){
        e.preventDefault();
        let currentMusic = $(this).attr('data-style');
        let index = $(this).parent().index();
        $('.music-menu li.active,.music-sample div.active').removeClass('active');
        $(this).parent().addClass('active');
        scoreList = [
            0,0,0,0,0,0
        ];
        // 選擇音樂，並加入一開始的暴怒分數
        switch(index){
            case 1:
                scoreList[3] = 3
                break;
            case 2:
                scoreList[2] = 2
                break;

            default:
                scoreList[0] = 0
        }

        console.log('** 初始分數: '+scoreList + '**');

        $('.music-sample div').eq(index).addClass('active');
        $('.background-music').empty();
        $('#audio-select').show();


        let audioHtml =  `<audio id="bg-audio" autoplay loop ${isAudioMuted ? `muted="true"`:''}><source src="./rockyroad/../music/${currentMusic}.mp3" type="audio/mp3" controls></audio>`

        $('.background-music').append(audioHtml);
        $('#audio-select .volume').removeClass().addClass(`volume volume-${currentAudioVolume * 100}`);
        document.getElementById("bg-audio").volume = currentAudioVolume * 0.8;



    });



    //選擇音樂後進入遊戲
    $(".btn-playgame").click(function(e){
        e.preventDefault();
        $('#init-popup,.overlay ,#init-game-bg ,#init-music-popup').hide();
        $game_topice.addClass('active');

        // 載入倒數動畫
        $('#init-timer').fadeIn();
        let video = $('#ani-'+topicList[topicLevel].video_code);
        video.addClass('active');

        // 倒數動畫
        let timer = setInterval( function() {
            $('#countdown').remove();
            let countdown = $('<div id="countdown">'+(gameInitCount==0? '123':'<img src="images/init-number-'+ gameInitCount +'.svg" alt=""></div>'));
            countdown.appendTo($('#init-timer'));
            setTimeout( () => {
                if (gameInitCount >-1) {
                    $('#countdown').css({ 'width': '260px', 'opacity': 1 });
                } else {
                    $('#countdown').css({ 'width': '100px', 'opacity': 1 });
                }
            },20);
            gameInitCount--;
            if (gameInitCount == -1){
                clearInterval(timer);
                $('#init-timer').fadeOut();
                document.getElementById('ani-'+topicList[topicLevel].video_code).play();
            }
        }, 800);


        video.on("playing", function() {
            addTopic();
            addOptionsVideo();
        });
        video.on("ended", function() {
            fadeInTopic();

        });
    });

    $(document).on('click','.btn-share.btn-link',function()
    {
        let userName = $('input[name="result-user-name"]').val();
        if(userName.length == ''){
            alert('請填寫姓名資料!');
            return false;
        }


        $('input[name="result-user-name"]').prop('readonly', true);
        share_fb(userName);
    });

    //選擇每一題選項後
    $(document).on('click','.choose-myoption',function(e){
        e.preventDefault();

        let myscore = parseInt($(this).attr('data-score'),10);
        let myresult = $(this).attr('data-file');
        let $game_result =  $('#game-animation .result');
        let idx = $(this).index();
        let currentOption = topicList[topicLevel].options[idx]
        let _isColor = topicList[topicLevel].options[idx].color;
        let _isExtra = topicList[topicLevel].options[idx].extra;
        let _message = currentOption.message
        let $_message = $(_message)

        console.log('點選的 Video code:'+myresult);

        $('.game-popup .inner-textarea').empty();

        let oldScroe = scoreList[myscore];
        scoreList[myscore] = oldScroe+myscore;
        console.log(_isColor);
        console.log(_isExtra);
        console.log(topicList[topicLevel].options[idx].message);
        console.log('XXXXXXXXX');
        console.log($_message)

        if ($_message.find('figure').get(0)) {
            let figure = $_message.find('figure')
            let imgUrl = figure.data('trix-attachment').url
            let img = $('<img>').attr('src', imgUrl)

            img.insertBefore(figure)
        }

        if(_isColor == 'red' && _isExtra == ''){
            console.log('========= 警告頁面 =========');
            $('#game-warning .inner-textarea').append($_message);
            $('.game-popup.active').removeClass('active');
            $('#game-warning').addClass('active');
            $('.overlay').fadeIn();
            $('.btn-next-more').attr('data-file',myresult);
            return;
        }

        if(_isExtra !== ''){
            console.log('========= 罰單頁面 =========');
            $('#game-oops .inner-textarea').append($_message);
            $('.game-popup.active').removeClass('active');
            $('#game-oops').addClass('active');
            $('.overlay').fadeIn();
            $('.btn-next-more').attr('data-file',myresult);
            return;
        }

        fadeOutTopic();

        $game_topice.removeClass('active');
        $game_result.addClass('active');
        $('#ani-'+topicList[topicLevel].video_code).removeClass('active');
        $('#result-'+myresult).addClass('active');

        document.getElementById('result-'+myresult).play();

        $('#result-'+myresult).on("ended", function() {
            handleTopicLevel();
        });

        console.log(`%c======= 總分 ${scoreList} 分======`, 'color: red');
        console.log(`%c======= 點選此選項增加 ${myscore} 分======`, 'color: red');

    });


    $(document).on('click','.btn-next-more',function(e){
        e.preventDefault();
        $('.game-popup').removeClass('active');
        $('.overlay').fadeOut();

        let videoCode = $(this).attr('data-file');
        fadeOutTopic();

        $game_topice.removeClass('active');
        $('#game-animation .result').addClass('active');
        $('#ani-'+topicList[topicLevel].video_code).removeClass('active');
        $('#result-'+videoCode).addClass('active');


        document.getElementById('result-'+videoCode).play();
        $('#result-'+videoCode).on("ended", function() {
            handleTopicLevel();
        });
    });




});

function share_fb(userName) {
    $.ajax({
        url: RESULT_API+'scores/'+userNumber,
        method:"PUT",
        data: {
            score:{
                name: userName
            }
        },
        success: function(res){
          console.log(res);
        }
    });


    const maxScore = Math.max(...scoreList);

    const scoreIndex = scoreList.indexOf(maxScore);
    let license_type =  '';

    switch(scoreIndex){
        case 1:
            license_type = 'bad_1';
            break;
        case 2:
            license_type = 'bad_2';
            break;
        case 3:
            license_type = 'bad_3';
            break;
        case 4:
            license_type = 'bad_4';
            break;
        case 5:
            license_type = 'bad_5';
            break;
        default:
            license_type = 'good_boy';
            break;
    }

    console.log(license_type)
    console.log(`http://rockyroad.02580.me/license?name=${userName}&license_type=${license_type}`);
    $('#game-result .btn-share').attr('href',`http://rockyroad.02580.me/license?name=${userName}&license_type=${license_type}`);
}

function capture() {
    let html = $("#cloneDiv").html();
	let iframe = document.createElement("iframe");
	iframe.style.width = "785px";
	iframe.style.height = "100%";
	document.querySelector('#game-result').appendChild(iframe);
	iframe.srcdoc = html;

	iframe.addEventListener("load", () => {
		 $('iframe').contents().find("head")
     .append($("<link rel='stylesheet' href='css/web.css'>"));
		
		 html2canvas(iframe.contentWindow.document.body).then(function(canvas) {
			 let filename = "image.jpg";
			 let link = document.createElement("a");
			 link.download = filename.toLowerCase();
			 canvas.toBlob( function(blob) {
							link.href = URL.createObjectURL(blob);
							link.click();
					}, 'image/jpg');
			 });
	});

  }

function handleTopicLevel(){

    if(topicLevel === topicMaxLenght){

        let currentScore = {
            score: {
                "good_boy":scoreList[0],
                "bad_1":scoreList[1],
                "bad_2":scoreList[2],
                "bad_3":scoreList[3],
                "bad_4":scoreList[4],
                "bad_5":scoreList[5],

            }
        }

        $.ajax({
            url: RESULT_API+'scores.json',
            method:"POST",
            data: currentScore,
            success: function(res){
              console.log('ajax result:');
              userNumber = res.id;
              console.log(res.id)
            }
        });

        $('#game-result').fadeIn();
        $('#audio-select').fadeOut();
        document.getElementById("bg-audio").volume = currentAudioVolume * 0.5;



        let maxScore = Math.max(...scoreList);
        let maxScoreIndex = scoreList.indexOf(maxScore);
        $('html').addClass('has-finished');
        $('#result-licence').attr('src','images/result_'+ maxScoreIndex +'_licence.svg');
        $('#result-licence-message').attr('src','images/result_'+ maxScoreIndex +'_msg.svg');
        

        let resultConfig = {
            type : 'radar',
            plot : {
                aspect : 'area',
                stacked: true,
            },
            scaleV: {
                values: "0:15:4",
                labels: [ '', '', '', '', '' ],
                item: {
                    "font-color": "orange",
                    "font-family": "Georgia",
                    "font-size": 12,
                    "font-weight": "bold",
                    "font-style": "italic"
                },
                refLine: {
                    'line-color': "none"
                },
                "guide": {
                    "line-color": "#000",
                    "line-width": 2,
                    "line-style": "solid",
                }
                },
            scaleK : {
                labels : ['咄咄逼人型','老子最屌型','就是很想贏型', '要你好看型', '下車PK型'],
                item : {
                fontColor : '#383738',
                padding : '5 10',
                fontSize: '16px'
                },
                tick: {
                lineWidth: 0,
                placement: "outer"
                },

                guide : {
                lineColor : "#000",
                lineStyle : 'solid',
                lineWidth: 2,
                backgroundColor: "#fff #fff"
                }
            },
            series : [
                {
                    values: [
                        scoreList[1],
                        scoreList[2],
                        scoreList[3],
                        scoreList[4],
                        scoreList[5],
                    ]
                }
            ]
        };

        zingchart.render({
            id : 'myChart',
            data : resultConfig,
            height: '100%',
            width: '100%'
        });

        $('#game-animation').hide();
        return false;
    }

    if(topicList[topicLevel].video_code == '3-0-0'){
        if(isAvoid){
            console.log('閃避成功！！！！');
            topicLevel = 10;
        }else{
            console.log('閃避失敗！！！！');
            topicLevel = 9;
        }
    }else{
        if(topicList[topicLevel].video_code == '3-1-1-0' | topicList[topicLevel].video_code == '3-1-2-0'){
            topicLevel = 11;
        }else{
            topicLevel++;
        }
    }

    console.log(topicList[topicLevel].video_code)
    console.log('目前關卡:'+topicLevel);
    console.log('%c累積分數：'+totalScore,'background-color: yellow');

    nextLevelCode = topicList[topicLevel].video_code.slice(0,3);
    console.log('下一個關卡: '+nextLevelCode);




    if(checkHasTransition(nextLevelCode)){
        let transVideoCode = transList[mycar].find((value) => {return value.next == nextLevelCode}).video_code;
        let currentTransVideo = $('#ani-'+transVideoCode);

        $('#game-animation .result,#game-animation .result video').removeClass('active');

        $('#game-animation .topic video').removeClass('active');
        currentTransVideo.addClass('active');

        currentTransVideo.get(0).play();
        currentTransVideo.on("ended", function() {
            console.log('play end!!!');
            playResultAnimation();
        });
        return false;
    }

    playResultAnimation();

}


function addButton(){
    $('body').append('<div class="avoid-button button"></div>');

    let timer = setTimeout(function(){
        fadeOutTopic();

        isAvoid = false;

        if(!isAvoid){
            console.log('閃避失敗！！！！！！！！！');
            handleTopicLevel();
        }
    },3000);

    $('.avoid-button').click(function(){
        fadeOutTopic();
        clearTimeout(timer);
        isAvoid = true;
        if(isAvoid){
            console.log('閃避成功！！！！！！！！！');
            handleTopicLevel();
        }
    });




}

function playResultAnimation(){
    console.log('------------------------------');
    console.log('------------------------------');
    console.log(topicList[topicLevel])
    console.log(topicLevel);
    console.log('------------------------------');
    console.log('------------------------------');
    let video = $('#ani-'+topicList[topicLevel].video_code);
    $('#game-animation .topic video').removeClass('active');
    video.addClass('active');

    document.getElementById('ani-'+topicList[topicLevel].video_code).play();
    video.on("playing", function() {
        setTimeout(addTopic, 500);
        addOptionsVideo();
    });
    video.on("ended", function() {
        fadeInTopic();
    });
}

function checkHasTransition (nextLevelCode){
    if(transList[mycar].find((value) => {return value.next == nextLevelCode})){
        return true;
    }else{
        return false;
    }
}

function checkPrevHasTransition (prevLevelCode){
    if(transList[mycar].find((value) => {return value.prev == prevLevelCode})){
        return true;
    }else{
        return false;
    }
}

function fadeInTopic(){
    $('.topic-box').addClass('active');
    if(topicList[topicLevel].video_code === '3-0-0'){
        addButton();
    }
}

function fadeOutTopic(){
    $('.topic-box').removeClass('active');

    if(topicList[topicLevel].video_code === '3-0-0'){
        $('.avoid-button').fadeOut(200);
    }
}

function addOptionsVideo(){
    console.log('加入選項影片');
    let videosHtml = '';

    topicList[topicLevel].options.forEach(function(item){
        let $game_result =  $('#game-animation .result');
        $game_result.empty();
        videosHtml += `<video id="result-${item.video_code}" ${isMobileDevice()? '': controls="false"} playsinline ${isVideoMuted ? `muted="true"`:''} paused><source src="${URL}${mycar== 'motor' ? 'motor/': ''}${item.video_code}.mp4" type="video/mp4"></video>`;
        console.log(videosHtml)
        $game_result.append(videosHtml);
    });
}


// 加入題目 & 題目選項
function addTopic(){
    let topicTitle, topicOptions;
    let topicTemplat;
    let number = ['A','B','C'];

    topicTitle = topicList[topicLevel].title;
    topicOptions = topicList[topicLevel].options;


    topicTemplat = `<div class="center"><p class="title">${ topicTitle }</p><div class="topic-option">`;
    for(i = 0;i < topicOptions.length;i++){
        topicTemplat += `<a href="" class="choose-myoption option" data-score="${topicOptions[i].power}" data-file="${topicOptions[i].video_code}">
        <div class="number">${number[i]}</div>
        <div class="desc">${topicOptions[i].text.substring(2, topicOptions[i].text.length)}</div>
        </a>`;
    }
    topicTemplat+= '</div></div>';

    $('.topic-box .content').empty();
    $('.topic-box .content').append(topicTemplat);
}



function SwitchPopup(prev,next){
    $(prev).removeClass('active');
    $(next).addClass('active');
}

function playIntroAnimation(){
    if(isPlayIntroAnimation){
        let myCar = localStorage.getItem('myCar');
        $('#init-mycar-name').text(myCar);

        setTimeout(function(){
            $("#init").hide();
            $('#init-popup').addClass('active');
        },10000);
    }else{
        // 直接開始遊戲
        $("#init").hide();
        $('#init-popup').addClass('active');
    }
}


function isMobileDevice() {
    let mobileDevices = ['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone']
    for (var i = 0; i < mobileDevices.length; i++) {
        if (navigator.userAgent.match(mobileDevices[i])) {
          //console.log("isMobileDevice: match " + mobileDevices[i]);
          return true;
        }
    }
    return false
  }