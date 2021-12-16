import { useCallback, useState } from "react";

const storageName = 'userData'

export const useAuth = () => {
    const data = JSON.parse(localStorage.getItem('userData')) || [];
    const [token, setToken] = useState(null || data.token)

    const [userId, setUserId] = useState(null || data.userId);

    const [role, setRole] = useState(null || data.role);


    const login = useCallback( (jwtToken, Id, role) => {
        setToken(jwtToken);
        setUserId(Id);
        setRole(role);
        localStorage.setItem(storageName, JSON.stringify( {
            userId: Id, token: jwtToken, role: role
        }))
    }, []);

    const logout = useCallback( () => {
        setToken(null);
        setUserId(null);
        setRole(null);
        localStorage.removeItem(storageName);
    }, []);    

    // useEffect( () => {
    //     const data = JSON.parse(localStorage.getItem(storageName));
    //     if(data && data.token) {
    //         login(data.token, data.userId)
    //     }
    // }, [login]);


    return {token, login, logout, userId, role};
};