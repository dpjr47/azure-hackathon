import numpy as np
from flask import *
from flask import Flask, request, jsonify, render_template,session,redirect,url_for
import pickle
import os
from werkzeug.utils import secure_filename
import pymongo
from datetime import datetime
import pandas as pd
import librosa

from tensorflow.keras.models import Model,Sequential,load_model





client = pymongo.MongoClient("mongodb+srv://nandhu12:nandhu@cluster0.dfmct.mongodb.net/covid_19?retryWrites=true&w=majority")
db = client['covid_19']


app = Flask(__name__)
app.secret_key="hello123"

# date="2020-12-19 09:26:03.478039"
# past = {"_id":date,"name":"sabah","state":"kerala"}
# # current=db['current']
# complete=db['complete']
# # current.insert_one(past)
# complete.insert_one(past)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method =="POST":
        credentials=request.form.to_dict()
        user_name=credentials["user_name"]
        user_password=credentials["user_password"]
        user_email=credentials["user_email"]
        login=db['login']
        #check_for_duplicate
        existing_user = login.find_one(({"_id":credentials['user_email']}))
        if existing_user is not  None:
            return render_template('index.html',exist=1)
        #data_entry
        past = {"_id":user_email,"name":user_name,"password":user_password,"phone_number":0,"country":0,"state":0,"district":0,"age":0,"sex":0,"test_number":0,"image_url":0}
        login.insert_one(past)
        session['user_email']=user_email
        session['user_name']=user_name

        return render_template("metadata.html",name=user_name,email=user_email)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        credentials = request.form.to_dict()
        #checking
        login=db['login']
        existing_user = login.find_one(({"_id": credentials["user_email"]}))
        #
        if existing_user is None:
            return render_template("index.html")
        
        if credentials['user_password'] == existing_user['password']:
            session['user_email']=existing_user["_id"]
            session['user_name']=existing_user["name"]
            check=db['info']
            check_user = check.find(({"user_email":session['user_email']}))
            if check_user is None:
                check_user=0
            
            img=existing_user['image_url']
            print(img)
            
            return render_template('main.html',user_name=session['user_name'],user_email=session['user_email'],img=img,data=check_user)
        else:
            return render_template('index.html',invalid=1)

@app.route('/metanext', methods=['GET', 'POST'])
def metanext():
    req = request.form
    user_name = req.get("user_name")
    user_age=req.get("user_age")
    user_email=req.get("user_email")
    user_phone=req.get("user_phone")
    user_sex=req.get("user_sex")
    user_country=req.get("user_country")
    user_state=req.get("user_state")
    user_district=req.get("user_district")
    #database
    login=db['login']
    #
    myquery = { "_id": user_email }
    newvalues = { "$set": {"age":user_age,"sex":user_sex,"phone_number":user_phone,"country":user_country,"state":user_sex,"district":user_district } }
    login.update_one(myquery, newvalues)
    #
    print("no_Scene")
    return render_template('photo.html')

@app.route('/meta_photo', methods=['GET', 'POST'])
def meta_photo():
    image = request.files['input_image']
    file_path="static/images/"+str(session['user_email']) +".jpg"
    image.save(file_path)
    print(file_path)
    ##
    login=db['login']
    #
    myquery = { "_id": session['user_email'] }
    newvalues = { "$set": {"image_url":file_path } }
    login.update_one(myquery, newvalues)
    check_user=0
    return render_template('main.html',user_name=session['user_name'],user_email=session['user_email'],img=file_path,data=check_user)

@app.route('/covid_test', methods=['GET', 'POST'])
def covid_test():
    return render_template('test-index.html')

@app.route('/covid_test_index', methods=['GET', 'POST'])
def covid_test_index():
    return render_template('test-survey.html')

