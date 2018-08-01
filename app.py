# import necessary libraries
import numpy as np
import pandas as pd
import pymongo

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

#################################################
# Flask Routes
#################################################

@app.route("/")
def home():
    
    return render_template("criteria.html")

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
    car_by_criteria = list(db.cars.find({"price_bin": price_bin,"mileage_bin":mileage_bin,"year":year}))

    return jsonify(car_by_criteria)

 

# @app.route('/otu')
# def otu():
#     """Returns a list of OTU descriptions"""
#     results = session.query(Otu.lowest_taxonomic_unit_found).all()
#     all_results = list(np.ravel(results))
#     return jsonify(all_results)

# @app.route('/metadata/<sample>')
# def metadata(sample):
#     """MetaData for a given sample."""
#     result = session.query(Samples_metadata).filter(Samples_metadata.SAMPLEID == sample[3:]).first()
#     sample_dict = {}
#     sample_dict["AGE"] = result.AGE
#     sample_dict["BBTYPE"] = result.BBTYPE
#     sample_dict["ETHNICITY"] = result.ETHNICITY
#     sample_dict["GENDER"] = result.GENDER
#     sample_dict["LOCATION"] = result.LOCATION
#     sample_dict["SAMPLEID"] = result.SAMPLEID       
#     return jsonify(sample_dict)

# @app.route('/wfreq/<sample>')
# def wfreq(sample):
#     """Weekly Washing Frequency as a number"""
#     result = session.query(Samples_metadata.WFREQ).filter(Samples_metadata.SAMPLEID == sample[3:]).first()[0]
#     return jsonify(result)

# @app.route('/samples/<sample>')
# def samples(sample):
#     """OTU IDs and Sample Values for a given sample"""
#     df = pd.read_sql(session.query(Samples).statement, engine)
#     df = df[["otu_id",sample]]
#     df = df.sort_values(by=sample, ascending=False)

#     samples_dict = {}
#     samples_dict["otu_ids"] = df['otu_id'].tolist()
#     samples_dict["sample_values"] = df[sample].tolist()
#     return jsonify([samples_dict])



if __name__ == "__main__":
    app.run(debug=True)