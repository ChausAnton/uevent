import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useHttp } from "../hooks/http.hook";
import { Comments } from "./Comments";
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';
import { EditPost } from "./EditPost";
import { FiEdit2, FiArrowDown, FiArrowUp } from "react-icons/fi";

export const PostDetail = ({post, commentsData}) => {
    const history = useHistory();
    const {token, userId} = useContext(AuthContext);
    const {request, error, clearError} = useHttp();
    const message = useMessage();
    const [editPost, setEditPost] = useState(false);
    
    useEffect( () => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const setLikeDislike = async(type) => {
        try {
            await request('/like/createLike', 'POST', {type: type, post_id: post.Post_data.post_id}, {'x-access-token': token})
        }
        catch (e) {}
    }

    if(!post) {
        return <p className="center">Post not found</p>
    }

   const likeDislikeHandler = (event) => {
        setLikeDislike(event.target.id)
   }

    const authorImage = "/image/getUserImage/" + post.Author_data.author_id;

    const ShowAuthorProfile = () => {
        history.push('/profile/' + post.Author_data.author_id)
    }

    const ShowPostsByCategory = (event) => {
        history.push('/home/1/' + event.target.childNodes[0].nodeValue)
    }

    const setEditPostOnTrue = () => {
        setEditPost(true)
    }

    const setEditPostOnFalse = () => {
        setEditPost(false)
    }


    return (
        <>
        { editPost ? (<div> 
            <EditPost setEditPostOnFalse={setEditPostOnFalse}/> 
        </div>) : 
        (<div className="center">
            <div className="col s4 m4">
                <div className="card">
                    <div className="CardTopBackgroud">
                        <div className="PostDate">
                            <div className="chip">
                                <span>Posted on: {post.Post_data.createdAt.split('T')[0]}</span>
                            </div>
                        </div>
                        <div className="PostAuthor">
                            <div className="chip" onClick={ShowAuthorProfile}>
                                <img src={authorImage} alt="Contact Person" />
                                {post.Author_data.real_name}
                            </div>
                        </div>
                        <div className="Categoies">
                        {
                            post.Categories_data.map((category, index) => {
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
                                <span className="card-title Title">{post.Post_data.title}</span>
                            </div>
                        </div>
                    </div>
                    {post.Author_data.author_id === userId ? 
                        <button className="btn-floating btn-large waves-effect waves-light red EditButtonPost" onClick={setEditPostOnTrue}> 
                                    <FiEdit2 className="FiEdit2Size"/>
                        </button> :
                        <></>
                    }
                    <div className="card-content CardContent blue darken-2">
                        <h3 className="white-text flow-text PostContent">{post.Post_data.content}</h3>
                        <div className="RatingChipBox">
                            <div className="RatingBox chip">
                                <div className="Like" id={1} onClick={likeDislikeHandler} >
                                    <FiArrowUp className="FiArrowDownFiArrowUpSize"/>
                                </div>
                                <div className="RatingContainer">
                                    <span className="flow-text">{post.Post_data.likes}</span>
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