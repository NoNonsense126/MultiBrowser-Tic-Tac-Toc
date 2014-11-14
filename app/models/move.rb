class Move < ActiveRecord::Base
	belongs_to :user
	belongs_to :game
  # Remember to create a migration!
end
