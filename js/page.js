$(function(){

    $(".btn-navigation").click(function(e){
        e.preventDefault();
        let menu = $("#navigation-box,#navigation-box-game");
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

    $('.knowledge1').click(function(e){
        e.stopPropagation();
        $('#knowledge').addClass('active1');
    });

    $('.knowledge2').click(function(e){
        e.stopPropagation();
        $('#knowledge').addClass('active2');
    });

    $('.knowledge3').click(function(e){
        e.stopPropagation();
        $('#knowledge').addClass('active3');
    });

    $('.knowledge4').click(function(e){
        e.stopPropagation();
        $('#knowledge').addClass('active4');
    });


    $(document).on('click', function(event) {
        if ($(event.target) !== $(event.target).closest('.btn-knowledge')) {
            $('#knowledge').removeClass();
        }
    });

});