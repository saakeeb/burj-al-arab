import React, { useState } from 'react';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import { useHistory, useLocation } from 'react-router-dom';

const Register = () => {

    let history = useHistory();
    let location = useLocation();

    let { from } = location.state || { from: { pathname: "/" } };

    const [newUser, setNewUsr] = useState(false)
    const [user, setUser] = useState({
        isSignIn: false,
        name: '',
        email: '',
        photo: '',
        password: '',
        error: '',
        mobile: '',
        success: false
    })

    const handleClick = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        let isFieldValid = true;
        if (name === 'email') {
            isFieldValid = /\S+@\S+\.\S+/.test(value);
        }
        if (name === 'password') {
            const isValidLength = value.length >= 6;
            const isValidPass = /\d{1}/.test(value)
            isFieldValid = isValidLength && isValidPass;
        }
        if (isFieldValid) {
            const userInfo = { ...user };
            userInfo[name] = value;
            setUser(userInfo);
        }
    }
    const handleSubmit = (e) => {
        if (newUser && user.email && user.password && user.name && user.mobile) {
            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then(res => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                    updateUserInfo(user.name, user.mobile);
                    console.log(res.user);
                })
                .catch(error => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setUser(newUserInfo);
                });
        }
        if (!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then((res) => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = '';
                    newUserInfo.success = true;
                    setUser(newUserInfo);
                    history.replace(from);
                    console.log(res.user);
                })
                .catch((error) => {
                    const newUserInfo = { ...user };
                    newUserInfo.error = error.message;
                    newUserInfo.success = false;
                    setUser(newUserInfo);
                });
        }
        e.target.reset();
        e.preventDefault();
    }
    const updateUserInfo = (name, mobile) => {
        const user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: name,
            phoneNumber: mobile
        })
        .then(function () {
            console.log('Successfully submitted');
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <form onSubmit={handleSubmit} style={{ margin: '25px' }}>
                {
                    newUser && <div><input type="text" name="name" id="name" onBlur={handleClick} placeholder='Your Name' required style={{ width: '300px', height: '45px' }} />
                <br /><br />
                        <input type="text" name="mobile" id="mobile" onBlur={handleClick} placeholder='Your Mobile' required style={{ width: '300px', height: '45px' }} />
                <br /><br />
                    </div>
                }
                <input type="text" name="email" id="email" onBlur={handleClick} placeholder='Your Email' required style={{ width: '300px', height: '45px' }} />
                <br /><br />
                <input type="password" name="password" id="password" onBlur={handleClick} placeholder='Your Password' title='6 character with 1 numeric value' required style={{ width: '300px', height: '45px' }} />
                <br /><br />
                <input type="submit" value="Submit" />
                <br /><br />
            </form>
            <input onClick={() => setNewUsr(!newUser)} type="checkbox" name="newUser" />
            <label htmlFor="newUser"><strong>New User Sign Up</strong></label>
            <p style={{ color: 'red' }}>{user.error}</p>
            {
                user.success && <p style={{ color: 'green' }}>User {newUser ? 'created' : 'logged in'} successfully</p>
            }
        </div>
    );
};

export default Register;