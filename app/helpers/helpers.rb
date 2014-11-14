def login?
	!session[:user].nil?
end

def current_user
	User.find_by(username: session[:user])
end

def current_game
	Game.find(params[:id])
end