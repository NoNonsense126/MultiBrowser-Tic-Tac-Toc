get '/' do
  # Look in app/views/index.erb
  redirect '/lobby' if login?
  erb :'static/home', layout: :'/layouts/home_layout'

end

get '/test' do
	erb :'test'
end

get '/lobby' do
	if login?
		@games = Game.where(ended: false)
		@user_games = Game.where("player1_id = ? or player2_id = ? and ended = ?", current_user.id, current_user.id, false)
		erb :'/tic_tac_toe/lobby'
	else
		erb :forbidden
	end
end