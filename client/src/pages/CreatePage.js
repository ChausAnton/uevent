import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import Select from 'react-select';
import { FiSend} from "react-icons/fi";


export const CreatePage = () => {
    const history = useHistory();
    const message = useMessage();

    const {token} = useContext(AuthContext);
    const {loading, error, request, clearError} = useHttp()

    const [form, setForm] = useState ( {
        title: '', content: '', category_id: {}
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

    const PostHandler = async(event) => {
        try {
            event.preventDefault();
            await request('/post/createPost', 'POST', {...form}, {'x-access-token': token})
            history.push('/')
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
                    <span className="card-title">Create Post</span>
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
                    <button className="btn waves-light red" onClick={PostHandler} disabled={loading}>Submit
                        <FiSend className="FiSendSizeEditProfile"/>
                    </button>
                </div>
            </div>
        </div>
    );
}