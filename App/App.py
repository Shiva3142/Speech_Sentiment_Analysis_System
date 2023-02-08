from flask import Flask,render_template,request,jsonify
from Processor.AudioProcessor import *
import os

inputProcessor=InputProcessor()
modelProcessor=ModelProcessor()
modelProcessor.setModel("../Model/DefinedModel.h5")

App=Flask(__name__)

file_name=""

@App.route("/")
def prediction():
    return render_template("index.html")


@App.route('/upload_file',methods=['POST','GET'])
def upload():
    global file_name
    if request.method=='POST':
        print(request.files['file'])
        file=request.files['file']
        file_name=file.filename
        extension=file_name.split(".")[-1]
        print(extension)
        file_name=f"input_audio.{extension}"
        print(file_name)
        file_path=f"/static/Files/{file_name}"
        file.filename=file_name
        print(file)
        file.save(os.path.dirname(__file__)+f"\\static\\Files\\{file_name}")
        return jsonify({'audio_path':file_path})
    else:
        return "error"


@App.route('/get_audio_prediction',methods=['POST','GET'])
def getAudioPrediction():
    global file_name
    if request.method=='POST':
        print("Post Method")
        if file_name!="":
            print("File Found")
            mfcc_values_array=inputProcessor.preprocessTheInput(f"./static/Files/{file_name}")
            print(mfcc_values_array)
            prediction=modelProcessor.predictCumulativeClass(mfcc_values_array)
            print(prediction)
            return jsonify({'error':False,"emotion":prediction})
        else:
            return "ERROR"
    else:
        return "ERROR"
