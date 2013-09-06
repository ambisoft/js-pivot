class CreateSales < ActiveRecord::Migration
  def change
    create_table :sales do |t|      
      t.references  :product, :null => false
      t.references  :origin, :null => false
      t.integer     :day_of_the_week, :null => false
      t.decimal     :amount, :scale => 2, :precision => 10, :null => false
      t.timestamps      
    end
    
    add_index :sales, [:product_id, :origin_id, :day_of_the_week], :unique => true
    
  end  
end
