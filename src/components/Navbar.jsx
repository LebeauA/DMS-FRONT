import React, { Component } from 'react';
import "../assets/css/App.min.css"
import "../assets/css/navBar.min.css"
import { NavLink } from 'react-router-dom';
import axios from 'axios';


class Navbar extends Component{

  logout(){
    axios.defaults.withCredentials=true;
    axios.post(process.env.REACT_APP_URL_PROJECT + "/user/logout?_format=json&token="+localStorage.getItem('logout_token'),{
     withCredentials:true
    })
    .then(() => {
      localStorage.clear();
      window.location.reload();
    })
    .catch((error) => {
        console.log(error);
    });   
    localStorage.clear();
    window.location.reload();
  }

  render(){
    return(
      <div className="Navbar">
        <nav className="disFlex navbar navbar-expand-lg navbar-dark bg-primary">
            <NavLink className="navbar-brand" to="/">Druact Project</NavLink>
            <div className="collapse navbar-collapse" id="navbarColor01">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">Home</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/MyProjects">My projects</NavLink>
                </li>
              </ul>
            </div>
            <div className="divUserLogout">
              <span className="welcomeUser text-secondary">Welcome, { localStorage.getItem('username') }</span>
              <button type="button" className="btn btn-outline-secondary" onClick={ this.logout }>Logout</button>
            </div>  
          </nav>
      </div>
    );
  };
};

export default Navbar;
