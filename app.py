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

@app.route('/car_by_criteria_scatter/<price_bin>/<mileage_bin>/<int:year>')
def car_by_criteria_scatter(price_bin,mileage_bin,year):
    results = db.cars.find({"price_bin": price_bin,"mileage_bin":mileage_bin,"year":year})
    car_list = []
    new_car_list = []
    car_name = []
    total_cash_price = 0
    total_tco = 0
    for result in results:
        make = result["make"].lower()
        model = str(result["model"]).lower()
        results_comp = db[str(year)].find({"brand": make,"model":model})
        for result_comp in results_comp:
            car = {
                "car": result_comp["brand"] + " " + result_comp["model"],
                "year": year,
                "cash_price": int(result_comp["cash_price"]),
                "true_cost": int(result_comp["owning_cost"]),
                "Hicash": 0,
                "Hicost": 0,
            }
            car_list.append(car)
    for car in car_list:
        if car["car"] not in car_name:
            new_car_list.append(car)
            total_cash_price += car["cash_price"]
            total_tco += car["true_cost"]
            car_name.append(car["car"])
    avg_cash_price = total_cash_price / len(new_car_list)
    avg_tco = total_tco / len(new_car_list)

    for car in new_car_list:
        car["Hicash"] = 1 - car["cash_price"]/avg_cash_price
        car["Hicost"] = 1 - car["true_cost"]/avg_tco

    return jsonify(new_car_list)



@app.route('/car_by_criteria_tree/<price_bin>/<mileage_bin>/<int:year>')
def car_by_criteria_tree(price_bin,mileage_bin,year):
    car_list = {
        "name": "car",
        "children": []
    }
    make_list = []
    model_list = []
    results = db.cars.find({"price_bin": price_bin,"mileage_bin":mileage_bin,"year":year})
    for result in results:
        make = result["make"]
        model = result["model"]
        trim = result["trim"]
        if (make not in make_list and model not in model_list):
            make_list.append(make)
            model_list.append(model)
            trimData = {
                "name": trim,
                "price": result["price"]
            }            
            modelData = {
                "name": model,
                "children": [trimData]
            }            
            makeData = {
                "name": make,
                "children": [modelData]
            }
            car_list["children"].append(makeData)                
        elif (make in make_list and model not in model_list):
            model_list.append(model)
            trimData ={
                    "name": trim,
                    "price": result["price"]
            }
            modelData = {
                    "name": model,
                    "children": [trimData]
            }
            car_children = car_list["children"]
            for car_child in car_children:
                if car_child["name"] == make:
                    car_child["children"].append(modelData)
        elif (make in make_list and model in model_list):
            trim_list = []
            car_children = car_list["children"]
            for car_child in car_children:
                if car_child["name"] == make:
                    make_children = car_child["children"]
                    for make_child in make_children:
                        if make_child["name"] == model:
                            model_children = make_child["children"]
                            for model_child in model_children:
                                if model_child["name"] not in trim_list:
                                    trim_list.append(model_child["name"])
            if trim not in trim_list:          
                trimData ={
                        "name": trim,
                        "price": result["price"]
                }
                car_children = car_list["children"]
                for car_child in car_children:
                    if car_child["name"] == make:
                        make_children = car_child["children"]
                        for make_child in make_children:
                            if make_child["name"] == model:
                                make_child["children"].append(trimData)
            else:
                 pass
        else:
            pass
    return jsonify(car_list)

 
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


if __name__ == "__main__":
    app.run(debug=True)