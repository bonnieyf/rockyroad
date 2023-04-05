$(function(){

    let loaded = false;
    let loadedCnt = 0;
    let loadStatus = 0;
    let loadPercent = 0;
    const allImgs = document.querySelectorAll('img').length;
    const progressCnt = document.getElementById('progress-count');
    const imgLoad = imagesLoaded('img');

    let tlProgress = gsap.timeline({
    onUpdate: () => {
        loadPercent = Math.floor(tlProgress.progress() * 100);
        progressCnt.style.width = loadPercent + '%';

        if(loadPercent == '100'){
            loaded = true;
        }
    },
    onComplete: () => {
        if(loaded){
            let tlComplete = gsap.timeline()
            .to('#loading', {'opacity': 0, duration: 0.7 ,ease: Power2.easeOut})
            .to('#loading', {'display': 'none'});

            let initAni = gsap.timeline()
                .set('#home .car,#mob-home .car', {'opacity': 0 ,y: -200})
                .set('#home .big-logo,#mob-home .big-logo', {'opacity': 0,y: -500 ,scale:0 ,rotation: '100deg'})
                .to('#home .car,#mob-home .car', {'opacity': 1, duration: 0.8 ,y: 0 ,ease: Back.easeOut})
                .to('#home .big-logo,#mob-home .big-logo', {'opacity': 1, duration: 0.8 ,y: 0 ,scale:1 ,rotation:'0deg' ,ease: Back.easeOut})
        }
    }
    });

    tlProgress.to('#progress-bar', {x: 0})

    if (allImgs > 0) {
    imgLoad.on( 'progress', function( instance, image ) {
        loadedCnt++;
        loadStatus = loadedCnt/allImgs;
        gsap.to(tlProgress, {progress:loadStatus})
    });
    };

    
});