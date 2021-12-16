import React, { useContext, useState } from "react";
import { EditProfile } from "./EditProfile";
import { AuthContext } from '../context/AuthContext';
import { useParams } from "react-router-dom";
import { Link} from "react-router-dom";
import { FiEdit2} from "react-icons/fi";

export const Profile = ({user, posts}) => {
    const [editProfile, setEditProfile] = useState(false);
    const {userId, role} = useContext(AuthContext);
    const {id} = useParams();

    if(!user) {
        return <p className="center">User not found</p>
    }

    let PrifileImage = "/image/getUserImage/" + userId;
    if(id)
        PrifileImage = "/image/getUserImage/" + id;



    const setEditProfileOnTrue = () => {
        setEditProfile(true)
    }

    const setEditProfileOnFalse = () => {
        setEditProfile(false)
    }

    return (
    <>
    {   (editProfile && ((!id || (userId === id)) || (role && role.localeCompare('admin') === 0))) ? 
        (<div>
            <EditProfile setEditProfileOnFalse={setEditProfileOnFalse} user={user}/>
        </div>) 
    
        : (<div className="center ProfileCard">
        <div className="col s4 m4">
                <div className="card">
                    <div className="CardTopBackgroud blue darken-2">
                        <span className="ProfileUserName">{user.real_name}</span>
                        <img src={PrifileImage} alt="Avatar" width="200" height="200" className="profileImage"/>
                    </div>
                    {((!id || (userId === parseInt(id))) || (role && role.localeCompare('admin') === 0)) ?
                        <button className="btn-floating btn-large waves-effect waves-light red EditButton" onClick={setEditProfileOnTrue}> 
                                <FiEdit2 className="FiEdit2Size"/>
                        </button> : <></>
                    }
                    
                    <div className="card-content CardContent blue darken-2">
                        <div className="row">
                            <div className="white-text ProfileLogin">{user.login}</div>
                        </div>
                        <div className="row">
                            <div className="white-text UserRating">Rating: {user.rating}</div>
                        </div>
                    </div> 
            </div>
                {posts ? posts.map(post => {
                        return (
                            <Link key={post.id} to={`/detail/${post.id}`}>
                                <div>
                                    <div className="divider"></div>
                                    <div className="section">
                                        <div className="card-panel blue darken-1 hoverable">
                                            <h3 className="white-text">{post.title}</h3>
                                            <p className="white-text flow-text">{post.content}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    }) : <p className="center">Posts not found</p>}
        </div>
    </div>)}
    </>
    );
    
}