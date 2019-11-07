import React, { Component } from 'react';
import axios from 'axios';
import "../assets/css/ProjectsList.min.css"
import { MDBDataTable } from 'mdbreact';
import { Redirect } from 'react-router-dom';
import Loader from '../assets/images/Blocks-1s-200px.gif'
import '../assets/css/loader.min.css'



export default class ProjectsList extends Component {
    constructor(props){
        super(props);
        this.state={
            auth : localStorage.getItem('auth'),
            dataProjects : [],
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

    fetchAllProjects(){
        let self = this
        axios.get(process.env.REACT_APP_URL_PROJECT + "/jsonapi/node/project",{
            headers: {"Authorization":"Basic " + this.state.auth}
        })
        .then(function (response){
            let tmpDatas = []
            let tmpRows = {}
            response.data.data.forEach(element => {
                tmpRows = {}
                tmpRows.clickEvent = () => self.handleClick(element.attributes.drupal_internal__nid, element.attributes.title)
                tmpRows.projectNumber = element.attributes.field_project_number
                tmpRows.projectName = element.attributes.title
                tmpDatas.push(tmpRows);
            });
            self.setState({
                dataProjects : {
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
        .catch(function(error){
            console.log(error);
        })   
    }

    componentDidMount(){
        this.fetchAllProjects();
    }
    


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
                <h1 className="Projects-title">Projects List</h1>
                <MDBDataTable
                    striped
                    bordered
                    hover
                    data={this.state.dataProjects}
                />
            </>       
        )
    }
}