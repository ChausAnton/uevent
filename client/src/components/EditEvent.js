import React, { useContext, useState, useEffect } from "react";
import { useMessage } from '../hooks/message.hook';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import Select from 'react-select';
import { useParams } from "react-router-dom";
import { FiArrowLeft, FiSend } from "react-icons/fi";


export const EditEvent = ({setEditPostOnFalse}) => {
    const message = useMessage();

    const {token} = useContext(AuthContext);
    const {loading, error, request, clearError} = useHttp()
    const {id} = useParams();

    const [form, setForm] = useState ( {
        title: '', content: '', category_id: {}, ticketPrice: null, promoCode: "", eventLocation: "", eventDate: ""
    });

    useEffect( () => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect( () => {
        window.M.updateTextFields()
    }, []);

    const chengeHandler = event => {
        if(event.target)
            setForm({...form, [event.target.name]: event.target.value})
        else {
            form.category_id = Object.fromEntries(event.map((category, index) => {
                return [index, category.value]
            }))
        }
    };

    const PostEditHandler = async(event) => {
        
        try {
            const obj = {}
            for (const [key, value] of Object.entries(form)) {
                if(value || ((typeof(value)).localeCompare("object") === 0 && Object.keys(value).length !== 0))
                    obj[key] = value
            }
            await request('/event/updateEvent/' + id, 'PUT', {...obj}, {'x-access-token': token})
            window.location.reload();
            setEditPostOnFalse();
        }
        catch (e) {}
    };

    const options = JSON.parse(sessionStorage.getItem('categories')).map((category) => {
            return {value: category.id, label: category.category_title}
    })

    const SelectStyle = {
        option: (provided) => ({
            ...provided,
            color: '#000000',
            padding: 10,
        }),
        valueContainer: base => ({
            ...base,
            color: 'white',
        }),

        multiValueLabel: base => ({
            ...base,
            backgroundColor: "#1976d2",
            color: "#FFFFFF"
        }),
        multiValueRemove: base => ({
            ...base,
            color: "#000000"
        }),
        control: (base, state) => ({
            ...base,
            boxShadow: "none",
            border: `2px solid ${state.isFocused ? "#ffeb3b" : "#1976d2"}`,
            '&:hover': {
                border: `2px solid ${state.isFocused ? "#ffeb3b" : "#1976d2"}`
            }
        })
    }

    return (
        <div>
            <div className="card blue darken-1">
                <div className="card-content white-text">
                    <button className="btn-floating btn-large waves-effect waves-light grey lighten-1 EditPostButtonBack" onClick={setEditPostOnFalse}> 
                            <FiArrowLeft className="FiArrowLeftSizeEditProfile"/>
                    </button>
                    <span className="card-title center-align EditPostTitleCard">Edit event</span>
                        <div>
                        <div className="input-field">
                                <input placeholder="input title" 
                                    id="title" 
                                    type="text" 
                                    name="title" 
                                    className="yellow-input white-text" 
                                    onChange={chengeHandler} 
                                    />

                                <label htmlFor="title">title</label>
                            </div>
                            <div className="input-field">
                                <input placeholder="input content" 
                                    id="content" 
                                    type="text" 
                                    name="content" 
                                    className="yellow-input white-text" 
                                    onChange={chengeHandler} 
                                    />

                                <label htmlFor="content">content</label>
                            </div>
                            <div className="input-field">
                                <input placeholder="input ticket price" 
                                    id="ticketPrice" 
                                    type="text" 
                                    name="ticketPrice" 
                                    className="yellow-input white-text" 
                                    onChange={chengeHandler} 
                                    />

                                <label htmlFor="ticketPrice">ticket price</label>
                            </div>
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
                            <div className="input-field">
                                <input placeholder="input event date" 
                                    id="eventDate" 
                                    type="text" 
                                    name="eventDate" 
                                    className="yellow-input white-text" 
                                    onChange={chengeHandler} 
                                    />

                                <label htmlFor="eventDate">event date</label>
                            </div>
                            <div className="input-field">
                                <input placeholder="input event location" 
                                    id="eventLocation" 
                                    type="text" 
                                    name="eventLocation" 
                                    className="yellow-input white-text" 
                                    onChange={chengeHandler} 
                                    />

                                <label htmlFor="eventLocation">event location</label>
                            </div>
                            <div className="input-field">
                                <p className="categories">Categories</p>
                                <Select options={options}
                                placeholder={"Select categories"}
                                closeMenuOnSelect={false}
                                isMulti 
                                id="categories" 
                                name="categories" 
                                styles={SelectStyle}
                                onChange={chengeHandler}
                                />
                                <label htmlFor="categories" hidden>categories</label>
                            </div>
                        </div>
                </div>
                <div className="card-action center-align">
                    <button className="btn waves-light red" onClick={PostEditHandler} disabled={loading}>Submit
                        <FiSend className="FiSendSizeEditProfile"/>
                    </button>
                </div>
            </div>
        </div>
    );
}