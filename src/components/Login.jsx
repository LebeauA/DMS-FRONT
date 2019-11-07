import React, { Component } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faUser as fasUser, faLock } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify';
import MainApp from './MainApp'
import 'react-toastify/dist/ReactToastify.css';
import "../assets/css/Login.min.css"


toast.configure();


class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            name : '',
            pass : '',
            isLoggedIn : false
        }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleChange(event){
        let key = event.target.name 
        let value = event.target.value
        this.setState({
            [key] : value
        })
    }
    
    handleSubmit(event){
        event.preventDefault();
        let self = this;
        axios.defaults.withCredentials=false;
        axios.post(process.env.REACT_APP_URL_PROJECT + "/user/login?_format=json" , {
            name : this.state.name,
            pass : this.state.pass,
            withCredentials:false,
        })
        .then((response) => {
            console.log(response)
            localStorage.setItem('username', response.data.current_user.name);
            localStorage.setItem('uid', response.data.current_user.uid);
            localStorage.setItem('csrf_token', response.data.csrf_token);
            localStorage.setItem('logout_token', response.data.logout_token);
            localStorage.setItem('auth', window.btoa(self.state.name + ':' + self.state.pass));
            self.setState({
                isLoggedIn : true,
            })
        })
        .catch((error) => {
            console.log(error.response);
            let errorMessage = error.response.data.message
            toast.error('🚫'+ errorMessage, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
            });
        
            localStorage.clear();
        });

    }
    

    render(){
        return(
            this.state.isLoggedIn?<MainApp/>:

  
            <div className="backgroundLogin center">

                <form onSubmit={this.handleSubmit} className="formLogin borderRadius">

                    <div className="DivIconUser center">
                        <FontAwesomeIcon className="iconUser" icon={ faUser } />
                    </div>
                    <p className="text-primary connection"><span>Sign In</span></p>
                    <div className="form-group inputform row">
                        <div className="form-group">
                            <input name="name" value={this.state.name} onChange={this.handleChange} type="username" className="form-control borderRadius inputField" id="exampleInputUsername" required placeholder="Username"/>
                            <FontAwesomeIcon className="iconForm" icon={ fasUser }/>
                        </div>
                        <div className="form-group">
                            <input name="pass" value={this.state.pass} onChange={this.handleChange} type="password" className="form-control borderRadius inputField" id="exampleInputPassword1" required placeholder="Password"/>
                            <FontAwesomeIcon className="iconForm" icon={ faLock }/>
                        </div>
                    </div>
                    <button type="submit"  className="btn btn-lg btn-primary borderRadius">Login</button>
                    <div className="form-group messages">
                        <p className="error">{this.state.error}</p>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;
