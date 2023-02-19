$(function(){

    $(".btn-navigation").click(function(e){
        e.preventDefault();
        let menu = $("#navigation-box");
        menu.toggleClass('show');
        if(menu.hasClass('show')){
            gsap.to(menu, { duration: .8 ,display:'block',x: 0,opacity: 1, ease: "power2.out"});
        }else{
            gsap.to(menu, { duration: .5 ,display:'none',x: 200 ,opacity: 0, ease: "power2.out"});
        }
    });

    $('.sambo-nav a').click(function(e){
        e.preventDefault();
        let showItem = $(this).attr('href');
        $('.sambo-nav a.active').removeClass('active');
        $('.sambo-slide.ani').removeClass('ani');
        $('.sambo-slide').css({display:'none',opacity: 0});
        $(this).addClass('active');
        console.log(showItem)
        $(showItem).addClass('ani').css({display:'block',opacity: 1});

    });

    
});