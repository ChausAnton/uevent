import React, {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { useHistory } from "react-router-dom";

export const AuthPage = () => {
    const auth = useContext(AuthContext);

    const message = useMessage();

    const {loading, error, request, clearError} = useHttp()

    const [form, setForm] = useState ( {
        login: '', password: ''
    });

    useEffect( () => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect( () => {
        window.M.updateTextFields()
    }, []);

    const chengeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    const loginHandler = async() => {
        try {
            const data = await request('/auth/signIn', 'POST', {...form})
            auth.login(data.accessToken, data.id, data.role);
        }
        catch (e) {}
    };

    const history = useHistory();
    const signUpHandler = event => {
        event.preventDefault();
        history.push('/register')
    };

    const passwordResetHandler = event => {
        event.preventDefault();
        history.push('/forgotPassword')
    };

    return (
        <div>
            <div className="card blue darken-1">
                <div className="card-content white-text">
                    <span className="card-title">Authorization</span>
                        <div>
                            <div className="input-field">
                                <input placeholder="input login" 
                                    id="login" 
                                    type="text" 
                                    name="login" 
                                    className="yellow-input white-text" 
                                    onChange={chengeHandler} />

                                <label htmlFor="login">login</label>
                            </div>
                            <div className="input-field">
                                <input placeholder="input password" 
                                    id="password" 
                                    type="password" 
                                    name="password" 
                                    className="yellow-input white-text" 
                                    onChange={chengeHandler} />

                                <label htmlFor="password">password</label>
                            </div>

                        </div>
                </div>
                <div className="card-action">
                    <button 
                        className="btn yellow darken-4 regButtonMargin"
                        onClick={loginHandler}
                        disabled={loading}>
                        sign in
                    </button>

                    <button className="btn grey lighten-1" onClick={signUpHandler} disabled={loading}>sign up</button><br/>
                    <a className="waves-effect waves-teal btn-flat lighten-1" onClick={passwordResetHandler} disabled={loading} href="/">Forgot your password ?</a>
                </div>
            </div>
        </div>
    );
}