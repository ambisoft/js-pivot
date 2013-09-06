# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#

apple       = Product.find_or_create_by_name(:name => 'Apple')
bananna     = Product.find_or_create_by_name(:name => 'Banana')
grape       = Product.find_or_create_by_name(:name => 'Grape')
orange      = Product.find_or_create_by_name(:name => 'Orange')
peach       = Product.find_or_create_by_name(:name => 'Peach')
watermelon  = Product.find_or_create_by_name(:name => 'Watermelon')

imported  = Origin.find_or_create_by_name(:name => 'Imported')
local     = Origin.find_or_create_by_name(:name => 'Local')

data = [
  [ apple, imported, 1, 125.63],
  [ apple, local, 1, 50.63],
  [ bananna, imported, 1, 272.38],
  [ bananna, local, 1, 172.38],
  [ grape, local, 1, 372.04],
  [ orange, local, 1, 319.58],
  [ peach, local, 1, 118.99],
  [ watermelon, imported, 1, 498.20],  
  
  [ apple, imported, 2, 759.26],
  [ bananna, imported, 2, 532.94],
  [ grape, local, 2, 355.01],
  [ orange, local, 2, 256.89],
  [ peach, local, 2, 939.26],
  [ watermelon, imported, 2, 410.32],
  
  [ apple, imported, 3, 659.26],
  [ bananna, imported, 3, 432.94],
  [ grape, local, 3, 255.01],
  [ orange, local, 3, 156.89],
  [ peach, local, 3, 839.26],
  [ watermelon, imported, 3, 310.32],
  
  [ apple, imported, 4, 709.26],
  [ bananna, imported, 4, 482.94],
  [ grape, local, 4, 305.01],
  [ orange, local, 4, 206.89],
  [ peach, local, 4, 889.26],
  [ watermelon, imported, 4, 360.32],
  
  [ apple, imported, 5, 809.26],
  [ bananna, imported, 5, 582.94],
  [ grape, local, 5, 405.01],
  [ orange, local, 5, 306.89],
  [ peach, local, 5, 989.26],
  [ watermelon, imported, 5, 460.32]
]

data.each do |sale|
  
  product = sale[0]
  origin  = sale[1]
  dow     = sale[2]
  amount  = sale[3]  
  
  exists = Sale.find_by_product_id_and_origin_id_and_day_of_the_week(product, origin, dow)
  unless exists
    Sale.create(:product => product, :origin => origin, :day_of_the_week => dow, :amount => amount)
  end
  
end
