import React, { useContext, useState, useEffect } from "react";
import { useMessage } from '../hooks/message.hook';
import axios from 'axios';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { useParams } from "react-router-dom";
import Select from 'react-select';
import { FiArrowLeft, FiSend, FiPlus } from "react-icons/fi";


export const EditProfile = ({setEditProfileOnFalse, user}) => {
    const {userId, token, role} = useContext(AuthContext);
    const [file, setFile] = useState();
    const {id} = useParams();
    const {error, request, clearError} = useHttp()
    const message = useMessage();

    const [form, setForm] = useState({
        real_name: '', role: user.role
    });

    useEffect( () => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect( () => {
        window.M.updateTextFields()
    }, []);

    const fileSelectedHandler = event => {
        if(event.target.files[0]) {
            const image = document.getElementById('ProfileImage');
            image.src = window.URL.createObjectURL(event.target.files[0]);
        }
        setFile(event.target.files[0])
    }

    const chengeHandler = event => {
        if(event.target) {
            event.preventDefault();
            setForm({...form, [event.target.name]: event.target.value})
        }
        else {
            form.role = event.value
        }
    };

    const options = [{value: "user", label: "user"},
                    {value: "admin", label: "admin"}];

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
        control: (base, state) => ({
            ...base,
            boxShadow: "none",
            border: `2px solid ${state.isFocused ? "#ffeb3b" : "#1976d2"}`,
            '&:hover': {
                border: `2px solid ${state.isFocused ? "#ffeb3b" : "#1976d2"}`
            }
        })
    }

    const profileUpdateHandler = async(event) => {
        try {
            if(file) {
                event.preventDefault();
                const data = new FormData();
                data.append("file", file)
                
                axios.post('/image/uploadUserImage/' + userId, data, {headers: {'x-access-token': token,
                                                                                        'Content-Type': 'application/json',
                                                                                        'Acceptccept': 'application/json'
                                                                                        }})
            }
            if(id)
                await request('/user/updateUser/' + id, 'PUT', {...form}, {'x-access-token': token});
            else 
                await request('/user/updateUser/' + userId, 'PUT', {...form}, {'x-access-token': token});
            window.location.reload();
            setEditProfileOnFalse();
        }
        catch (e) {}
    }

    const openSelectImage = () => {
        document.getElementById('selectFileInput').click();
    }

    const PrifileImage = "/image/getUserImage/" + userId;
    return (
        <div className="center ProfileCard">
        <div className="col s4 m4">
                <div className="card">
                    <div className="CardTopBackgroud blue darken-2">
                        <button className="btn-floating btn-large waves-effect waves-light grey lighten-1 ButtonBack" onClick={setEditProfileOnFalse}> 
                                <FiArrowLeft className="FiArrowLeftSizeEditProfile"/>
                        </button>
                        <img src={PrifileImage} alt="Avatar" width="200" height="200" className="EditProfileImage" id="ProfileImage"/>
                        {(!id || (userId === id)) ? 
                            <div className="boxForLoadNewImageButton">
                                <button className="btn-floating btn-large waves-effect waves-light grey lighten-1 LoadNewImage" id="LoadNewImageButton" onClick={openSelectImage}><FiPlus className="FiPlusSizeEditProfile"/></button>
                            </div>
                        : <></>}
                        
                    </div>
                    
                    <div className="card-content CardContent blue darken-2">
                        { ((id && (userId !== id)) && (role && role.localeCompare('admin') === 0)) ?
                        <div className="input-field col s12 SelectForEditUser">
                            <Select 
                                defaultValue={{ label: user.role, value: user.role }}
                                placeholder="Select user's role"
                                options={options}
                                closeMenuOnSelect={true}
                                id="role" 
                                name="role" 
                                styles={SelectStyle}
                                onChange={chengeHandler}
                            />
                            <label htmlFor="role" hidden>role</label>
                        </div>
                        :
                            <>
                            <div className="input-field">
                                <input placeholder="input real name" 
                                    id="real_name" 
                                    type="text" 
                                    name="real_name" 
                                    className="yellow-input white-text" 
                                    onChange={chengeHandler} 
                                    />
                                <label htmlFor="real_name">real name</label>
                            </div>
                            <input type="file" onChange={fileSelectedHandler} name="Avatar" hidden id="selectFileInput"/>
                            </>
                        }
                        <button 
                            className="btn red" 
                            onClick={profileUpdateHandler} 
                            >Submit
                            <FiSend className="FiSendSizeEditProfile"/>
                        </button>
                    </div>
            </div>
        </div>
    </div>
    );
}