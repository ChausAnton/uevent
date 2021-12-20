import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import {AuthContext} from '../context/AuthContext'
import { Loader } from '../components/Loader';
import { EventsList } from '../components/EventsList';
import { useParams } from "react-router-dom";


export const HomePage = () => {
    const {page, category, SearchField} = useParams();
    const [events, setPosts] = useState();
    const {loading, request} = useHttp();
    const {token} = useContext(AuthContext);

    const fetchPosts = useCallback(async() => {
        try {
            let UrlParams = '/1';
            if(page)
                UrlParams = '/' + page;
            if(category)
                UrlParams += '/' + category;
            if(SearchField) 
                UrlParams += '/' + SearchField;
            const fetched = await request('/event/getEventPerPage' + UrlParams, 'GET', null, {
                'x-access-token': token
            })
            setPosts(fetched)
        }
        catch (e) {}
    }, [token, request, page, category, SearchField]);

    useEffect( () => {
        fetchPosts();
    }, [fetchPosts]);

    if(loading) {
        return <Loader />
    }

    return (
        <>
            {!loading && <EventsList events={events} category={category} SearchField={SearchField}/>}
        </>
    );
}