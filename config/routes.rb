Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :hamsters, only: [:index, :update, :create, :destroy]
    end
  end
end
