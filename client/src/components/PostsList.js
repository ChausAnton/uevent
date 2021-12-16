import React, { useContext } from "react";
import { Link, useHistory} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { FiArrowRight, FiArrowLeft} from "react-icons/fi";

export const PostsList = ({posts, category, SearchField}) => {
    const history = useHistory();
    const {role, token} = useContext(AuthContext);
    const {request} = useHttp();
    if(!posts) {
        return <p className="center">Posts not found</p>
    }
    if(!category)
        category = "";

    const openUser = (event) => {
        event.preventDefault();
        history.push('/profile/' + event.target.id)
    }

    const postToActiveInactive = async(event) => {
        event.preventDefault();
        try {
            const toStatus = event.target.innerText.split(' ')[1]
            await request('/post/updatePost/' + event.target.id, 'PUT', {status: toStatus}, {'x-access-token': token})
            window.location.reload();
        }
        catch (e) {}
    }

    const postsPerPage = 2
    const numberOfPages = (posts.postsCount % postsPerPage) === 0 ? (posts.postsCount / postsPerPage) : parseInt((posts.postsCount / postsPerPage) + 1);
    let nextPage = (parseInt(posts.CurPage) + 1) <= numberOfPages ? `/home/${(parseInt(posts.CurPage) + 1)}` : `/home/${numberOfPages}`;
    let prevPage = (parseInt(posts.CurPage) - 1) > 0 ? `/home/${(parseInt(posts.CurPage) - 1)}` :  `/home/1`;
    if(category) {
        nextPage += '/' + category;
        prevPage += '/' + category;
    }
    if(SearchField) {
        nextPage += '/' + SearchField;
        prevPage += '/' + SearchField;
    }
    return (
        <div>
            { posts.posts.map((post) => {
                return (
                    <Link key={post.id} to={`/detail/${post.id}`}>
                        <div>
                            <div className="divider"></div>
                            <div className="section">
                                <div className="card-panel blue darken-1 hoverable">
                                    <div className="CardContentBox">
                                        <div className="PostContentBox">
                                            <div className="PostTitleBox">
                                                <h3 className="white-text">{post.title}</h3>
                                            </div>
                                            <div className="PostContentBox">
                                                <p className="white-text flow-text">{post.content}</p>
                                            </div>
                                        </div>
                                        <div className="PostInforBox">
                                            <div className="ChipPostUserBox">
                                                <div className="chip UserChipBox" onClick={openUser} id={post.author_id}>
                                                    <img src={`/image/getUserImage/${post.author_id}`} alt="Contact Person" />
                                                    {post.real_name}
                                                </div>
                                            </div>
                                            <div className="ChipPostDateBox">
                                                <div className="chip DateChipBox">
                                                    Posted on: {post.createdAt.split("T")[0]}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    {(role && role.localeCompare('admin') === 0) ? 
                                        <><div className="chip">
                                            Status: {post.status}
                                        </div>
                                        {(post.status && post.status.localeCompare('active') === 0) ? 
                                            <div className={"chip " + post.status} onClick={postToActiveInactive} id={post.id}>
                                                to inactive
                                            </div>
                                            :
                                            <div className={"chip " + post.status} onClick={postToActiveInactive} id={post.id}>
                                                to active
                                            </div>
                                        }</>
                                         : <></>
                                    }
                                    
                            </div>
                        </div>
                    </Link>
                )
                }) }
            <ul className="pagination">
                <li className="disabled"><a href={prevPage}><FiArrowLeft /></a></li>
                {Array.from({length: numberOfPages}, (_, i) => i + 1).map((page) => {
                    let UrlParams = '/home/' + page;
                    if(category)
                        UrlParams += '/' + category;
                    if(SearchField) 
                        UrlParams += '/' + SearchField;
                    if(parseInt(posts.CurPage) === page) {
                        return (
                            <li key={page} className="active"><a href={UrlParams}>{page}</a></li>
                        );
                    }
                    return (
                        <li key={page} className="waves-effect"><a href={UrlParams}>{page}</a></li>
                    );

                    })
                }
                <li className="waves-effect"><a href={nextPage}><FiArrowRight /></a></li>
            </ul>
        </div>
    );
};