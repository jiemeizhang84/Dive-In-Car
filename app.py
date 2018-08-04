# import necessary libraries
import numpy as np
import pandas as pd
import pymongo
import json
from bson import json_util

from flask import (
    Flask,
    render_template,
    jsonify)
    # request,
    # redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

conn = 'mongodb://localhost:27017'

client = pymongo.MongoClient(conn)

# Connect to a database. Will create one if not already available.
db = client.car_db
# db = client.LuxSUVDB

#################################################
# Flask Routes
#################################################

@app.route("/")
def home():   
    return render_template("index.html")

@app.route("/criteria")
def criteria():  
    return render_template("criteria.html")

@app.route("/comparison")
def comparison():  
    return render_template("comparison.html")

@app.route("/sellingPrice")
def sellingPrice():  
    return render_template("sellingPrice.html")


@app.route('/price_bin')
def price_bin():
    price_bin = db.cars.distinct("price_bin")
    return jsonify(price_bin)

@app.route('/mileage_bin')
def mileage_bin():
    mileage_bin = db.cars.distinct("mileage_bin")
    return jsonify(mileage_bin)

@app.route('/years')
def years():
    years = db.cars.distinct("year")
    return jsonify(years)

@app.route('/car_by_criteria/<price_bin>/<mileage_bin>/<int:year>')
def car_by_criteria(price_bin,mileage_bin,year):
    car_list = []
    results = db.cars.find({"price_bin": price_bin,"mileage_bin":mileage_bin,"year":year})
    for result in results:
        car_result = json.loads(json_util.dumps(result))
        car_list.append(car_result)

    return jsonify(car_list)

@app.route('/car_by_criteria_tree/<price_bin>/<mileage_bin>/<int:year>')
def car_by_criteria_tree(price_bin,mileage_bin,year):
    car_list = {
        "name": "car",
        "children": []
    }
    results = db.cars.find({"price_bin": price_bin,"mileage_bin":mileage_bin,"year":year})
    for result in results:
        trim = [
            {
                "name": result["trim"],
                "price": result["price"]
            }
        ]
        model = [
            {
                "name": result["model"],
                "children": trim
            }
        ]
        make = {
                "name": result["make"],
                "children": model
               }
        car_list["children"].append(make)


    return jsonify(car_list)

# @app.route('/car_by_comparison/<make>/<model>/<int:year>')
# def car_by_comparison(make,model,year):
#     car_list = []
#     results = db.cars.find({"make": make,"model":model,"year":year})
#     for result in results:
#         car_result = json.loads(json_util.dumps(result))
#         car_list.append(car_result)

#     return jsonify(car_list)

 
@app.route('/make')
def make():
    make = db.cars.distinct("make")
    return jsonify(make)

@app.route('/<make>/model')
def model(make):
    model = db.cars.find({"make": make}).distinct("model")
    return jsonify(model)


@app.route('/makeComparison')
def makeComparison():
    make = db["2017"].distinct("brand")
    return jsonify(make)   

@app.route('/<make>/modelComparison')
def modelComparison(make):
    model = db["2017"].find({"brand": make}).distinct("model")
    return jsonify(model)

@app.route('/yearComparison')
def yearComparison():
    year = ["2015","2016","2017"]
    return jsonify(year)

@app.route('/car_by_comparison/<make>/<model>/<year>')
def car_by_comparison(make,model,year):
    car_list = []
    results = db[year].find({"brand": make,"model":model,"year":year})
    
    for result in results:
        car_result = json.loads(json_util.dumps(result))
        car_list.append(car_result)

    return jsonify(car_list)

# @app.route('/car_by_comparison')
# def car_by_comparison():
#     car_list = []
#     results = db["2014"].find({"brand": "audi","model":"q5","year":"2014"})
    
#     for result in results:
#         car_result = json.loads(json_util.dumps(result))
#         car_list.append(car_result)

#     return jsonify(car_list)


if __name__ == "__main__":
    app.run(debug=True)