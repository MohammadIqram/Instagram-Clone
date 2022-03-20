import React, { useState } from 'react';
import './styles/ImageUpload.css';
import { Button, LinearProgress} from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from 'firebase';

function ImageUpload({username}){
    const [caption, setCaption] = useState("")
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)

    // function for capturing the file
    const handleChange = (e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
            document.querySelector('#file-chosen').textContent = e.target.files[0].name;
        }
    }

    // uploading post
    const handleUpload = (e)=>{
        if(image == null){
            alert('image not found!')
        }
        else{
            const uploadTask = storage.ref(`images/${image.name}`).put(image)

            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    // progress function
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    )
                    setProgress(progress)
                },
                (error)=>{
                    // error function
                    console.log(error)
                    alert(error.message)
                },
                ()=>{
                    // complete function
                    storage.ref('images').child(image.name).getDownloadURL()
                    .then(url=>{
                        // post image inside firebse db
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })
    
                        // resetting user progress after upload completed
                        setProgress(0)
                        setCaption("")
                        setImage(null)
                    })
                }
            )
        }
    }

    return (
        <div className="image__upload">
            <input className="image__caption" type="text" placeholder="Enter a caption..." onChange={event=> setCaption(event.target.value)} />
            <input type="file" onChange={handleChange} id="actual-btn" hidden />
            <label for="actual-btn">Choose File</label>
            <span id="file-chosen">No file chosen</span>
            <Button onClick={handleUpload}>upload</Button>
            <LinearProgress className="image__progress" variant="determinate" value={progress} max="100"/>
        </div>
    )
}

export default ImageUpload;