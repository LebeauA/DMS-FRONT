import React, { Component } from 'react'
import { MDBDataTable } from 'mdbreact'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import '../assets/css/DocumentList.min.css'
import Loader from '../assets/images/Blocks-1s-200px.gif'
import '../assets/css/loader.min.css'




class DocumentList extends Component{

    constructor(props){
        super(props)
        this.state = {
            datatable : [],
            auth : localStorage.getItem('auth'),
            projectId : this.props.location.state.projectId,
            projectName : this.props.location.state.projectName,
            moveToDocumentPage: false,
            uriDocument : '',
            uriOriginalDocument : '',
            documentTitle : '',
            documentStatus : '',
            documentId : '',
            loadingData : 'true',

        }
        this.handleClick = this.handleClick.bind(this);

    }
    handleClick(uriDocument, uriOriginalDocument, documentTitle, documentStatus, documentId){
        this.setState({
            moveToDocumentPage: true,
            uriDocument : uriDocument,
            uriOriginalDocument : uriOriginalDocument,
            documentTitle : documentTitle,
            documentStatus : documentStatus,
            documentId : documentId,
        });

    }


    fetchMyProjects(){
        let self = this


        axios.get(process.env.REACT_APP_URL_PROJECT + "/DocumentsList/"+ self.state.projectId +"?_format=json",{
          headers : {"Authorization":"Basic " + self.state.auth}
        })
        .then(response => {
            console.log(response);
            let tmpRows={};
            let tmpDatas=[];
            response.data.forEach(element => {
                tmpRows={};
                if(element.title.value !== ''){
                    tmpRows.clickEvent = () => self.handleClick(element.uri, element.uri_1, element.title, element.field_status, element.nid)
                    tmpRows.documentName = element.title;
                    tmpRows.documentStatus = element.field_status;
                }
                tmpDatas.push(tmpRows);
            })


            this.setState({
                dataTable : {
                    columns: [
                    {
                        label: 'Document Name',
                        field: 'documentName',
                        sort: 'asc',
                        width: 270,
                    },
                    {
                        label: 'Document Status',
                        field: 'documentStatus',
                        sort: 'asc',
                        width: 270
                    }
                    ],
                    rows: tmpDatas
                },
                loadingData : false,
            })
        })
        .catch(error => {
            console.log(error)
        });
    }
    componentDidMount(){
        this.fetchMyProjects();
    };



    render(){


        return(
            this.state.moveToDocumentPage ? <Redirect to = {{
                pathname: '/DocumentPage',
                state : { 
                    uriDocument : this.state.uriDocument,
                    uriOriginalDocument : this.state.uriOriginalDocument,
                    documentTitle : this.state.documentTitle,
                    documentStatus : this.state.documentStatus,
                    documentId : this.state.documentId,
                 }
    
            }} /> :
            this.state.loadingData ? 
                <div className="loaderDiv">
                    <img className="loader" src={ Loader } alt="loading-logo"></img>
                </div>
                :
                <>
                    <h1 className='title'>Documents List : { this.state.projectName } </h1>
                    <MDBDataTable
                    striped
                    bordered
                    hover
                    responsive
                    data={this.state.dataTable}
                    />
                </>
        );
    };
};

export default DocumentList;