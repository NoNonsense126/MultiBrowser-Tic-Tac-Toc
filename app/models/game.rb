class Game < ActiveRecord::Base
	has_many :moves
  
  def users
  	[User.find(player1_id), User.find(player2_id)]
  end

  def player_1
  	User.find(self.player1_id)
  end

  def player_2
  	User.find_by(id: self.player2_id)
  end

  def second_player_id
  	starter = self.starting_player_id
  	players = [self.player1_id, self.player2_id]
  	players.delete(starter)
  	return players[0]
  end

  def turn(user_id)
		move = self.moves.where(box: ["X", "O"])
		if user_id == starting_player_id && move.count.even? 
			"true"
		elsif user_id == second_player_id && move.count.odd?
			"true"
		else
			"false"
		end
  end

  def check_won(box)
  	#check row
    box = box.to_i
  	row_first = (box%3)
  	row = [row_first, row_first+3, row_first+6]
  	col_first = (box/3)*3
  	col = [col_first, col_first+1, col_first+2]
  	diag = [0,4,8]
  	diag2 = [2,4,6]
  	lines = [row, col, diag, diag2]
    p lines
  	lines.each do |line|
  		return true if check_line(line)
  	end
  	return false
  end

  def check_line(array)
  	boxes = self.moves.where(move_num: array)
    boxes = boxes.map{ |move| move.box }
  	return false if boxes.include?"empty"
  	boxes.uniq.size == 1
  end
end
