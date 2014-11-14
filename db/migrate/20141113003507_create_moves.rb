class CreateMoves < ActiveRecord::Migration
  def change
  	create_table :moves do |t|
  		t.integer :move_num
  		t.string :box
  		t.integer :game_id

  		t.timestamps
  	end
  end
end
