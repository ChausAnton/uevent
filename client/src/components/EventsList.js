import React, { useContext } from "react";
import { Link, useHistory} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { FiArrowRight, FiArrowLeft} from "react-icons/fi";

export const EventsList = ({events, category, SearchField}) => {
    const history = useHistory();
    const {role, token} = useContext(AuthContext);
    const {request} = useHttp();
    if(!events) {
        return <p className="center">Events not found</p>
    }
    if(!category)
        category = "";

    const openUser = (event) => {
        event.preventDefault();
        history.push('/profile/' + event.target.id)
    }

    const eventToActiveInactive = async(event) => {
        event.preventDefault();
        try {
            const toStatus = event.target.innerText.split(' ')[1]
            await request('/event/updateEvent/' + event.target.id, 'PUT', {status: toStatus}, {'x-access-token': token})
            window.location.reload();
        }
        catch (e) {}
    }

    const eventsPerPage = 2
    const numberOfPages = (events.eventsCount % eventsPerPage) === 0 ? (events.eventsCount / eventsPerPage) : parseInt((events.eventsCount / eventsPerPage) + 1);
    let nextPage = (parseInt(events.CurPage) + 1) <= numberOfPages ? `/home/${(parseInt(events.CurPage) + 1)}` : `/home/${numberOfPages}`;
    let prevPage = (parseInt(events.CurPage) - 1) > 0 ? `/home/${(parseInt(events.CurPage) - 1)}` :  `/home/1`;
    if(category) {
        nextPage += '/' + category;
        prevPage += '/' + category;
    }
    if(SearchField) {
        nextPage += '/' + SearchField;
        prevPage += '/' + SearchField;
    }
    console.log(events)
//    event date: {event.Event_data.eventDate.split('T')[0]}

    return (
        <div>
            { events.events.map((event) => {
                return (
                    <Link key={event.id} to={`/detail/${event.id}`}>
                        <div>
                            <div className="divider"></div>
                            <div className="section">
                                <div className="card-panel blue darken-1 hoverable">
                                    <div className="CardContentBox">
                                        <div className="PostContentBox">
                                            <div className="PostTitleBox">
                                                <h3 className="white-text">{event.title}</h3>
                                            </div>
                                            <div className="PostContentBox">
                                                <p className="white-text flow-text">{event.content}</p>
                                            </div>
                                        </div>
                                        <div className="PostInforBox">
                                            <div className="ChipPostUserBox">
                                                <div className="chip UserChipBox" onClick={openUser} id={event.author_id}>
                                                    <img src={`/image/getUserImage/${event.author_id}`} alt="Contact Person" />
                                                    {event.real_name}
                                                </div>
                                            </div>
                                            <div className="ChipPostDateBox">
                                                <div className="chip DateChipBox">
                                                    event date: {event.eventDate.split('T')[0]}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    {(role && role.localeCompare('admin') === 0) ? 
                                        <><div className="chip">
                                            Status: {event.status}
                                        </div>
                                        {(event.status && event.status.localeCompare('active') === 0) ? 
                                            <div className={"chip " + event.status} onClick={eventToActiveInactive} id={event.id}>
                                                to inactive
                                            </div>
                                            :
                                            <div className={"chip " + event.status} onClick={eventToActiveInactive} id={event.id}>
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
                    if(parseInt(events.CurPage) === page) {
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