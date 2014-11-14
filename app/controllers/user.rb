post '/login' do
	user = User.authenticate(params[:username], params[:password])
	if user
		session[:user] = params[:username]
		{}.to_json
	else
		@error = "Login error, please try again"
		{error: @error}.to_json
	end
end

get '/logout' do
	session[:user] = nil
	redirect '/'
end

post '/signup' do
	user = User.create(username: params[:username], password: params[:password])
  if user.errors.empty?
 		session[:user] = params[:username]
 		{}.to_json
  else
  	@error = user.errors.first[0].to_s + " " + user.errors.first[1]
		{error: @error}.to_json
  end
end
