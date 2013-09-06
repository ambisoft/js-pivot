class Sale < ActiveRecord::Base
  
  attr_accessible :product, :origin, :day_of_the_week, :amount
  
  belongs_to :product
  belongs_to :origin  
  
end
