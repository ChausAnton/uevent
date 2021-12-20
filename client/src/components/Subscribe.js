import React, { useContext, useState, useEffect } from "react";
import { useMessage } from '../hooks/message.hook';
import { useHttp } from "../hooks/http.hook";
import {AuthContext} from '../context/AuthContext'
import { FiArrowLeft, FiSend } from "react-icons/fi";

export const Subscribe = ({setSubscribeOnFalse, id}) => {
    const message = useMessage();

    const {token} = useContext(AuthContext);
    const {loading, error, request, clearError} = useHttp()

    const [form, setForm] = useState ( {
        promoCode: ''
    });

    const chengeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    const subscribeFetch = async() => {
        try {
            await request('/subscribe/createSubscription/' + id, 'POST', form, {'x-access-token': token})
            setSubscribeOnFalse()
            window.location.reload();
        }
        catch (e) {}
    }

    useEffect( () => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect( () => {
        window.M.updateTextFields()
    }, []);


    return (
        <div className="card blue darken-1">
            <div className="card-content white-text">
                <button className="btn-floating btn-large waves-effect waves-light grey lighten-1 EditPostButtonBack" onClick={setSubscribeOnFalse}> 
                        <FiArrowLeft className="FiArrowLeftSizeEditProfile"/>
                </button>
                <span className="card-title center-align EditPostTitleCard">Subscribe event</span>
                    <div>
                        <div className="input-field">
                            <input placeholder="input promocode" 
                                id="promoCode" 
                                type="text" 
                                name="promoCode" 
                                className="yellow-input white-text" 
                                onChange={chengeHandler} 
                                />
                            <label htmlFor="promoCode">promocode</label>
                        </div>
            </div>
            <div className="card-action center-align">
                <button className="btn waves-light red" onClick={subscribeFetch} disabled={loading}>Submit
                    <FiSend className="FiSendSizeEditProfile"/>
                </button>
            </div>
        </div>
    </div>
    )
}