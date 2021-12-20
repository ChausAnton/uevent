import React, { useContext, useState, useCallback, useEffect } from 'react';
import { Loader } from '../components/Loader';
import { Profile } from '../components/Profile';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useParams } from "react-router-dom";

export const ProfilePage = () => {
    const [user, setUser] = useState();
    const [events, setPosts] = useState();
    const {loading, request} = useHttp();
    const {userId, token, role} = useContext(AuthContext);
    const {id} = useParams();

    const fetchUser = useCallback(async() => {
        try {
            let fetched;
            if(id)
                fetched = await request('/user/getUser/' + id, 'GET', null)
            else 
                fetched = await request('/user/getUser/' + userId, 'GET', null)
            setUser(fetched)
        }
        catch (e) {}
    }, [userId, request, id]);

    const fetchPosts = useCallback(async() => {
        try {
            let fetched;
            
            if(id && role.localeCompare('company') === 0)
                fetched = await request('/event/getEventsForUser/' + id, 'GET', null, {'x-access-token': token})
            else if(role.localeCompare('company') === 0)
                fetched = await request('/event/getEventsForUser/' + userId, 'GET', null, {'x-access-token': token})
            else if(role.localeCompare('company') !== 0)
                fetched = await request('/subscribe/getAllSubsForUser', 'GET', null, {'x-access-token': token})

            setPosts(fetched)
        }
        catch (e) {}
    }, [userId, request, id, token]);

    useEffect( () => {
        fetchUser();
        fetchPosts();
    }, [fetchUser, fetchPosts]);

    if(loading) {
        return <Loader />
    }

    return (
        <>
            {!loading && <Profile user={user} events={events}/>}
        </>
    );

}