let totalScore = 0;
let level = 0;
let topicLevel = 0;
let aniList = [{
    'hasOption': true,
    'file': '1-1-0'
},{
    'hasOption': true,
    'file': '1-2-0'
},{
    'hasOption': false,
    'file': '1-2-1-3'
},{
    'hasOption': true,
    'file':'1-3-0'
},{
    'hasOption': true,
    'file': '1-4-0'
}];


let topicList = [{
    topic: '突然出現一個不要命的機車族！',
    options: [
        {
            'desc':'就讓你看看誰是這條路的霸主！',
            'score': 3,
            'file': '1-1-1'
        },
        {
            'desc':'趁他停下，開窗教育他如何騎車',
            'score': 2,
            'file': '1-1-2'
        },
        {
            'desc':'看起來好危險，還是離遠點好',
            'score': 0,
            'file': '1-1-3'
        }
    ]
},
{
    topic: '一台小黃為了接客越到對向要超我車，還不打方向燈！',
    options: [
        {
            'desc':'運將辛苦，讓他先過吧',
            'score': 0,
            'file': '1-2-1'
        },
        {
            'desc':'不想賺錢了是不是?看誰的車比較硬啊',
            'score': 3,
            'file': '1-2-2'
        },
        {
            'desc':'給老子下來！我來教教你怎麼開車！',
            'score': 5,
            'file': '1-2-3'
        }
    ]
},
{
    topic: '這台貨車開在內側車道速度卻很慢，\n方向燈還一直打著到底想幹嘛…',
    options: [
        {
            'desc':'狂按喇叭要他閃邊',
            'score': 4,
            'file': '1-3-1'
        },
        {
            'desc':'在車上大罵髒話抱怨',
            'score': 1,
            'file': '1-3-2'
        },
        {
            'desc':'抓準時機快速超過！',
            'score': 0,
            'file': '1-3-3'
        }
    ]
},
{
    topic: '好不容易開到這台卡車前面，\n但他好像以為我在挑釁他要跟我競速，開始逼車了…',
    options: [
        {
            'desc':'保持心態穩定駕駛，確定好行車紀錄器，之後報警檢舉',
            'score': 0,
            'file': '1-4-1'
        },
        {
            'desc':'等卡車開到旁邊，送他一個國際手勢',
            'score': 4,
            'file': '1-4-2'
        },
        {
            'desc':'不知好歹！要競速是不是？頭文字D START！',
            'score': 3,
            'file': '1-4-3'
        }
    ]
}]




$(function(){

    InitGameAnimation();

    $('#init-popup #btn-play-game').click(function(e){
        e.preventDefault();
        SwitchPopup('#init-popup','#init-music-popup');
        $('.music-menu a').eq(0).click();
    });

    $(document).on('click','.music-menu a',function(e){
        e.preventDefault();
        let currentMusic = $(this).attr('data-style');
        let index = $(this).parent().index();
        $('.music-menu li.active,.music-sample div.active').removeClass('active');
        $(this).parent().addClass('active');

        switch(index){
            case 1:
                totalScore +=3
                break;
            case 2:
                totalScore +=2
                break;
        }
        $('.music-sample div').eq(index).addClass('active');
        $('.background-music').empty();
        let audioHtml =  '<audio id="bg-audio" autoplay loop><source src="./rockyroad/../music/'+ currentMusic +'.mp3" type="audio/mp3" controls></audio>'
        
        $('.background-music').append(audioHtml);
        document.getElementById("bg-audio").volume = 0.5;
    });

    aniList.forEach(function(value){
        let content =  $('#game-animation .topic');
        let mp4Html = '<video id="ani-'+ value.file +'" controls="false" paused><source src="./rockyroad/../mp4/'+ value.file +'.mp4" type="video/mp4"></video>'
        content.append(mp4Html);
    });
    

    // let counter = 3;

    // let timer = setInterval( function() { 
    
    //     $('#countdown').remove();     
        
    //     var countdown = $((counter==0? '123':'<img src="images/init-number-'+ counter +'.svg" alt="">')); 
    //     countdown.appendTo($('#init-timer .center'));
    //     setTimeout( () => {
    //         if (counter >-1) {
    //             $('#countdown').css({ 'width': '200px', 'opacity': 0 }); 
    //         } else {
    //             $('#countdown').css({ 'width': '100px', 'opacity': 50 });
    //         }
    //     },20);
    //     counter--;
    //     if (counter == -1) clearInterval(timer);
    // }, 1000);

    //選擇音樂後進入遊戲
    $(".btn-playgame").click(function(e){
        e.preventDefault();
        $('#init-popup,.overlay ,#init-game-bg ,#init-music-popup').hide();
        $('#game-animation .topic').addClass('active');
        let video = $('#ani-'+aniList[0].file);
        video.addClass('active');
        document.getElementById('ani-'+aniList[0].file).play();
        video.on("playing", function() {
            addTopic(topicLevel);
            addOptionsFile(topicLevel);
        });
        video.on("ended", function() {
            fadeInTopic();
        });
    });


    //選擇選項後
    $(document).on('click','.choose-myoption',function(e){
        e.preventDefault();

        let myscore = parseInt($(this).attr('data-score'),10);
        let myresult = $(this).attr('data-file');
        let content =  $('#game-animation .result');
        
        
        fadeOutTopic();

        $('#game-animation .topic').removeClass('active');
        content.addClass('active');
        $('#ani-'+aniList[level].file).removeClass('active');
        $('#result-'+myresult).addClass('active');
        totalScore+=myscore;
        
        document.getElementById('result-'+myresult).play();
        
        $('#result-'+myresult).on("ended", function() {
            console.log('play end!!')
            handleLevel();
        });
    });
});


