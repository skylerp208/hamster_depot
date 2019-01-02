class Api::V1::HamstersController < ApplicationController
  before_action :find_hamster, only: [:update, :destroy]
    def index
      @hamsters = Hamster.all
      render json: @hamsters
    end

    def update
      @hamster.update(hamster_params)
      if @hamster.save
        render json: @hamster, status: :accepted
      else
        render json: { errors: @hamster.errors.full_messages }, status: :unprocessible_entity
      end
    end


    def destroy
      @hamster.delete
    end

    def create
      # debugger
      @hamster = Hamster.new(hamster_params)
      @hamster.save
      # debugger
      render json: @hamster

    end

    private

    def hamster_params
      params.permit(:name, :image)
    end

    def find_hamster
      @hamster = Hamster.find(params[:id])
    end
end
