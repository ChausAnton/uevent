import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { Comments } from "./Comments";
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';
import { EditEvent } from "./EditEvent";
import { Subscribe } from "./Subscribe";
import { FiEdit2, FiArrowDown, FiArrowUp } from "react-icons/fi";

export const EventDetail = ({event, commentsData}) => {
    const history = useHistory();
    const {token, userId} = useContext(AuthContext);
    const {request, error, clearError} = useHttp();
    const message = useMessage();
    const [editPost, setEditPost] = useState(false);
    const [subscribe, setSubscribe] = useState(false);

    
    useEffect( () => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const setLikeDislike = async(type) => {
        try {
            await request('/like/createLike', 'POST', {type: type, event_id: event.Event_data.event_id}, {'x-access-token': token})
        }
        catch (e) {}
    }

    if(!event) {
        return <p className="center">event not found</p>
    }
   const likeDislikeHandler = (event) => {
        setLikeDislike(event.target.id)
   }

    const authorImage = "/image/getUserImage/" + event.Author_data.author_id;

    const ShowAuthorProfile = () => {
        history.push('/profile/' + event.Author_data.author_id)
    }

    const ShowPostsByCategory = (event) => {
        history.push('/home/1/' + event.target.childNodes[0].nodeValue)
    }

    const setEditPostOnTrue = () => {
        setEditPost(true)
    }

    const setEditPostOnFalse = () => {
        setSubscribe(false)
    }

    const setSubscribeOnTrue = () => {
        setSubscribe(true)

    }

    const setSubscribeOnFalse = () => {
        setEditPost(false)
        window.location.reload();
    }

    const subscribeFetch = async() => {
        try {
            if(!event.Event_data.Subscribed)
                return setSubscribeOnTrue()
            await request('/subscribe/createSubscription/' + event.Event_data.event_id, 'POST', null, {'x-access-token': token})
            window.location.reload();
        }
        catch (e) {}
    }

    return (
        <>
        { editPost ? (<div> 
            <EditEvent setEditPostOnFalse={setEditPostOnFalse}/> 
        </div>) : subscribe ? <Subscribe setSubscribeOnFalse={setSubscribeOnFalse} id={event.Event_data.event_id}/>  :
        (<div className="center">
            <div className="col s4 m4">
                <div className="card">
                    <div className="CardTopBackgroud">
                        <div className="PostDate">
                            <div className="chip">
                                <span>event date: {event.Event_data.eventDate.split('T')[0]}</span>
                            </div>
                        </div>
                        <div className="ticketPrice">
                            <div className="chip">
                                <span>ticket price: {event.Event_data.ticketPrice}</span>
                            </div>
                        </div>
                        <div className="subscribe">
                            <div className="chip" onClick={subscribeFetch}>
                                <span>{(event.Event_data.Subscribed ? "unsubscribe" : "subscribe")}</span>
                            </div>
                        </div>
                        <div className="eventLocation">
                            <div className="chip">
                                <span>event location: {event.Event_data.eventLocation}</span>
                            </div>
                        </div>
                        <div className="PostAuthor">
                            <div className="chip" onClick={ShowAuthorProfile}>
                                <img src={authorImage} alt="Contact Person" />
                                {event.Author_data.real_name}
                            </div>
                        </div>
                        <div className="Categoies">
                        {
                            event.Categories_data.map((category, index) => {
                                return (
                                    <div key={index} className="PostCategory">
                                        <div className="chip Category" onClick={ShowPostsByCategory}>
                                            {category.category_title}
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </div>
                        <div className="PostTitleContainer">
                            <div className="PostTitle">
                                <span className="card-title Title">{event.Event_data.title}</span>
                            </div>
                        </div>
                    </div>
                    {event.Author_data.author_id === userId ? 
                        <button className="btn-floating btn-large waves-effect waves-light red EditButtonPost" onClick={setEditPostOnTrue}> 
                                    <FiEdit2 className="FiEdit2Size"/>
                        </button> :
                        <></>
                    }
                    <div className="card-content CardContent blue darken-2">
                        <h3 className="white-text flow-text PostContent">{event.Event_data.content}</h3>
                        <div className="RatingChipBox">
                            <div className="RatingBox chip">
                                <div className="Like" id={1} onClick={likeDislikeHandler} >
                                    <FiArrowUp className="FiArrowDownFiArrowUpSize"/>
                                </div>
                                <div className="RatingContainer">
                                    <span className="flow-text">{event.Event_data.likes}</span>
                                </div>
                                <div className="Dislike" onClick={likeDislikeHandler} id={-1}>
                                    <FiArrowDown className="FiArrowDownFiArrowUpSize"/>
                                </div>
                            </div>
                        </div>               
                    </div>
                </div>
            </div>
            <Comments comments={commentsData}/>
        </div>)
        }</>
    );
};