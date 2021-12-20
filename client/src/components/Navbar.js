import React, { useCallback, useContext, useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { FiSearch } from "react-icons/fi";
import { MdStars } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";

export const Navbar = () => {
    const [user, setUser] = useState();
    const {loading, request} = useHttp();
    const {userId, role} = useContext(AuthContext);
    const history = useHistory();
    const [SearchActive, setSearchActive] = useState(false);

    const setSearchActiveOnTrue = () => {
        setSearchActive(true)
    }

    const [form, setForm] = useState ( {
        SearchField: ''
    });

    const setSearchActiveOnFalse = () => {
        setSearchActive(false)
    }

    const chengeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    };

    const fetcheCategories = useCallback(async() => {
        try {
            const fetched = await request('/category/getCategories', 'GET', null)
            sessionStorage.setItem('categories', JSON.stringify(fetched))
        }
        catch (e) {}
    }, [request]);

    const RedirectSearchRes = () => {
        history.push('/home/1/!/' + form.SearchField)
        window.location.reload();
    }


    const fetcehUser = useCallback(async() => {
        const fetched = await request('/user/getUser/' + userId, 'GET', null)
        setUser(fetched)
    }, [userId, request]);

    useEffect( () => {
        if(!sessionStorage.getItem('categories'))
            fetcheCategories();
        fetcehUser()
    }, [fetcheCategories, fetcehUser]);

    const auth = useContext(AuthContext);

    const logoutHandler = event => {
        event.preventDefault();
        auth.logout();
        history.push('/')
    };

    useEffect(() => {
        window.M.Dropdown.init(document.getElementById('dropdown-trigger'), {inDuration: 300, outDuration: 225});
    })

    const keyDownCheck = (e) => {
        if(e.keyCode === 13) {
            RedirectSearchRes()
        }
    }

    useEffect(() => {
        const elem = document.getElementById('SearchField')
        if (elem) {
            elem.focus()
        }
            
    }, [SearchActive])

    if(loading || !JSON.parse(sessionStorage.getItem('categories')) || !user) {
        return <></>
    }
    const userAvater = "/image/getUserImage/" + userId;

    return (
        <div>
            <ul id="dropdown1" className="dropdown-content">
                    {JSON.parse(sessionStorage.getItem('categories')).map((category) => {
                        const link = "/home/1/" + category.category_title
                        return (
                            <li key={category.id}><NavLink to={link}>{category.category_title}</NavLink></li>
                        );
                    })}
            </ul>
            <nav>
                <div className="nav-wrapper blue darken-1 padingInNavbar">
                    <div className="searchBarWithLogoBox" hidden={SearchActive ? false : true}>
                        <NavLink to="/" className="Logo" >NiHelper</NavLink>
                        <div className="searchBarBox">
                            <div className="input-field">
                                <input 
                                    type="text"
                                    placeholder="Search" 
                                    id="SearchField" 
                                    name="SearchField" 
                                    className="searchBar yellow-input white-text" 
                                    onBlur={setSearchActiveOnFalse}
                                    onChange={chengeHandler}
                                    onKeyDown={keyDownCheck}
                                    /> 
                                    <label htmlFor="SearchField"></label>
                            </div>
                        </div>
                        <div className="SearchButton">
                            <i onClick={RedirectSearchRes}><FiSearch /></i>
                        </div>
                    </div>
                    <div hidden={SearchActive}>
                        <NavLink to="/" className="Logo">NiHelper</NavLink>
                        <NavLink to="/profile" className="chip ChipCustom">
                            <img src={userAvater} alt="avatar" width="50" height="50"/>
                            <div className="UserInfoNavbar">{user.login}</div>
                            {user.role.localeCompare("admin") === 0 ?
                                <MdStars className="UserInfoNavbarIcon" />:
                                <></>
                            }
                        </NavLink>
                        <ul id="nav-mobile" className="right">
                            <li><i onClick={setSearchActiveOnTrue}><FiSearch /></i></li>
                            {(role && role.localeCompare('admin') === 0) ? <li><NavLink to="/register">Create new user</NavLink></li> : <></>}
                            <li><a className="dropdown-trigger" href="/" data-target="dropdown1" id="dropdown-trigger">Categories<MdKeyboardArrowDown  className="FiArrowDownNavBarDropDown"/></a></li>
                            {(role && role.localeCompare('company') === 0) ? <li><NavLink to="/create">Create event</NavLink></li> : <></>}
                            <li><a className="blue darken-3" href="/home" onClick={logoutHandler}>Logout</a></li>
                        </ul>
                    </div>
                    
                </div>
            </nav>
        </div>
    );
}
