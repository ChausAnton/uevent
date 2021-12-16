import React, {useState, useEffect} from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { useHistory, useParams } from "react-router-dom";

export const ResetPassword = () => {
    const {token, id} = useParams();

    const {loading, error, request, clearError} = useHttp()

    const [form, setForm] = useState ( {
        password: '', passwordConfirmation: ''
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

    const passwordResetHandler = async(event) => {
        try {
            event.preventDefault();
            await request('/auth/resetPassword/' + token + "/" + id, 'POST', {...form})
            history.push('/')
        }
        catch (e) {}
    }

    return (
        <div>
            <div className="card blue darken-1">
                <div className="card-content white-text">
                    <span className="card-title">Reset Password</span>
                        <div>
                            <div className="input-field">
                                <input placeholder="input password" 
                                    id="password" 
                                    type="password" 
                                    name="password" 
                                    className="yellow-input white-text" 
                                    onChange={chengeHandler} 
                                    />

                                <label htmlFor="password">password</label>
                            </div>
                            <div className="input-field">
                                <input placeholder="repeat password" 
                                    id="passwordConfirmation" 
                                    type="password" 
                                    name="passwordConfirmation" 
                                    className="yellow-input white-text" 
                                    onChange={chengeHandler} 
                                    />

                                <label htmlFor="passwordConfirmation">repeat password</label>
                            </div>
                        </div>
                </div>
                <div className="card-action">
                    <button 
                        className="btn yellow darken-4 "
                        onClick={passwordResetHandler}
                        disabled={loading}>
                        reset password
                    </button>
                </div>
            </div>
        </div>
    );
};