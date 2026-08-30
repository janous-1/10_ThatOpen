import * as React from "react";
import * as Router from "react-router-dom";

export function Sidebar() {
    return (
        <aside id="sidebar">
            <img src="./assets/company-logo.svg" alt="Construction Company" />
            <ul id="nav-buttons">
                <Router.Link to="/">
                    <li id ="projects-nav-btn"><span className="material-icons-round">home</span>Projects</li>
                </Router.Link>
                <Router.Link to="/users">
                    <li id = "users-nav-btn"><span className="material-icons-round">people</span>Users</li>
                </Router.Link>
            </ul>
        </aside>
    )
}