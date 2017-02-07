require "sinatra/activerecord_helpers"
require "sinatra/json_helpers"
require_relative "../services/account_service"

class ProblemRoutes < Sinatra::Base
  helpers Sinatra::ActiveRecordHelpers
  helpers Sinatra::JSONHelpers
  helpers Sinatra::AccountServiceHelpers

  before "/api/problems*" do
    I18n.locale = :en if request.xhr?
  end

  get "/api/problems" do
    @problems = Problem.readables(user: current_user)
    json @problems
  end

  before "/api/problems/:id" do
    @problem = Problem.find_by(id: params[:id])
    halt 404 if not @problem&.allowed?(by: current_user, method: request.request_method)
  end

  get "/api/problems/:id" do
    json @problem
  end

  post "/api/problems" do
    halt 403 if not Problem.allowed_to_create_by?(current_user)

    @attrs = attribute_values_of_class(Problem)
    @attrs[:creator_id] = current_user.id
    @problem = Problem.new(@attrs)

    if @problem.save
      status 201
      headers "Location" => to("/api/problems/#{@problem.id}")
      json @problem
    else
      status 400
      json @problem.errors
    end
  end

  update_problem_block = Proc.new do
    if request.put? and not satisfied_required_fields?(Problem)
      halt 400, { required: insufficient_fields(Problem) }.to_json
    end

    @attrs = attribute_values_of_class(Problem)
    @problem.attributes = @attrs

    halt 400, json(@problem.errors) if not @problem.valid?

    if @problem.save
      json @problem
    else
      status 400
      json @problem.errors
    end
  end

  put "/api/problems/:id", &update_problem_block
  patch "/api/problems/:id", &update_problem_block

  delete "/api/problems/:id" do
    if @problem.destroy
      status 204
      json status: "success"
    else
      status 500
      json status: "failed"
    end
  end
end