@app.route('/covid_test_survey', methods=['GET', 'POST'])
def covid_test_survey():
    if request.method =="POST":
        req = request.form
        user_name = req.get("user_name")
        # user_age=req.get("user_age")
        # user_sex=req.get("user_sex")
        # user_country=req.get("user_country")
        # user_state=req.get("user_state")
        # user_district=req.get('user_district')
        asthma=req.get('asthma')
        Cystic_fibrosis=req.get('Cystic_fibrosis')
        COPD_Emphysema=req.get('COPD/Emphysema')
        Pulmonary_fibrosis=req.get('Pulmonary_fibrosis')
        Pnuemonia=req.get('Pnuemonia')
        other_lung_disease=req.get('other_lung_disease')
        high_blood_pressure=req.get('high_blood_pressure')
        Angina=req.get('Angina')
        ischaemic_attack=req.get('Previous_stroke/ischaemic_attack')
        heart_attack=req.get('previous_heart_attack')
        valvular_heart_disease=req.get('valvular_heart_disease')
        other_heart_disease=req.get('other_heart_disease')
        cancer=req.get('Cancer')
        Diabetes=req.get('Diabetes')
        previous_organ_transplant=req.get('previous_organ_transplant')
        hiv_impaired_immune=req.get('hiv/impaired_immune')
        hiv_impaired_immune=req.get('othr_long_term_condition')
        user_smoking=req.get('user_smoking')
        user_vaccine_status=req.get('user_vaccine_status')
        user_cold=req.get('user_cold')
        user_cough=req.get('user_cough')
        user_fever=req.get('user_fever')
        user_diarrhoea=req.get('user_diarrhoea')
        sore_throat=req.get('sore_throat')
        difficulty_breathing=req.get('difficulty_breathing')
        dizziness_confusion=req.get('dizziness/confusion')
        headache=req.get('headache')
        running_blocked_nose=req.get('running/blocked_nose')
        loss_taste=req.get('loss_taste')
        muscle_pain=req.get('muscle_pain')
        fatique=req.get('fatique')
        #
        login=db['login']
        existing_user = login.find_one(({"_id": session["user_email"]}))
        number=existing_user['test_number']+1
        #
        myquery = { "_id": session['user_email'] }
        newvalues = { "$set": { "test_number": number } }

        login.update_one(myquery, newvalues)
        #
        now = datetime.now()
        # dd/mm/YY
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")

        check=db['info']
        past = {"_id":dt_string,"user_email":session['user_email'],"name":user_name,"asthma":asthma,"Cystic_fibrosis":Cystic_fibrosis,"COPD_Emphysema":COPD_Emphysema,
        "Pulmonary_fibrosis":Pulmonary_fibrosis,"Pnuemonia":Pnuemonia,"other_lung_disease":other_lung_disease,"high_blood_pressure":high_blood_pressure,
        "Angina":Angina,"ischaemic_attack":ischaemic_attack,"heart_attack":heart_attack,"valvular_heart_disease":valvular_heart_disease,
        "other_heart_disease":other_heart_disease,"cancer":cancer,"Diabetes":Diabetes,"previous_organ_transplant":previous_organ_transplant,
        "hiv_impaired_immune":hiv_impaired_immune,"smoking":user_smoking,"user_cold":user_cold,"user_cough":user_cough,"user_fever":user_fever,
        "user_diarrhoea":user_diarrhoea,"sore_throat":sore_throat,"difficulty_breathing":difficulty_breathing,"dizziness_confusion":dizziness_confusion,
        "headache":headache,"running_blocked_nose":running_blocked_nose,"loss_taste":loss_taste,"muscle_pain":muscle_pain,
        "fatique":fatique,"result":0,"number":number}
        
        check.insert_one(past)
        session['time']=dt_string

        return render_template('test-record.html')



@app.route('/contribution', methods=['GET', 'POST'])
def contribution():
     return render_template('contribution/Contribution_survey.html')

@app.route('/record', methods=['GET', 'POST'])
def record():
    if request.method =="POST":
        req = request.form
        user_name = req.get("user_name")
        user_age=req.get("user_age")
        user_sex=req.get("user_sex")
        user_country=req.get("user_country")
        user_state=req.get("user_state")
        user_district=req.get('user_district')
        asthma=req.get('asthma')
        Cystic_fibrosis=req.get('Cystic_fibrosis')
        COPD_Emphysema=req.get('COPD/Emphysema')
        Pulmonary_fibrosis=req.get('Pulmonary_fibrosis')
        Pnuemonia=req.get('Pnuemonia')
        other_lung_disease=req.get('other_lung_disease')
        high_blood_pressure=req.get('high_blood_pressure')
        Angina=req.get('Angina')
        ischaemic_attack=req.get('Previous_stroke/ischaemic_attack')
        heart_attack=req.get('previous_heart_attack')
        valvular_heart_disease=req.get('valvular_heart_disease')
        other_heart_disease=req.get('other_heart_disease')
        cancer=req.get('Cancer')
        Diabetes=req.get('Diabetes')
        previous_organ_transplant=req.get('previous_organ_transplant')
        hiv_impaired_immune=req.get('hiv/impaired_immune')
        othr_user_long_term_condition=req.get('othr_long_term_condition')
        user_smoking=req.get('user_smoking')
        user_vaccine_status=req.get('user_vaccine_status')
        user_cold=req.get('user_cold')
        user_cough=req.get('user_cough')
        user_fever=req.get('user_fever')
        user_diarrhoea=req.get('user_diarrhoea')
        sore_throat=req.get('sore_throat')
        difficulty_breathing=req.get('difficulty_breathing')
        dizziness_confusion=req.get('dizziness/confusion')
        headache=req.get('headache')
        running_blocked_nose=req.get('running/blocked_nose')
        loss_taste=req.get('loss_taste')
        muscle_pain=req.get('muscle_pain')
        fatique=req.get('fatique')


    return render_template('contribution/contribution_record.html')

