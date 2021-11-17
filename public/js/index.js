var target = 'http://localhost:8500';
$.ajax({
    method: 'GET',
    url: target,
    dataType: 'json',
    success: function (response) {
    console.log(response);
}
});
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
//copy acct no on click
function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).html().trim()).select();
    document.execCommand("copy");
    $temp.remove();
    $('.copy-text').html('copied!')
}
//require all input
$('input').attr('required', true)
//show all bundle list on click !experimental :)
function hasParentClass(child) {
    let parent = child.parentNode.children[2];
    parent.classList.toggle('toggle');
    child.children[0].classList.toggle('d-none')
    child.children[1].classList.toggle('d-block')
}
//require only number in tel inputs
$('#recipient_phone, #benefactor_phone, #phone').on('keypress', function(e) {
    var charCode = (e.which) ? e.which : event.keyCode
    if (String.fromCharCode(charCode).match(/[^0-9]/g)) {
        return false;
    }
})

//gift user
$('.gift-form form').on('submit', function(e) {
    e.preventDefault()
    let formPar = $(this);
    formPar.find('input, textarea, :submit').attr('disabled', true)
    formPar.find(':submit').html('<i class="fa fa-spinner fa-spin"></i>')
    setTimeout(() => {
        $.ajax({
            method: "POST",
            url: "/gift",
            data: {
                recipient_name: $('#recipient_name').val(),
                recipient_email: $('#recipient_email').val(),
                recipient_phone: $('#recipient_phone').val(),
                benefactor_name: $('#benefactor_name').val(),
                benefactor_email: $('#benefactor_email').val(),
                benefactor_phone: $('#benefactor_phone').val(),
                msg: $('.msg').val()
            },
            success: function (response) {
                formPar.find(':submit').html('done!')
                setTimeout(() => {
                    formPar.find('input, textarea, :submit').val('').attr('disabled', false)
                    formPar.find(':submit').html('submit')
                }, 3000);
            },
            error: function (response) {
                formPar.find(':submit').html('failed! Please try again').attr('disabled', false)
                setTimeout(() => {
                    formPar.find('input, textarea').val('').attr('disabled', false)
                    formPar.find(':submit').html('submit')
                }, 3000);
            }
        });
    }, 3000);
})
// payment button
$('.pay-btn').one('click', (evt) => {
    evt.preventDefault()
    evt.target.classList.add('loading')
    $('.pay-btn-icon,.pay-btn-text').fadeOut('fast')
    setTimeout(() => {
      evt.target.classList.remove('loading')
      $('.pay-btn').html('Redirected!')
      window.location = $('.pay-btn').attr('href');
    }, 3000);
})
//image upload
var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
//var day = dateObj.getUTCDate() - 1;
var year = dateObj.getUTCFullYear();
var newdate;
const weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

let day = weekday[dateObj.getDay()];
newdate = month + "-" + day;
var time = dateObj.getHours() + ":" + dateObj.getMinutes() + ":" + dateObj.getSeconds();
$('input[type=file]').removeAttr('required')
function uploadFile() {
    console.log('okay')
    var fd = new FormData();
        var files = $('#myfile')[0].files[0];
        fd.append('myfile',files);
        $('.stat').fadeIn('slow').html('<i class="fa fa-spin fa-spinner"></i>')
    setTimeout(() => {
        $.ajax({
            method: "POST",
            url: "/api/image",
            enctype: "multipart/form-data",
            data: fd,
            processData: false,
            contentType: false,
            success: function (response) {
                $('.stat').html('<i class="fa fa-check text-success"></i>')
                $('.payment-form form').find(':submit').removeAttr('disabled')
                localStorage.setItem('filename', $('#myfile').val().split('\\').pop())
                console.log(newdate)
                localStorage.setItem('date', newdate)
                localStorage.setItem('time', time)
            },
            error: function (response) {
                $('.stat').html('<i class="fa fa-times text-danger"></i>')
                $('.payment-form form').find(':submit').attr('disabled', true)
                $('#size').addClass('text-danger').html('File not uploaded please try again')
            }
        });
    }, 500);
}

function fileValidation1() {
    var fileInput = 
        document.getElementById('myfile');
      
    var filePath = fileInput.value;
  
    // Allowing file type
    var allowedExtensions = 
/(\.png|\.jpg|\.jpeg|\.pdf)$/i;
      
    if (!allowedExtensions.exec(filePath)) {
        $('#size').addClass('text-danger').html('Allowed only .png, .jpg, .jpeg and .pdf');
        //fileInput.value = '';
        return false;
    } else {
        Filevalidation2()
    }
};

function Filevalidation2() {
    $('.stat').fadeOut('fast')
    const fi = document.getElementById('myfile');
    const output = document.getElementById('size');
    // Check if any file is selected.
    if (fi.files.length > 0) {
        for (let i = 0; i <= fi.files.length - 1; i++) {

            const fsize = fi.files.item(i).size;
            const file = Math.round((fsize / 1024));
            // The size of the file.
            if (file >= 4096) {
                output.classList.add('text-danger')
                output.classList.remove('text-success')
                output.innerHTML = "File too Big, please select a file less than 4mb";
            //} else if (file < 2048) {
                //output.innerHTML = "File too small, please select a file greater than 2mb";
            } else {
                output.classList.remove('text-danger')
                output.classList.add('text-success')
                output.innerHTML = 'File size: '+file + ' KB';
                //uploadFile()
                $('.payment-form form').find(':submit').attr('disabled', false)
            }
        }
    }
}

$('.payment-form form').on('submit', function(e) {
    uploadFile()
    e.preventDefault()
    let formPar = $(this);
    formPar.find('input, :submit').attr('disabled', true)
    formPar.find(':submit').html('<i class="fa fa-spinner fa-spin"></i>')
    setTimeout(() => {
        $.ajax({
            method: "POST",
            url: "/api/formdata",
            enctype: "multipart/form-data",
            data: {
                fullname: $('#fullname').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                filename: newdate+'-'+$('#myfile').val().split('\\').pop(),
                date: newdate,
                time: time
            },
            success: function (response) {
                formPar.find(':submit').html('done!')
                setTimeout(() => {
                    $('.stat').fadeOut()
                    $('#size').html('')
                    formPar.find('input, textarea, :submit').val('').attr('disabled', false)
                    formPar.find(':submit').html('submit')
                }, 3000);
            },
            error: function (response) {
                formPar.find(':submit').html('failed! Please try again').attr('disabled', false)
                setTimeout(() => {
                    $('.stat').fadeOut()
                    formPar.find('input, textarea').attr('disabled', false)
                    formPar.find(':submit').html('submit')
                }, 3000);
            }
        });
    }, 500);
})


$('a[href^="#"]').on('click', function (e) {
    e.preventDefault();
 
    var targetEle = this.hash;
    var $targetEle = $(targetEle);
 
    $('html, body').stop().animate({
        'scrollTop': $targetEle.offset().top
    }, 800, 'swing', function () {
        window.location.hash = targetEle;
    });
});