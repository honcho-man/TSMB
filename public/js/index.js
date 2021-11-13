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
$(function() {
    // This code will attach `fileselect` event to all file inputs on the page
    $(document).on('change', ':file', function() {
      var input = $(this),
          numFiles = input.get(0).files ? input.get(0).files.length : 1,
          label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
      input.trigger('fileselect', [numFiles, label]);
    });
  
    
    $(document).ready( function() {
  //below code executes on file input change and append name in text control
        $(':file').on('fileselect', function(event, numFiles, label) {
  
            var input = $(this).parents('.input-group').find(':text'),
                log = numFiles > 1 ? numFiles + ' files selected' : label;
  
            if( input.length ) {
                input.val(log);
            } else {
                if( log ) alert(log);
            }
  
        });
    });
});
//require all input
$('input,textarea').attr('required', true)
//show all bundle list on click !experimental :)
function hasParentClass(child) {
    let parent = child.parentNode.children[2];
    parent.classList.toggle('toggle');
    child.children[0].classList.toggle('d-none')
    child.children[1].classList.toggle('d-block')
}