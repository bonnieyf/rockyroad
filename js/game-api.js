const API = './api.json';
let gameInitCount = 3; // 遊戲開始前的倒數
let totalScore = 0; // 總分計算
let isVideoMuted = false; // 影片是否靜音
let isAudioMuted = false; // 背景音是否靜音
let isPlayIntroAnimation = true; // 是否撥放導引動畫
let volumeList = [
    0.2,
    0.4,
    0.6,
    0.8,
    1
];
let volumeCount = 1;
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
            {prev: "2-1", next:"2-2",video_code: "2-1_2-2"},
            {prev: "2-2", next:"2-3",video_code: "2-2_2-3"},
            {prev: "2-4", next:"3-0",video_code: "2-4_3-0"}
        ]
    };

$(function(){
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
                let videos = `<video id="ani-${value.video_code}" controls="false" paused ${isVideoMuted ? `muted="true"`:''}><source src="./rockyroad/../mp4/${value.video_code}.mp4" type="video/mp4"></video>`
                $game_topice.append(videos);
            });

            transList[mycar].forEach(function(value){
                let videos = `<video id="ani-${value.video_code}" controls="false" paused ${isVideoMuted ? `muted="true"`:''}><source src="./rockyroad/../mp4/${value.video_code}.mp4" type="video/mp4"></video>`
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

    
    //選擇每一題選項後
    $(document).on('click','.choose-myoption',function(e){
        e.preventDefault();

        let myscore = parseInt($(this).attr('data-score'),10);
        let myresult = $(this).attr('data-file');
        let $game_result =  $('#game-animation .result');
        let idx = $(this).index();
        let _isColor = topicList[topicLevel].options[idx].color;
        let _isExtra = topicList[topicLevel].options[idx].extra;
        console.log('點選的 Video code:'+myresult);

        $('.game-popup .inner-textarea').empty();

        totalScore+=myscore;

        if(_isColor == 'red'){
            $('#game-warning .inner-textarea').append(topicList[topicLevel].options[idx].message);
            $('#game-warning').addClass('active');
            $('.overlay').fadeIn();
            $('.btn-next-more').attr('data-file',myresult);

        }else if(_isExtra){
            $('#game-oops .inner-textarea').append(topicList[topicLevel].options[idx].extra);
            $('#game-oops').addClass('active');
            $('.overlay').fadeIn();
            $('.btn-next-more').attr('data-file',myresult);
        }else{

            fadeOutTopic();

            $game_topice.removeClass('active');
            $game_result.addClass('active');
            $('#ani-'+topicList[topicLevel].video_code).removeClass('active');
            $('#result-'+myresult).addClass('active');
        
            document.getElementById('result-'+myresult).play();
            
            $('#result-'+myresult).on("ended", function() {
                handleTopicLevel();
            });
        }

        console.log(`%c======= 點選此選項增加 ${myscore} 分======`, 'color: red');

    });


    $(document).on('click','.btn-next-more',function(){
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



function handleTopicLevel(){

    if(topicLevel === topicMaxLenght){
        $('#game-result').fadeIn();
        $('#game-animation').hide();
        return false;
    }

    if(topicList[topicLevel].video_code == '3-0-0'){
        if(isAvoid){
            topicLevel = 9;
        }else{
            topicLevel = 10;
        }
    }else{
        if(topicList[topicLevel].video_code == '3-1-1-0'){
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
            handleTopicLevel();
        }
    },3000);

    $('.avoid-button').click(function(){
        fadeOutTopic();
        clearTimeout(timer);
        isAvoid = true;

        if(isAvoid){
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
        videosHtml += `<video id="result-${item.video_code}" controls="false" ${isVideoMuted ? `muted="true"`:''} paused><source src="./rockyroad/../mp4/${item.video_code}.mp4" type="video/mp4"></video>`;
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
