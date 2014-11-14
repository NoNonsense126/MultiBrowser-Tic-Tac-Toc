class User < ActiveRecord::Base
  validates :username, uniqueness: {case_sensitive: false}, length: { minimum: 5 }
  validates :password, length: { minimum: 5 }
  has_many :moves


  def self.authenticate(username, password)
    account = self.where(username: username)
    if account.count != 0 && account[0].password == password
      return account[0]
    end
    nil
  end

  def to_s
  	self.username
  end
end
