from flask import Flask
from flask import jsonify
from flask import request
from scipy.io.wavfile import read as wavread
from scipy.io.wavfile import write as wavwrite
import numpy as np
import wave
import cgi
import contextlib
import base64
import soundfile as sf
from flask_cors import CORS, cross_origin
import subprocess
import time
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

MODEL_FILE = '../../DeepSpeech/fine_tune_model/output_graph.pb'
ALPHABET_FILE = '../../DeepSpeech/models/alphabet.txt'
LANGUAGE_MODEL =  '../../DeepSpeech/models/lm.binary'
TRIE_FILE =  '../../DeepSpeech/models/trie'

@app.route('/', methods=['POST'])
@cross_origin()
def post():
    print("Here")
    ts = time.time()
    ts = str(ts)
    ts_label = ts + "_label.txt" 
    ts += ".wav"

    data = json.loads(request.data)
    print("-------------")
    print(request.data)
    print(data)
    print("-------------")

    with open(ts, "wb") as vid:
        vid.write(base64.b64decode(data['audio']))
    # with open(ts_label, "w") as label:
    #     label.write(request.label)

    proc = subprocess.Popen(
        f"deepspeech --model {MODEL_FILE} --alphabet {ALPHABET_FILE} --lm {LANGUAGE_MODEL} --trie {TRIE_FILE} --audio {ts}",
        shell=True, stdout=subprocess.PIPE, )
    output = proc.communicate()[0]
    print(output)

    return jsonify(
        username=output.decode("utf-8") 
    )

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80,debug=True)