import requests
data = {'age':45,'blood_pressure':80,'specific_gravity':1.005,'albumin':0,'sugar':0,'red_blood_cells':'normal','pus_cell':'normal','pus_cell_clumps':'present','bacteria':'present','blood_glucose_random':121,'blood_urea':36,'serum_creatinine':1.2,'sodium':135,'potassium':4.5,'hemoglobin':15.4,'packed_cell_volume':44,'white_blood_cell_count':7800,'red_blood_cell_count':5.2,'hypertension':'yes','diabetes_mellitus':'yes','coronary_artery_disease':'yes','appetite':'good','pedal_edema':'yes','anemia':'yes'}
r = requests.post('http://127.0.0.1:8000/predict', json=data)
print(r.json())

