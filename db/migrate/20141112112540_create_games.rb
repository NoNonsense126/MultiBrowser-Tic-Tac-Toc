class CreateGames < ActiveRecord::Migration
  def change
  	create_table :games do |t|
  		t.integer :player1_id
  		t.integer :player2_id
  		t.integer :starting_player_id
  		t.integer :winner_id
  		t.boolean :ended, null: false, default: false
  	end
  end
end
