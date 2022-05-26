from pydub import AudioSegment
import speechpy
import scipy.io.wavfile as wavy
from python_speech_features import delta
import scipy.signal as sps
import numpy as np


def extract_features(file_loc):
    req_sample_rate=8000
    newAudio = AudioSegment.from_wav(file_loc)
    fs, signal = wavy.read(file_loc)
    if(signal.ndim!=1):
        signal = signal[:,0]
    number_of_samples = round(len(signal) * float(req_sample_rate)/ fs)
    signal = sps.resample(signal, number_of_samples)
    mfcc_feat = speechpy.feature.mfcc(signal, sampling_frequency=req_sample_rate, frame_length=0.025, frame_stride=0.01, num_filters=40, fft_length=512, low_frequency=0, high_frequency=None)
    mfcc_d = delta(mfcc_feat,1)
    mfcc_dd = delta(mfcc_d,1)
    feat = np.concatenate((mfcc_feat,mfcc_d,mfcc_dd),axis=1)
    features = np.mean(feat, axis = 0)
    # print(features)
    return features

