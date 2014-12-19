get '/games/new' do
	game = Game.create(player1_id: current_user.id)
	redirect "games/#{ game.id }"
end

get '/games/:id' do
	@params = params
	@game = current_game
	erb :game
end

get '/games/:id/full' do
	game = current_game
	if game.player_2.nil?
		{ ready: "false" }.to_json
	elsif game.starting_player_id.nil?
		game.update(starting_player_id: [game.player1_id, game.player2_id].sample)
		starter = (current_user.id == game.starting_player_id)
		{ready: "true", starter: "#{starter}", player2: "#{game.player_2.username}"}.to_json
	else
		starter = (current_user.id == game.starting_player_id)
		{ready: "true", starter: "#{starter}", player2: "#{game.player_2.username}"}.to_json
	end

end

get '/games/:id/join' do
	game = current_game
	if current_game.player2_id.nil? && current_user.id != current_game.player_1.id
		game.update(player2_id: current_user.id)
		game.save
	end
	redirect "/games/#{params[:id]}"
end

get '/games/:id/state' do
	game = current_game
	values = {}
	@moves = game.moves
	states = {}	
	@moves.each do |move|
		states[move.move_num] = move.box
	end
	values["turn"] = game.turn(current_user.id)
	values["won"] = !game.winner_id.nil?
	values["name"] = User.find(game.winner_id).username if !game.winner_id.nil?
	values["state"] = states
	values.to_json
end

post '/games/:id/update' do
	game = current_game
	if !game.moves.exists?
		9.times do |num|
			Move.create(move_num: num, box: "empty", game_id: game.id)
		end
	end
	if game.moves.find_by(move_num: [params["box"]]).box == "empty"
		if current_user.id == game.starting_player_id 
			move = game.moves.find_by(move_num: params["box"])
			move.update(box: "X")
			move.save
		elsif current_user.id == game.second_player_id 
			move = game.moves.find_by(move_num: params["box"])
			move.update(box: "O")
			move.save
		else
		end
		if game.check_won(params["box"])
			game.update(winner_id: current_user.id)
			game.save
		end
		{}.to_json
	end
end