@app.route('/process', methods=['GET', 'POST'])
def process():

    return render_template('contribution/contribution_feedback.html')






@app.route("/breath_shallow", methods=['POST', 'GET'])
def breath_shallow():
    if request.method == "POST":
        k = request.files['audio_data']
        interm='audios/'+session['user_email']+'_breathe_shallow.wav'
        with open(interm, 'wb') as audio:
            k.save(audio)
        print('file uploaded successfully')

        return render_template('test-record.html')   
    # else:
    #     return render_template("contribution/Contribution_survey.html")

@app.route("/breath_deep", methods=['POST', 'GET'])
def breath_deep():
    if request.method == "POST":
        k = request.files['audio_data']
        interm='audios/'+session['user_email']+'_breathe_deep.wav'
        with open(interm, 'wb') as audio:
            k.save(audio)
        print('file uploaded successfully')
        return render_template('test-record.html')

    #     return render_template('contribution/Contribution_survey.html', request="POST")   
    # else:
    #     return render_template("contribution/Contribution_survey.html")

@app.route("/cough_shallow", methods=['POST', 'GET'])
def cough_shallow():
    if request.method == "POST":
        k = request.files['audio_data']
        interm='audios/'+session['user_email']+'_cough_shallow.wav'
        with open(interm, 'wb') as audio:
            k.save(audio)
        print('file uploaded successfully')
        return render_template('test-record.html')

    #     return render_template('contribution/Contribution_survey.html', request="POST")   
    # else:
    #     return render_template("contribution/Contribution_survey.html")
    
@app.route("/cough_heavy", methods=['POST', 'GET'])
def cough_heavy():
    if request.method == "POST":
        k = request.files['audio_data']
        interm='audios/'+session['user_email']+'_cough_heavy.wav'
        with open(interm, 'wb') as audio:
            k.save(audio)
        print('file uploaded successfully')
        return render_template('test-record.html')

    #     return render_template('contribution/Contribution_survey.html', request="POST")   
    # else:
    #     return render_template("contribution/Contribution_survey.html")
    
@app.route("/vowel_a", methods=['POST', 'GET'])
def vowel_a():
    if request.method == "POST":
        k = request.files['audio_data']
        interm='audios/'+session['user_email']+'_vowel_a.wav'
        with open(interm, 'wb') as audio:
            k.save(audio)
        print('file uploaded successfully')
        return render_template('test-record.html')

    #     return render_template('contribution/Contribution_survey.html', request="POST")   
    # else:
    #     return render_template("contribution/Contribution_survey.html")

@app.route("/vowel_e", methods=['POST', 'GET'])
def vowel_e():
    if request.method == "POST":
        k = request.files['audio_data']
        interm='audios/'+session['user_email']+'_vowel_e.wav'
        with open(interm, 'wb') as audio:
            k.save(audio)
        print('file uploaded successfully')
        return render_template('test-record.html')

    #     return render_template('contribution/Contribution_survey.html', request="POST")   
    # else:
    #     return render_template("contribution/Contribution_survey.html")
    
@app.route("/vowel_o", methods=['POST', 'GET'])
def vowel_o():
    if request.method == "POST":
        k = request.files['audio_data']
        interm='audios/'+session['user_email']+'_vowel_o.wav'
        with open(interm, 'wb') as audio:
            k.save(audio)
        print('file uploaded successfully')
        return render_template('test-record.html')

    #     return render_template('contribution/Contribution_survey.html', request="POST")   
    # else:
    #     return render_template("contribution/Contribution_survey.html")

@app.route("/counting_normal", methods=['POST', 'GET'])
def counting_normal():
    if request.method == "POST":
        k = request.files['audio_data']
        interm='audios/'+session['user_email']+'_counting_normal.wav'
        with open(interm, 'wb') as audio:
            k.save(audio)
        print('file uploaded successfully')
        return render_template('test-record.html')

    #     return render_template('contribution/Contribution_survey.html', request="POST")   
    # else:
    #     return render_template("contribution/Contribution_survey.html")

