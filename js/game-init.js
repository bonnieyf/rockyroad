$(function(){
    let selectCar = $('#select-car');
    $(".select-item a").click(function(){
        let myCar = $(this).attr('data-name');
        $(".select-item a.active").removeClass('active');
        $(this).addClass('active');
        selectCar.text(myCar);
        localStorage.setItem('myCar', myCar);

        if($('.btn-start.show').length < 1){
            $('.btn-start').addClass('show');
        }
        
    });

    
});