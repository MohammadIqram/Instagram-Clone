import React, {useState, useEffect} from 'react';
import './styles/App.css';
import './styles/Signup.css';
import Logo from './img/instagramLogo.png'
import 'boxicons';
import Post from './Post';
import {db, auth} from './firebase';
import { Button, makeStyles, Modal, withTheme, Avatar, Paper, MenuList, MenuItem } from '@material-ui/core';
import ImageUpload from './ImageUpload'
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import HomeIcon from '@material-ui/icons/Home';
import PublishIcon from '@material-ui/icons/Publish';

function getModalStyle(){
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`
    }
}

// frame for modal...
const useStyles = makeStyles((theme)=>({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: "#FAFAFA",
        borderRadius: "3px",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2) 
    }
}))

function App(){

    const classes = useStyles()
    const [modalStyle] = useState(getModalStyle)

    const [posts, setPosts] = useState([])
    const [opendialog , setOpendialog] = useState(false);
    const [login, setLogin] = useState(false)
    const [menu, openMenu] = useState(false)
    const [uploadBox, openUploadBox] = useState(false)

    // getting input fields:
    const [username, setusername] = useState('')
    const [password, setpassword] = useState('')
    const [email, setemail] = useState('')
    const [password2, setconfirm] = useState('')
    const [user, setUser] = useState(null)

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged((authUser)=>{
            if(authUser){
                //user logged in
                setUser(authUser)
            }   
            else{
                //user logged out
                setUser(null)
            }
        })

        return ()=>{
            // perform cleanup
            unsubscribe()
        }
    }, [user, username])

    useEffect(()=>{
        // running once component loads:
        db.collection('posts').orderBy("timestamp", "desc").onSnapshot(snapshot=>{
            setPosts(snapshot.docs.map( doc => ({
                id: doc.id,
                post: doc.data()
            })))
        })
    }, [])

    // creating user account and setting up profile
    const Signup = (event)=>{
        event.preventDefault()
        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser)=>{
            setOpendialog(false)
            return authUser.user.updateProfile({
                displayName: username
            })
        })
        .catch((error)=>alert(error.message))
    }

    // signing user In
    const signIn = (event)=>{
        event.preventDefault()

        // authenticating user
        auth.signInWithEmailAndPassword(email, password)
        .catch((error)=> alert(error.message))
        setOpendialog(false)
    }

    // logging user out
    const logOut = (event)=>{
        event.preventDefault()

        //logout view
        auth.signOut()
        openMenu(false)
    }

    const handleMenu = ()=>{
        if(menu == false){
            openMenu(true)
        }
        else{
            openMenu(false)
        }
    }

    const controlContainer = ()=>{
        if(uploadBox){
            openUploadBox(false)
        }
        else{
            openUploadBox(true)
        }
    }

    return(
        <div className="app">

            <Modal open={opendialog} onClose={()=>setOpendialog(false)} >
                <div style={modalStyle} className={classes.paper}>
                <div>
            <div className="container">
            <div className="box1">
                <img src={Logo} alt="" className="instaLogoText" />
                <div className="form-box">
                    {!login ? (
                    <form action="">
                    <input type="text" placeholder="username" onChange={(e)=>setusername(e.target.value)} />
                    <input type="email" placeholder="email address" onChange={(e)=>setemail(e.target.value)}/>
                    <input type="password" placeholder="Password" onChange={(e)=>setpassword(e.target.value)}/>
                    <input type="password" placeholder="Confirm" onChange={(e)=>setconfirm(e.target.value)}/>
                    <input type="submit" onClick={Signup} value="Sign Up" className="button" />
                </form>                        
                    ): (
                        <form action="">
                        <input type="email" placeholder="Phone number, username or email" onChange={(e)=>setemail(e.target.value)} />
                        <input type="password" placeholder="Password" onChange={(e)=>setpassword(e.target.value)}/>
                        <input type="submit" value="Login" onClick={signIn} className="button" />
                    </form>                        
                    )}
                </div>
            </div>
            <div className="mid-box">
                <div className="line"></div>
                <div className="or">or</div>
                <div className="line"></div>
            </div>
            {login ? (
                <div>
            <div className="social">
                <button className="social-link">
                    <span className="social-fb-icon bx-sm"><box-icon name="facebook-square" type="logo" className='bx bxl-facebook-square'></box-icon></span>
                    <span className="social-fb-text">Log In with Facebook</span>
                </button>
            </div>
            <div className="forgot-pass-link">
                <a href="#" className="forgot-pass-text">Forgot password?</a>
            </div>                    
                </div>                
            ): null}
        </div>
        <div className="box2">
                {!login ? (
            <div className="box2-heading">
            <p className="box2-primary-heading">have an account?</p>
            &nbsp;<a onClick={()=>setLogin(true)} className="signup-link">Login</a>
        </div>                    
            ): (
                <div className="box2-heading">
                <p className="box2-primary-heading">D'ont have an account?</p>
                &nbsp;<a onClick={()=>setLogin(false)} className="signup-link">Sign Up</a>
            </div>
            )}
        </div>
        </div>
                </div>
            </Modal>

            <div className="app__header">
                <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />

                <a href="/" className="home__icon"><HomeIcon /></a>

                { user ? (<a className="menu__open" onClick={handleMenu}><Avatar/></a>) : (
                <Button onClick={()=>setOpendialog(true)}>Sign Up</Button>
            ) }

            { menu ? (
                        <div className="menu__container">
                            <Paper>
                                <MenuList>
                                    <MenuItem className="menu__text"><AccountCircleOutlinedIcon />&nbsp;&nbsp;Profile</MenuItem>
                                    <MenuItem className="menu__text"><BookmarkBorderOutlinedIcon />&nbsp;&nbsp;Saved</MenuItem>
                                    <MenuItem className="menu__text"><SettingsOutlinedIcon />&nbsp;&nbsp;Settings</MenuItem>
                                    <MenuItem className="menu__lastItem" onClick={logOut}>Logout</MenuItem>
                                </MenuList>
                            </Paper>
                        </div>
            ): (null) }
            </div>

            <div className="post__container">
            {posts.map(({id, post})=>(
                <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))}
            </div>

            {
                uploadBox ? (
                    <div className="upload__container">
                    {user?.displayName ? (<ImageUpload username={user.displayName}/>) : 
                        ( null )}
                    </div>
                ) : (null)
            }

            <div className="upload__container__visibility" onClick={controlContainer}>
            <box-icon name='upload'></box-icon>
            </div>
        </div>
    )
}

// exporting...
export default App;