@app.route("/counting_fast", methods=['POST', 'GET'])
def counting_fast():
    if request.method == "POST":
        k = request.files['audio_data']
        interm='audios/'+session['user_email']+'_counting_fast.wav'
        with open(interm, 'wb') as audio:
            k.save(audio)
        print('file uploaded successfully')
        return render_template('test-record.html')

    #     return render_template('contribution/Contribution_survey.html', request="POST")   
    # else:
    #     return render_template("contribution/Contribution_survey.html")

@app.route('/processing', methods=['GET', 'POST'])
def processing():
    audio_file_breath_shallow=str("audios/"+session['user_email']+"_breathe_shallow.wav")
    audio_file_breath_deep=str("audios/"+session['user_email']+"_breathe_deep.wav")
    audio_file_cough_shallow=str("audios/"+session['user_email']+"_cough_shallow.wav")
    audio_file_cough_heavy=str("audios/"+session['user_email']+"_cough_heavy.wav")
    audio_file_vowel_a=str("audios/"+session['user_email']+"_vowel_a.wav")
    audio_file_vowel_e=str("audios/"+session['user_email']+"_vowel_e.wav")
    audio_file_vowel_o=str("audios/"+session['user_email']+"_vowel_o.wav")
    audio_file_counting_normal=str("audios/"+session['user_email']+"_counting_normal.wav")
    audio_file_counting_fast=str("audios/"+session['user_email']+"_counting_fast.wav")
    #feature_extraction
    def features_extractor(file):
        audio, sample_rate = librosa.load(file, res_type='kaiser_fast') 
        mfccs_features = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
        mfccs_scaled_features = np.mean(mfccs_features.T,axis=0)
        return mfccs_scaled_features
    ##features
    extracted_features=[]
    breathing_deep=features_extractor(audio_file_breath_shallow)
    breathing_shallow=features_extractor(audio_file_breath_deep)
    cough_heavy=features_extractor(audio_file_cough_shallow)
    cough_shallow=features_extractor(audio_file_cough_heavy)
    counting_fast=features_extractor(audio_file_vowel_a)
    counting_normal=features_extractor(audio_file_vowel_e)
    vowel_a=features_extractor(audio_file_vowel_o)
    vowel_e=features_extractor(audio_file_counting_normal)
    vowel_o=features_extractor(audio_file_counting_fast)
    extracted_features.append([breathing_deep,breathing_shallow,cough_heavy,cough_shallow,counting_fast,counting_normal,vowel_a,vowel_e,vowel_o])
    extracted_features=pd.DataFrame(extracted_features,columns=['breathing-deep', 'breathing-shallow', 'cough-heavy','cough-shallow', 'counting-fast','counting-normal', 'vowel-a','vowel-e', 'vowel-o'])
    ##
    breathing_deep=np.array(extracted_features['breathing-deep'].tolist())
    breathing_shallow=np.array(extracted_features['breathing-shallow'].tolist())
    cough_heavy=np.array(extracted_features['cough-heavy'].tolist())
    cough_shallow=np.array(extracted_features['cough-shallow'].tolist())
    counting_fast=np.array(extracted_features['counting-fast'].tolist())
    counting_normal=np.array(extracted_features['counting-normal'].tolist())
    vowel_a	=np.array(extracted_features['vowel-a'].tolist())
    vowel_e	=np.array(extracted_features['vowel-e'].tolist())
    vowel_o=np.array(extracted_features['vowel-o'].tolist())
    #Concat
    x=np.concatenate([breathing_deep,breathing_shallow,cough_heavy,cough_shallow,counting_fast,counting_normal,vowel_a,vowel_e,vowel_o],axis=1)
    ###_model
    model=load_model(r"model/audio_classification.hdf5")
    #prediciton
    prediction=model.predict(x)
    pred=int(np.round(prediction))
    print(pred)
    #
    check=db['info']
    myquery = { "_id": session['time'] }
    newvalues = { "$set": { "result": pred } }
    check.update_one(myquery, newvalues)


    if(pred==0):
        return render_template('negative.html')
    else:
        now = datetime.now()
        login=db['login']
        existing_user = login.find_one(({"_id": session["user_email"]}))


        
        date = now.strftime("%d/%m/%Y %H:%M:%S")
        past = {"_id":date,"name":session['user_name'],"state":existing_user['state']}
        current=db['current']
        complete=db['complete']
        current.insert_one(past)
        complete.insert_one(past)
        

        return render_template('positive.html')



