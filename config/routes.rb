Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :hamsters, only: [:index,:show, :update, :create, :destroy]
      resources :comments, only: [:create]
    end
  end
end
