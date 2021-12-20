import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useHttp } from '../hooks/http.hook';
import {AuthContext} from '../context/AuthContext'
import { Loader } from '../components/Loader';
import { EventDetail } from '../components/EventDetail';


export const DetailPage = () => {
    const {id} = useParams();

    const [event, setPost] = useState();
    const [comments, setComments] = useState();

    const {loading, request} = useHttp();
    const {token} = useContext(AuthContext);

    const fetchPost = useCallback(async() => {
        try {
            const events = await request('/event/getEventDetail/' + id, 'GET', null, {
                'x-access-token': token
            })
            setPost(events)
            const Comments = await request('/comment/getCommentsForEvent/' + id, 'GET', null, {
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
            {!loading && <EventDetail event={event} commentsData={comments}/>}
        </>
    );
}