@app.route('/redirect')
def redirect():
    login=db['login']
    check=db['info']
    existing_user = login.find_one(({"_id": session["user_email"]}))        
    check_user = check.find(({"user_email":session['user_email']}))
    if check_user is None:
        check_user=0
        
    img=existing_user['image_url']
    print(img) 
    return render_template('main.html',user_name=session['user_name'],user_email=session['user_email'],img=img,data=check_user)

@app.route('/update_image', methods=['GET', 'POST'])
def update_image():
    if request.method =="POST":
        image = request.files['new_image']
        file_path="static/images/"+str(session['user_email']) +".jpg"
        print(file_path)
        image.save(file_path)
        ##
        login=db['login']
        #
        myquery = { "_id": session['user_email'] }
        newvalues = { "$set": {"image_url":file_path } }
        login.update_one(myquery, newvalues)
        ##
        check=db['info']
        existing_user = login.find_one(({"_id": session["user_email"]}))        
        check_user = check.find(({"user_email":session['user_email']}))
        if check_user is None:
            check_user=0
            
        img=existing_user['image_url']
        print(img)
        return render_template('main.html',user_name=session['user_name'],user_email=session['user_email'],img=img,data=check_user)

@app.route('/update_profile', methods=['GET', 'POST'])
def update_profile():
    if request.method =="POST":
        req = request.form
        edit_phone = req.get("edited_number")
        edit_age = req.get("edited_age")
        edit_country= req.get("country")
        edit_state= req.get("state")
        edit_district= req.get("district")
        edit_sex= req.get("edited_sex")
        login=db['login']
        myquery = { "_id": session['user_email'] }
        newvalues = { "$set": {"age":edit_age,"sex":edit_sex,"phone_number":edit_phone,"country":edit_country,"state": edit_state,"district": edit_district } }
        login.update_one(myquery, newvalues)
        check=db['info']
        existing_user = login.find_one(({"_id": session["user_email"]}))        
        check_user = check.find(({"user_email":session['user_email']}))
        if check_user is None:
            check_user=0
        
        img=existing_user['image_url']
        return render_template('main.html',user_name=session['user_name'],user_email=session['user_email'],img=img,data=check_user)
        #

@app.route('/update_password', methods=['GET', 'POST'])
def update_password():
     if request.method =="POST":
        req = request.form
        edit_olds = req.get("old_password")
        edit_news = req.get("new_password")
        #
        login=db['login']
        existing_user = login.find_one(({"_id": session["user_email"]}))
        if existing_user['password']==edit_olds:
            myquery = { "_id": session['user_email']}
            newvalues = { "$set": {"password":edit_news}}
            login.update_one(myquery, newvalues)
            check=db['info']
            existing_user = login.find_one(({"_id": session["user_email"]}))        
            check_user = check.find(({"user_email":session['user_email']}))
            if check_user is None:
                check_user=0
            
            img=existing_user['image_url']
        
        return render_template('main.html',user_name=session['user_name'],user_email=session['user_email'],img=img,data=check_user)

##govt-side

@app.route('/gov')
def gov():
    return render_template('govt/govlogin.html')



@app.route('/govt_main', methods=['GET', 'POST'])
def govt_main():
    if request.method =="POST":
        req = request.form
        unique_id = req.get("unique_id")
        unique_password = req.get("password")
        print(unique_password)
        print(unique_id)
        admin_login=db['admin_login']
        existing_user = admin_login.find_one(({"_id":unique_id}))
        if existing_user['password'] == unique_password:
            if existing_user['role']=="admin":
                current=db['current']
                complete=db['complete']
                x=current.find({})
                y=complete.find({})
                return render_template('govt/gov.html',current=x,complete=y)
            elif existing_user['role']=="super_admin":
                current=db['current']
                complete=db['complete']
                x=current.find({})
                y=complete.find({})
                z=admin_login.find({})
                return render_template('govt/supe.html',current=x,complete=y,admins=z)


    return render_template('govt/gov.html')

@app.route('/add_admin', methods=['GET', 'POST'])
def add_admin():
    if request.method =="POST":
        req = request.form
        unique_id = req.get("unique_id")
        name = req.get("name")
        number = req.get("number")
        password = req.get("password")
        role="admin"
        admin_login=db['admin_login']
        #
        existing_user = admin_login.find_one(({"_id":unique_id}))
        if existing_user is not  None:
            return render_template('govt/supe.html',exist=1)
        #
        past = {"_id":unique_id,"name":name,"password":password,"phone_number":number,"role":role}
        admin_login.insert_one(past)
        current=db['current']
        complete=db['complete']
        x=current.find({})
        y=complete.find({})
        z=admin_login.find({})
        return render_template('govt/supe.html',current=x,complete=y,admins=z)





if __name__ == '__main__':
    app.run(debug=True)