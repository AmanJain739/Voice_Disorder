import React, {useState} from 'react';
import { useHistory } from 'react-router-dom'
import axios from 'axios';


function Upload(){
    let history= useHistory();
	const [selectedFile, setSelectedFile] = useState();
	const [isSelected, setIsSelected] = useState(false);
    const [blobURL, setBlobUrl] = useState();
    const [blob, setBlob]  = useState();
    const[getanswer, setGetanswer] =useState(false)
    const[answer,setAnswer]=useState("Voice Disorder Is Present")

	function changeHandler(event){
		setSelectedFile(event.target.files[0]);
        let blob_temp = new Blob([event.target.files[0]], {type: String(event.target.files[0].type)})
		let blobURLtemp = URL.createObjectURL(blob_temp)
        setBlobUrl(blobURLtemp)
        setBlob(blob_temp)
        setIsSelected(true);
        console.log(blobURLtemp);
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

    function show()
    {
        console.log(blob);
    };
	// function handleSubmission() {
	// };

	return(
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
            <div style={{textAlign:'center', paddingTop:'100px'}}>
                <input type="file" name="file" onChange={changeHandler} />
                {isSelected ? (
                    <div>
                        <p>Filename: {selectedFile.name}</p>
                        <p>Filetype: {selectedFile.type}</p>
                        <p>Size in bytes: {selectedFile.size}</p>
                        <p>
                            lastModifiedDate:{' '}
                            {selectedFile.lastModifiedDate.toLocaleDateString()}
                        </p>
                        <audio src={blobURL} controls="controls" />
                        <div>
                            <button onClick={show} >Display</button>
                            <button onClick={test}>Test For Voice Disorder</button>
                        </div>
                    </div>

                ) : (
                    <p>Select a file to show details</p>
                )}
                { 
                    getanswer===true &&
                    <div>
                        <h2>{answer}</h2>
                    </div>
                }
            </div>
        </div>
	)
}

export default Upload;