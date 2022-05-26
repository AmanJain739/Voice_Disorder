import React, {useState, useEffect} from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });


function Record () {
    let history=useHistory();
    const [isRecording, setIsRecording] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false)
    const [blobURL, setBlobUrl] = useState()
    const [blob, setBlob]  = useState()
    const[getanswer, setGetanswer] =useState(false)
    const[answer,setAnswer]=useState("Voice Disorder Is Present")

    useEffect ( () => {
        navigator.getUserMedia({ audio: true },
            () => {
                console.log('Permission Granted');
                setIsBlocked(false);
            },
            () => {
                console.log('Permission Denied');
                setIsBlocked(true);
            },
            );
    })

    function start()
    {
        if (isBlocked) {
            console.log('Permission Denied');
            } else {
            Mp3Recorder
                .start()
                .then(() => {
                setIsRecording(true);
                }).catch((e) => console.error(e));
            }
    };

    function stop() 
    {
        Mp3Recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                // blob = blob.slice(0, blob.size, "audio/wav")
                let blobURLtemp = URL.createObjectURL(blob)
                // console.log(blob)
                console.log(blobURLtemp)
                setIsRecording(false)
                setBlobUrl(blobURLtemp)
                setBlob(blob);
            }).catch((e) => console.log(e));
    };

    function show()
    {
        console.log(blob);
    };
    
    function test()
    {
        axios
            .post('/api/feature_extraction/',blob)
            .then(
                (res)=>{
                if(res.data["Disorder"]===1)
                {
                    setAnswer("Voice Disorder Is Present")                    
                }
                else
                {
                    setAnswer("Healthy Voice")
                }
                setGetanswer(true)
            }
            );
    }

    return (
        <div>
            <div className="App">
                <h1>Welcome To Voice-Disorder Detection App</h1>
                <h2>IIIT Hyderabad</h2>
                <div>
                    <button onClick={() => history.push('/recordvoice')}>Record Voice</button>
                </div>
                <div>
                    <button onClick={() => history.push('/uploadvoice')}>Upload Recording</button>
                </div>
            </div>
            <div className="Record" style={{textAlign:'center', paddingTop:'100px'}}>
                <div>
                    <button onClick={start} disabled={isRecording} >Record</button>
                    <button  onClick={stop} disabled={!isRecording}>Stop</button>
                </div>
                <audio src={blobURL} controls="controls" />
                <div>
                    <button onClick={show} >Display</button>
                    <a href={blobURL}>Click Here</a>
                </div>
                <div>
                    <button onClick={test}>Test For Voice Disorder</button>
                </div>
                { 
                    getanswer===true &&
                    <div>
                        <h2>{answer}</h2>
                    </div>
                }
            </div>
      </div>
    );
}

export default Record;