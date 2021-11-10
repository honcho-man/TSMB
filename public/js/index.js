//add ripple effect to buttons
$('.lg-nav, .sm-nav').find('li').addClass('btn-ripple');
$('.primary-btn').addClass('btn-ripple')
//close side-bar onclick link
$('.sm-nav').find('li').attr('data-bs-dismiss', 'offcanvas');
//change active classes of nav links
$('.lg-nav, .sm-nav').find('li').on('click', function(e){
    if(!e.currentTarget.classList.contains('active-nav')) {
        $('.lg-nav, .sm-nav').find('li.active-nav').removeClass('active-nav')
        e.currentTarget.classList.add('active-nav')
    }
})