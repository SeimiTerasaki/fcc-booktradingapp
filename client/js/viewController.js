$(function () {

  
  var socket = io.connect();
  
  $('#formBtn').on('click', function(){
     var title = $('#formInput').val();
     var user = $("#formInput").attr("name");
     var array = [];
     array.push(title, user);
     socket.emit('check', array, function(data){
       if(data==="error") $('#formInput').val("Title not found");
       else{
         $('#my-books').prepend('<div class="col-sm-6 col-md-3" id="book-wrapper">'+'<div class="thumbnail">'+'<img src="'+data[1]+'" id="cover" alt="'+data[0]+'"></div>'+'<div class="caption"><p class="intro">'+data[0]+'</p></div></div>');
         $('#formInput').val(" "); 
       }
       });
  });
  
   $('.pass').on('focusin', function(){
    $(this).parent('div').find('#update-span').show();
   });
   
   $('.pass').on('focusout', function(){
     if($(this).parent('div').find('input').val() === ""){
       $(this).parent('div').find('#update-span').hide();
     } else {
      var value = $(this).parent('div').find('input').val();
      var field = $(this).parent('div').find('input').attr('name');
      var username = $('#account-username').attr('placeholder');
      var array = [];
      array.push(username, field,value);
      socket.emit('update', array);
      $(this).parent('div').find('#update-span').hide();
     }
   });
   
   $('.requestbook-btn').on('click', function(){
    var title = $(this).parent('div').find('.book-title').text();
     var id = $(this).parent('div').find('img').attr('alt');
     var userid = $(this).attr('value');
     var array = [];
     array.push(title, id, userid);
     socket.emit('request', array);
      $(this).text('Request Sent');
       var string = $('#request').text();
       var num = parseFloat(string);
        var newString =num+1;
        $('#request').tetx(newString);
   });
   
   $('#cancel').on('click', function(){
     var title = $(this).parent('li').find('span').text();
     var id= $(this).parent('li').attr('value');
     var userid = $(this).attr('value');
     var array = [];
     array.push(title, id, userid);
      socket.emit('cancel', array);
       $(this).parent('li').remove();
       var string = $('#request').text();
       var num = parseFloat(string);
        var newString =num-1;
        $('#request').tetx(newString);
     });
     
     $('.no, .yes').on('click', function(){
     var title = $(this).parent('li').find('span').text();
     var id= $(this).parent('li').attr('value');
     var userid = $(this).attr('value');
     var array = [];
     array.push(title, id, userid);
      socket.emit('cancel', array);
       $(this).parent('li').remove();
       var string = $('#pending').text();
       var num = parseFloat(string);
        var newString =num-1;
        $('#pending').text(newString);
     });
     
     $('.removebook-btn').on('click', function(){
     var title = $(this).parent('div').find('.book-title').text();
     var id = $(this).parent('div').find('img').attr('alt');
     var array = [];
     array.push(title, id);
     socket.emit('trash', array);
      $(this).text('Removed');
     });
  
 })();