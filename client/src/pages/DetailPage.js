import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useHttp } from '../hooks/http.hook';
import {AuthContext} from '../context/AuthContext'
import { Loader } from '../components/Loader';
import { PostDetail } from '../components/PostDetail';


export const DetailPage = () => {
    const {id} = useParams();

    const [post, setPost] = useState();
    const [comments, setComments] = useState();

    const {loading, request} = useHttp();
    const {token} = useContext(AuthContext);

    const fetchPost = useCallback(async() => {
        try {
            const posts = await request('/post/getPostDetail/' + id, 'GET', null, {
                'x-access-token': token
            })
            setPost(posts)
            const Comments = await request('/comment/getCommentsForPost/' + id, 'GET', null, {
                'x-access-token': token
            })
            setComments(Comments)
        }
        catch (e) {}
    }, [token, id, request]);

    useEffect( () => {
        fetchPost();
    }, [fetchPost]);

    if(loading) {
        return <Loader />
    }
    
    return (
        <>
            {!loading && <PostDetail post={post} commentsData={comments}/>}
        </>
    );
}