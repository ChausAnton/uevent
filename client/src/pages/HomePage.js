import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHttp } from '../hooks/http.hook';
import {AuthContext} from '../context/AuthContext'
import { Loader } from '../components/Loader';
import { PostsList } from '../components/PostsList';
import { useParams } from "react-router-dom";


export const HomePage = () => {
    const {page, category, SearchField} = useParams();
    const [posts, setPosts] = useState();
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
            const fetched = await request('/post/getPostPerPage' + UrlParams, 'GET', null, {
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
            {!loading && <PostsList posts={posts} category={category} SearchField={SearchField}/>}
        </>
    );
}