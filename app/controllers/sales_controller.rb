class SalesController < ApplicationController
  
  DAYS = %w{Monday Tuesday Wednesday Thursday Friday Saturday Sunday}
  
  respond_to :json
  
  def index    
    data = Sale.order('day_of_the_week, products.name, origins.name').all(:include => [:product, :origin])    
    @sales = data.map do |sale|
      [
        sale.product.name,
        sale.origin.name,
        sale.day_of_the_week,
        DAYS[sale.day_of_the_week - 1],
        sale.amount
      ]
    end
    respond_with({:aaData => @sales})    
  end
end
