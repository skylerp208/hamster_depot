class HamsterSerializer < ActiveModel::Serializer
  has_many :comments
  attributes :name, :image, :id,  :comments

end
