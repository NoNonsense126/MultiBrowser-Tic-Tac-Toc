$(document).ready(function() {
	function drawBoard(){
		var canvas = document.getElementById("myCanvas")
		var context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(box_size*3, 0);
		context.stroke();
		context.lineTo(box_size*3, box_size*3);
		context.lineTo(0, box_size*3);
		context.lineTo(0, 0);
		context.moveTo(box_size, 0);
		context.lineTo(box_size, box_size*3);
		context.moveTo(box_size*2, 0);
		context.lineTo(box_size*2, box_size*3);
		context.moveTo(0, box_size);
		context.lineTo(box_size*3, box_size);
		context.moveTo(0, box_size*2);
		context.lineTo(box_size*3, box_size*2);

		context.lineWidth = 5;
		context.strokeStyle = '#000000';
		context.stroke();
	
	};

	var Box = function(initial_location){
		var canvas = document.getElementById("myCanvas")
		var context = canvas.getContext("2d");
		var state = "empty"

		function drawX(){
			context.moveTo(this.initial_location[0]+20, this.initial_location[1]+20);
			context.lineTo(this.initial_location[0] + box_size - 20, this.initial_location[1] + box_size - 20);
			context.moveTo(this.initial_location[0]+ box_size - 20, this.initial_location[1]+20);
			context.lineTo(this.initial_location[0]+20 , this.initial_location[1] + box_size - 20);
			context.lineWidth = 5;
			context.strokeStyle = '#000000';
			context.stroke();
			this.state = "X"
		};

		function drawO(){

	    var centerX = this.initial_location[0] + (box_size / 2);
	    var centerY = this.initial_location[1] + (box_size / 2);
	    var radius = 50;
			
	    context.beginPath();
	    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	    context.lineWidth = 5;
	    context.strokeStyle = '#000000';
	    context.stroke();
	    this.state = "O"
		};



		this.initial_location = initial_location
		this.drawX = drawX
		this.drawO = drawO
		this.state = state
	}

	var Game = function(id){
		var ready = false
		var boxes = []
		var boxes = [new Box([0, 0]), new Box([0, box_size]), new Box([0, box_size*2]),
								 new Box([box_size, 0]), new Box([box_size, box_size]), new Box([box_size, box_size*2]),
								 new Box([box_size*2, 0]), new Box([box_size*2, box_size]), new Box([box_size*2, box_size*2])]

		
		// function boxState(){
		// 	var states = []
		// 	for (box in boxes){
		// 		states.push([boxes[box].state]) 
		// 	}
		// 	return states
		// }

		// function sendState(){
		// 	console.log(boxState())
		// 	request = $.ajax({
		// 		type: "POST",
		// 		url: "/games/" + gameId + "/update",
		// 		data: {state: boxState()}
		// 	});
		// }


		this.ready = ready
		this.boxes = boxes
		this.id = id
	}


	function checkFull(){
		request = $.ajax({
			type: "GET",
			url: "/games/" + gameId + "/full",
			dataType: "json"
		});
		request.done(function(response){
			if (response["ready"] === "true"){
				game.ready = true
				$("#player2-name").text(response["player2"])
				starter = response["starter"]
				if (starter ==="true"){
					$("#starter").text("You Start!")
				}else{
					$("#starter").text("Opponent Starts!")
				}
			}else{
				setTimeout(function(){ checkFull(), 1000})
			};
		})
	}



	function updateBoard() {
		request = $.ajax({
			type: "GET",
			url: "/games/" + gameId + "/state",
			dataType: "json"
		});
		request.done(function(response){
			drawBoard();
				turn = response["turn"]
				var states = response["state"]
				for (box in states){
					if (states[box] === "X"){
						game.boxes[box].state = "X";
						game.boxes[box].drawX();
					}else if (states[box] === "O"){
						game.boxes[box].state = "O";
						game.boxes[box].drawO();
					}else{
						game.boxes[box].state = "empty";
					}				
				}
			if (response["won"]===true){
				$("#victory-message").text(response["name"] + " Won!")
				$('#myCanvas').css("pointer-events", "none")
			}else{
				setTimeout( function(){ updateBoard()	}, 100) 
			}
		})
	}

	function updateServer(box){
		request = $.ajax({
				type: "POST",
				url: "/games/" + gameId + "/update",
				data: {box: box},
				dataType: "json"
			});
		request.done(function(response) {
			$('#myCanvas').css("pointer-events", "auto")
			turn = false
		})
	}

	
	

	// setInterval( function(){ updateBoard() }, 1000)
	updateBoard();
	var canvas = document.getElementById("myCanvas")
	var box_size = canvas.height/3;
	drawBoard();
	game = new Game(gameId);
	checkFull();
	var turn = false
	var starter




	$('#myCanvas').on("click", function(event){
			if (turn==="true"){
				$('#myCanvas').css("pointer-events", "none")
				posX = event.pageX - $('#myCanvas').offset().left;
				posY = event.pageY - $('#myCanvas').offset().top;
				box_number = Math.floor(posX/box_size)*3 + Math.floor(posY/box_size)*1;
				if (starter==="true"){
					game.boxes[box_number].drawX();
				}else{
					game.boxes[box_number].drawO();
				}
				updateServer(box_number);
				turn = "false"
			}


	});


});
