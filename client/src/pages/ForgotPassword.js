import React, {useState, useEffect} from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { useHistory } from "react-router-dom";

export const ForgotPassword = () => {
    const {loading, error, request, clearError} = useHttp()

    const [form, setForm] = useState ( {
        email: ''
    });

    const message = useMessage();

    const history = useHistory();

    const chengeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    useEffect( () => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect( () => {
        window.M.updateTextFields()
    }, []);


    const loginHandler = event => {
        event.preventDefault();
        history.push('/')
    }

    const passwordResetHandler = async(event) => {
        try {
            event.preventDefault();
            await request('/auth/requestForPasswordReset', 'POST', {...form})
        }
        catch (e) {}
    };

    return (
        <div>
            <div className="card blue darken-1">
                <div className="card-content white-text">
                    <span className="card-title">Reset Password</span>
                        <div>
                        <   div className="input-field">
                                <input placeholder="input email" 
                                    id="email" 
                                    type="text" 
                                    name="email" 
                                    className="yellow-input white-text" 
                                    onChange={chengeHandler} 
                                    />

                                <label htmlFor="email">email</label>
                            </div>
                        </div>
                </div>
                <div className="card-action">
                    <button 
                        className="btn yellow darken-4 regButtonMargin"
                        onClick={passwordResetHandler}
                        disabled={loading}>
                        reset password
                    </button>

                    <button className="btn grey lighten-1" onClick={loginHandler} disabled={loading}>sign in</button><br/>
                </div>
            </div>
        </div>
    );
};