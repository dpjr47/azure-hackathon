import numpy as np
from flask import *
# from flask import Flask, request, jsonify, render_template,session,redirect,url_for
import pickle
import os
from werkzeug.utils import secure_filename
import pymongo
from datetime import date
# from flask import Response


app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/index', methods=['GET', 'POST'])
def index():
    return render_template('contribution/Contribution_index.html')

@app.route('/record', methods=['GET', 'POST'])
def record():
    return render_template('contribution/Contribution_record.html')

@app.route('/survey', methods=['GET', 'POST'])
def survey():
    print("hello")
    return render_template('contribution/Contribution_survey.html')

@app.route('/processing', methods=['GET', 'POST'])
def processing():
    if request.method == 'POST':
        req = request.form
        breathing = req.get("audio_file_breathe_shallow")
        print(breathing)
        print(type(breathing))
        
    return render_template('contribution/contribution_feedback.html')

# @app.route('/convert-speech', methods=['POST'])
# def convert_speech():
#     if request.method == 'POST':
#         print(request.form.get('audio_data'))
#     return jsonify({"result":"Success"})

# @app.route('/api/v01/post/audio-blob/', methods=['POST'])
# def api_post_audio_blob():
#     blob = request.data
#     with open('file.wav', 'ab') as f:
#         f.write(blob)
#     return Response(status=200)

if __name__ == '__main__':
    app.run(debug=True)