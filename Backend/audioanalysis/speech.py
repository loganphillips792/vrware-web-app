from audioanalysis import myspsolution as mysp
import numpy as np
import os

# path to the file's directory
def run_overview(file_title):
    file_location = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/media/audio"
    print("Running analysis on " + file_location+"/"+file_title)
    total = mysp.mysptotal(file_title, file_location)
    print(total)
    #index = total.index
    if total is False:
        return False
        
    return {
        'syllables_count': total.iloc[0][0],
        'pauses_count': total.iloc[1][0],
        'articulation_rate': total.iloc[3][0],
        'speaking_duration': total.iloc[4][0],
        'original_duration': total.iloc[5][0]
    }

def run_pronunciation_posteriori_probability_score_percentage(file_title):
    file_location = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + "/media/audio/"
    print(f"Running Pronunciation posteriori probability score percentage on {file_location}/{file_title}")
    return mysp.mysppron(file_title, file_location)
    

