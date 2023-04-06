const API = '../api.json';
let gameInitCount = 3; // 遊戲開始前的倒數
let totalScore = 0; // 總分計算
let isVideoMuted = false; // 影片是否靜音
let isAudioMuted = false; // 背景音是否靜音
let isPlayIntroAnimation = false; // 是否撥放導引動畫
let currentAudioVolume = 0.5; // 背景音音量
let topicLevel = 8; // 從第幾關開始
let topicMaxLenght;
let topicList;
let mycar;

$(function(){
    let $game_topice =  $('#game-animation .topic');

    mycar = localStorage.getItem('myCar') == '極速哺哺' ? 'car' : 'motor';

    $.ajax({
        url: API,
        type: "GET",
        dataType: "json",
        success: function (data) {
            topicList = data[mycar];
            console.log('data:'+ data[mycar]);

            topicMaxLenght = data[mycar].length - 1;

            // 先埋入所有的影片
            topicList.forEach(function(value){
                let videos = `<video id="ani-${value.video_code}" controls="false" paused muted='${isVideoMuted}'><source src="./rockyroad/../mp4/${value.video_code}.mp4" type="video/mp4"></video>`
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


    // 選音樂 popup
    $(document).on('click','.music-menu a',function(e){
        e.preventDefault();
        let currentMusic = $(this).attr('data-style');
        let index = $(this).parent().index();
        $('.music-menu li.active,.music-sample div.active').removeClass('active');
        $(this).parent().addClass('active');

        // 選擇音樂，並加入一開始的暴怒分數
        switch(index){
            case 1:
                totalScore +=3
                break;
            case 2:
                totalScore +=2
                break;
        }

        console.log('** 初始分數: '+totalScore + '**');

        $('.music-sample div').eq(index).addClass('active');
        $('.background-music').empty();
        let audioHtml =  `<audio id="bg-audio" autoplay loop muted='${isAudioMuted}'><source src="./rockyroad/../music/${currentMusic}.mp3" type="audio/mp3" controls></audio>`
        
        $('.background-music').append(audioHtml);
        document.getElementById("bg-audio").volume = currentAudioVolume;
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


    //選擇每一題選項後
    $(document).on('click','.choose-myoption',function(e){
        e.preventDefault();

        let myscore = parseInt($(this).attr('data-score'),10);
        let myresult = $(this).attr('data-file');
        let $game_result =  $('#game-animation .result');

        
        fadeOutTopic();

        $game_topice.removeClass('active');
        $game_result.addClass('active');
        $('#ani-'+topicList[topicLevel].video_code).removeClass('active');
        $('#result-'+myresult).addClass('active');
        totalScore+=myscore;

        console.log(`%c======= 點選此選項增加 ${myscore} 分======`, 'color: red');

        document.getElementById('result-'+myresult).play();
        
        $('#result-'+myresult).on("ended", function() {
            handleTopicLevel();
        });

    });
});


function handleTopicLevel(){
    

    if(topicLevel === topicMaxLenght){
        $('#game-result').fadeIn();
        $('#game-animation').hide();
        return false;
    }

    topicLevel++;

    console.log('目前關卡:'+topicLevel);
    console.log('%c累積分數：'+totalScore,'background-color: yellow');

    let video = $('#ani-'+topicList[topicLevel].video_code);
    $('#game-animation .topic video').removeClass('active');
    video.addClass('active');
    
    document.getElementById('ani-'+topicList[topicLevel].video_code).play();
    video.on("playing", function() {
        addTopic();
        addOptionsVideo();
    });
    video.on("ended", function() {
        fadeInTopic();
    });

    

    
}

function fadeInTopic(){
    $('.topic-box').addClass('active');
}

function fadeOutTopic(){
    $('.topic-box').removeClass('active');
}

function addOptionsVideo(){
    console.log('加入選項影片');
    let videosHtml;
    topicList[topicLevel].options.forEach(function(item){
        let $game_result =  $('#game-animation .result');
        $game_result.empty();
        videosHtml += `<video id="result-${item.video_code}" controls="false" muted='${isVideoMuted}' paused><source src="./rockyroad/../mp4/${item.video_code}.mp4" type="video/mp4"></video>`;
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
        topicTemplat += `<a href="#" class="choose-myoption option" data-score="${topicOptions[i].power}" data-file="${topicOptions[i].video_code}">
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
