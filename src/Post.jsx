/*jshint esversion: 6 */
import React, {useState, useEffect} from 'react';
import './styles/Post.css';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import {db} from './firebase';
import firebase from 'firebase';

function Post({postId, username, caption, imageUrl, user}){
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState("")

    // comments useEffect
    useEffect(()=>{
        let unsubscribe;
        if(postId){
            unsubscribe = db.collection('posts').doc(postId)
            .collection('comments').orderBy('timestamp', 'desc').onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()))
            })
        }

        return ()=>{
            unsubscribe();
        }
    }, [postId])

    // function to post comment
    const postComment = (e)=>{
        e.preventDefault()

        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    return(
        <div className="post">

            <div className="post__header">
            <Avatar
            className="post__avatar"
            alt={username}
            src="/static/images/avatar/1.jpg"/>
            <h3>{username}</h3>
            </div>

            <img className="post__image" src={imageUrl} alt="" />
            <h6 className="post__text"><strong>{username}</strong> {caption}</h6>

            <div className="post__comments">
                {
                    comments.map((comment)=>(
                        <p className="post__comment"><strong>{comment.username}</strong> {comment.text} </p>
                    ))
                }
            </div>

            <form className="comment__form">
                <input type="text" className="comment__input" placeholder="Add a comment" value={comment} onChange={(e)=> setComment(e.target.value)}/>
                {user ? (<Button className="comment__button" disabled={!comment} onClick={postComment}>post</Button>):
                (<Button className="comment__button" disabled="true">post</Button>)}
            </form>
        </div>
    )
}

export default Post;
