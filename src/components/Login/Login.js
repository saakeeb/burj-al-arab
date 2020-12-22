import React, { useContext , useState} from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import { firebaseConfig } from './Firebase.Config';
import FacebookIcon from '@material-ui/icons/Facebook';
import { IconButton } from '@material-ui/core';
import { UserContext } from '../../App';
import { Link, useHistory, useLocation } from 'react-router-dom';
firebase.initializeApp(firebaseConfig);

const Login = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    let history = useHistory();
    let location = useLocation();

    let { from } = location.state || { from: { pathname: "/" } };

    const [user, setUser] = useState({
        isSignIn : false,
        name : '',
        email : '',
        photo : '',
        password: '',
        error: '',
        success: false
    })

    const handleGoogleSignIn = () => {
        let googleProvider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(googleProvider)
            .then(result => {
                const { name: displayName, email, photoURL } = result.user;
                const signIn = {
                    isSignIn : true,
                    name: displayName,
                    email: email,
                    photo: photoURL,
                    success: true
                };
                setLoggedInUser(signIn);
                history.replace(from);
                console.log(signIn);
            })
            .catch(error => {
                let errorMessage = error.message;
                let email = error.email;
                console.log( errorMessage, email );
            });
    }

    const handleGoogleSignOut = ()=>{
        return firebase.auth().signOut()
        .then(res => {
            const signOut =  {
                isSignIn : false,
                name: '',
                email: '',
                photo: '' 
            }
            setUser(signOut);
            setLoggedInUser(signOut);
          })
        .catch(error => {
            const errorMessage = error.message;
            console.log(errorMessage);
        });
    }

    const handleFbSignIn = () => {
        let fbProvider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(fbProvider)
            .then(result => {
                const { name: displayName, email, photoURL } = result.user;
                const signIn = {
                    isSignIn : true,
                    name: displayName,
                    photo: photoURL,
                    success: true,
                    email: email
                };
                setLoggedInUser(signIn);
                history.replace(from);
                console.log(signIn);
            })
            .catch(function (error) {
                let errorMessage = error.message;
                let email = error.email;
                console.log( errorMessage, email );
            });
    }
    return (
        <div style={{ textAlign: 'center' }}>

            <h1>This is Login</h1>
            {   loggedInUser.email ?
                <button onClick={handleGoogleSignOut}>
                    <IconButton >
                        Google Sign Out
                    </IconButton>
                </button>
                :
                <button onClick={handleGoogleSignIn}>
                    <IconButton >
                        Google Sign In
                    </IconButton>
                </button>
            }
            <br /><br/>
            <Link to='/register'>
                <button>
                    <IconButton >
                        Sign up with mail
                    </IconButton>
                </button>
            </Link>
            <br/><br/>
            { loggedInUser.email ?
                <button onClick={() => setLoggedInUser({})}>
                    <IconButton aria-label="add to favorites">
                        <FacebookIcon /> Sign Out
                    </IconButton>
                </button>
                :
                <button onClick={handleFbSignIn}>
                    <IconButton aria-label="add to favorites">
                        <FacebookIcon /> Sign In
                    </IconButton>
                </button>
            }
        </div>
    );
};

export default Login;