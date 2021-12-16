import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import {AuthContext} from '../context/AuthContext'
import { useMessage } from "../hooks/message.hook";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

export const Comments = ({comments}) => {
    const {error, clearError, request} = useHttp();
    const history = useHistory();
    const {token, role} = useContext(AuthContext);
    const message = useMessage();
    const {id} = useParams();

    useEffect( () => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const [form, setForm] = useState ( {
        content_comment: '', post_id_comment: id
    });

    useEffect(() => {
        window.M.updateTextFields()
    });

    if(!comments) {
        return <p className="center">comments not found</p>
    }

    const commentToActiveInactive = async(event) => {
        event.preventDefault();
        try {
            const toStatus = event.target.innerText.split(' ')[1]
            await request('/comment/updateComment/' + event.target.id, 'PUT', {status_comment: toStatus}, {'x-access-token': token})
            window.location.reload();
        }
        catch (e) {}
    }

    const chengeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    const ShowAuthorProfile = (event) => {
        history.push('/profile/' + event.target.id)
    }

    const setLikeDislike = async(type, commentID) => {
        try {
            await request('/like/createLike', 'POST', {type: type, comment_id: parseInt(commentID)}, {'x-access-token': token})
        }
        catch (e) {}
    }

    const AddComment = async() => {
        try {
            await request('/comment/createComment', 'POST', {...form}, {'x-access-token': token})
        }
        catch (e) {}
    };

    const likeDislikeHandler = (event) => {
        setLikeDislike(event.target.id.split(' ')[0], event.target.id.split(' ')[1])
    }

    return (
        <div>
            {
                comments.map((comment, index) => {
                    const authorImage = "/image/getUserImage/" + comment.author_id_comment
                    return (
                        <div key={index}>
                            <div className="divider"></div>
                            <div className="section">
                                <div className="card-panel blue darken-1 hoverable CommentCard">
                                    <div className="CommentAuthorBox">
                                        <div className="chip CommentAuthor" onClick={ShowAuthorProfile} id={comment.author_id_comment}>
                                            <img src={authorImage} alt="Contact Person"/>
                                            {comment.real_name}
                                        </div>
                                    </div>
                                    <div className="CommentDate">
                                        <div className="CommentDateDopBox">
                                            <div className="chip">
                                                <span>Posted on: {comment.createdAt.split('T')[0]}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="commentContent">
                                        <h3 className="white-text flow-text CommentText">{comment.content_comment}</h3>
                                        <div className="RatingChipBox">
                                            <div className=" chip">
                                                <div className="Like" onClick={likeDislikeHandler}>
                                                    <FiArrowUp id={`like ${comment.id}`} className="FiArrowDownFiArrowUpSize"/>
                                                </div>
                                                <div className="RatingContainer">
                                                    <span className="flow-text">{comment.likes_comment}</span>
                                                </div>
                                                <div className="Dislike" onClick={likeDislikeHandler}>
                                                    <FiArrowDown id={`dislike ${comment.id}`} className="FiArrowDownFiArrowUpSize"/>
                                                </div>
                                            </div>
                                        </div>     
                                    </div>
                                </div>
                                    <div className="CommentStatusBox">
                                        <div className="InnerCommentStatusBox">
                                            {(role && role.localeCompare('admin') === 0) ? 
                                                    <><div className="chip">
                                                        Status: {comment.status_comment}
                                                    </div>
                                                    {(comment.status_comment && comment.status_comment.localeCompare('active') === 0) ? 
                                                        <div className={"chip " + comment.status_comment} onClick={commentToActiveInactive} id={comment.id}>
                                                            to inactive
                                                        </div>
                                                        :
                                                        <div className={"chip " + comment.status_comment} onClick={commentToActiveInactive} id={comment.id}>
                                                            to active
                                                        </div>
                                                    }</>
                                                    : <></>
                                                }
                                            </div>
                                    </div>
                            </div>
                        </div>
                    )
                })
            }
            <div className="AddCommentBox blue darken-2">
                <div className="input-field">
                    <input placeholder="Comment" 
                        id="content_comment" 
                        type="text" 
                        name="content_comment" 
                        className="yellow-input white-text" 
                        onChange={chengeHandler} 
                        />

                    <label htmlFor="content_comment">input your Comment</label>
                </div>
                <button className="btn grey lighten-1"
                        onClick={AddComment}
                    >
                    Add comment</button>
            </div>
        </div>
    );
}