function handleLevel(){
    level++;

    if(level === 5){
        // alert('路怒分數'+totalScore+'!\n已結束遊戲！');

        $('#game-result').fadeIn();
        $('#game-animation').hide();
        return false;
    }

    if(aniList[level].hasOption){
        topicLevel++;

        let video = $('#ani-'+aniList[level].file);
        $('#game-animation .topic video').removeClass('active');
        video.addClass('active');
        
        document.getElementById('ani-'+aniList[level].file).play();
        video.on("playing", function() {
            addTopic(topicLevel);
            addOptionsFile(topicLevel);
        });
        video.on("ended", function() {
            fadeInTopic();
        });
    }else{
        let content =  $('#game-animation .result');
        let topicContent =  $('#game-animation .topic');
        content.removeClass('active');
        content.find('video').removeClass('active');

        topicContent.addClass('active');

        let video = $('#ani-'+aniList[level].file);
        video.addClass('active');
        document.getElementById('ani-'+aniList[level].file).play();
        video.on("ended", function() {
            handleLevel();
        });
    }
    

    console.log('目前關卡:'+level);
    console.log('累積分數：'+totalScore);

    
}

function fadeInTopic(){
    $('.topic-box').addClass('active');
}

function fadeOutTopic(){
    $('.topic-box').removeClass('active');
}

function addOptionsFile(topicLevel){
    let mp4Html;
    topicList[topicLevel].options.forEach(function(item){
        let content =  $('#game-animation .result');
        content.empty();
        console.log(item.file)
        mp4Html += '<video id="result-'+ item.file +'" controls="false" paused><source src="./rockyroad/../mp4/'+ item.file +'.mp4" type="video/mp4"></video>';
        content.append(mp4Html);
    });
}

function addTopic(value){
    let topicTitle, topicOptions;
    let topicTemplat;
    let number = ['A','B','C'];

    topicTitle = topicList[value].topic;
    topicOptions = topicList[value].options;
    
    topicTemplat = `<div class="center"><p class="title">${ topicTitle }</p><div class="topic-option">`;
    for(i = 0;i < topicOptions.length;i++){
        topicTemplat += `<a href="#" class="choose-myoption option" data-score="${topicOptions[i].score}" data-file="${topicOptions[i].file}">
        <div class="number">${number[i]}</div>
        <div class="desc">${topicOptions[i].desc}</div>
        </a>`;
    }
    topicTemplat+= '</div></div>';

    $('.topic-box .content').empty();
    $('.topic-box .content').append(topicTemplat);
}



function SwitchPopup(prev,next){
    console.log('add')
    $(prev).removeClass('active');
    $(next).addClass('active');
}

function InitGameAnimation(){
    //Typing
    let myCar = localStorage.getItem('myCar');
    $('#init-mycar-name').text(myCar);

    setTimeout(function(){
        $("#init").hide();
        $('#init-popup').addClass('active');
    },12000);
}
