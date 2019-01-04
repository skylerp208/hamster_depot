class Api::V1::CommentsController < ApplicationController


  def create
    @comment = Comment.new(comment_params)
    @comment.save
    render json: @comment
  end




  private

  def comment_params
    params.permit(:content, :hamster_id)
  end




end
