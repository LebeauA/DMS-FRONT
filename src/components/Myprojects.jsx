import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import "../assets/css/Myprojects.min.css";
import Loader from '../assets/images/Blocks-1s-200px.gif'
import '../assets/css/loader.min.css'






export default class Myprojects extends Component{
    constructor(props){
        super(props)
        this.state={
            dataTable : [],
            auth : localStorage.getItem('auth'),
            moveToDocumentList: false,
            projectId : "",
            projectName : "",
            loadingData : 'true',

        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(projectId, projectName){
        this.setState({
            moveToDocumentList: true,
            projectId : projectId,
            projectName : projectName
        });
    }
    fetchMyProjects(){
        let self = this
        axios.get(process.env.REACT_APP_URL_PROJECT + "/projects/myProjects?_format=json",{
          headers : {"Authorization":"Basic " + self.state.auth}
        })
        .then(response => {
            let tmpRows={};
            let tmpDatas=[];
            response.data.forEach(element => {
                tmpRows={};
                tmpRows.clickEvent = () => self.handleClick(element.nid[0].value, element.title[0].value)
                tmpRows.projectNumber = element.field_project_number[0].value;
                if(element.title[0].value !== ''){
                    tmpRows.projectName = element.title[0].value;
                }
               
                tmpDatas.push(tmpRows);
            })
            this.setState({
                dataTable : {
                    columns: [
                    {
                        label: 'Project N°',
                        field: 'projectNumber',
                        sort: 'asc',
                        width: 150
                    },
                    {
                        label: 'Project Name',
                        field: 'projectName',
                        sort: 'asc',
                        width: 270
                    },
                    ],
                    rows: tmpDatas
                },
                loadingData : false,

            })
        })
        .catch(error => {
            console.log(error)
        })
    }
    componentDidMount(){
        this.fetchMyProjects();
    };



    render(){
        return(
        this.state.moveToDocumentList ? <Redirect to = {{
            pathname: '/DocumentList',
            state : { 
                projectId : this.state.projectId,
                projectName : this.state.projectName
             }
        }}
        /> :
        this.state.loadingData ?
        <div className="loaderDiv">
            <img className="loader" src={ Loader } alt="loading-logo"></img>
        </div>
        :

        <>  
            <h1 className="myProjectsTitle">My Projects</h1>
            <MDBDataTable
                striped
                bordered
                hover
                responsive
                data={this.state.dataTable}
            />
        </>            
        );
    }
}