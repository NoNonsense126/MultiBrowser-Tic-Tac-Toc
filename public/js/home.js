$(document).ready(function() {

	$('#login_form').on('submit', function(event){
		event.preventDefault();
		$.ajax({
			type: "POST",
			url: $(this).attr('action'),
			data: $(this).serialize(),
			dataType: "json",
			success: function(data){
				if(data.hasOwnProperty("error")){
					$("#login-status-message").text(data['error']);
					$("#login-status").attr("style", "visiblity:visible");
				} else {
					console.log("here");
					window.location ="/lobby";
				}
			}
		})
	});

	$('#signup_form').on('submit', function(event){
		event.preventDefault();
		$.ajax({
			type: "POST",
			url: $(this).attr('action'),
			data: $(this).serialize(),
			dataType: "json",
			success: function(data){
				console.log("1111")
				if(data.hasOwnProperty("error")){
					$("#login-status-message").text(data['error'])
					$("#login-status").attr("style", "visiblity:visible")
				} else {
					console.log("here");
					window.location = "/lobby";
				}
			}
		})
	});

});