import React from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from './Login'
import Navbar from './Navbar'
import ProjectList from './ProjectsList'
import Myprojects from './Myprojects'
import DocumentList from './DocumentList'
import DocumentPage from './DocumentPage'

  
function MainApp(){
    let auth = localStorage.getItem('auth') || null;
    if(auth === null){
        return <Login/>
    }
    else{
        return(
            <Router>
                <Navbar/>
                <Route exact path="/" component={ ProjectList } />
                <Route path="/MyProjects" component={ Myprojects } />
                <Route path="/DocumentList" component={ DocumentList }/>
                <Route path="/DocumentPage" component={ DocumentPage }/>
            </Router>
        )
    }
}

export default MainApp