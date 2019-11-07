import React, { Component } from 'react'
import '../assets/css/DocumentPage.min.css'
import axios from 'axios'
import { MDBDataTable } from 'mdbreact'
import Loader from '../assets/images/Blocks-1s-200px.gif'
import '../assets/css/loader.min.css'



class DocumentPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            datatable : [],
            auth : localStorage.getItem('auth'),
            uriDocument : this.props.location.state.uriDocument,
            uriOriginalDocument : this.props.location.state.uriOriginalDocument,
            documentTitle : this.props.location.state.documentTitle,
            documentStatus : this.props.location.state.documentStatus,
            documentId : this.props.location.state.documentId,
            loadingData : 'true',
        }
    }
    fetchDocument(){
        let self = this
        axios.get(process.env.REACT_APP_URL_PROJECT + '/commentsDoc/' + self.state.documentId + '?_format=json',{
            headers : {"Authorization":"Basic " + self.state.auth}
        })
        .then(response =>{
            let tmpRows={};
            let tmpDatas=[];
            response.data.forEach(element => {
                if(element.title.value !== ''){
                    tmpRows.commentTitle = element.title;
                    tmpRows.commentDescription = element.body;
                }
                tmpDatas.push(tmpRows);
            });

            this.setState({
                dataTable : {
                    columns: [
                    {
                        label: 'Comment title',
                        field: 'commentTitle',
                        sort: 'asc',
                        width: 270
                    },
                    {
                        label: 'Comment description',
                        field: 'commentDescription',
                        sort: 'asc',
                        width: 270
                    }
                    ],
                    rows: tmpDatas
                },
                loadingData : false,

            })


        })
        .catch(error =>{
            console.log(error)
        })
    }

    componentDidMount(){
        this.fetchDocument();
    };


    render(){
        return(
            this.state.loadingData ?
            <div className="loaderDiv">
                <img className="loader" src={ Loader } alt="loading-logo"></img>
            </div>
            :
            <>
                <h1 className="title">Document Page</h1>
                <div className="contentComment">
                    <div className="flexColCenter">
                        <iframe src={this.state.uriDocument} width="500" height="400"></iframe>
                        <a href={ this.state.uriOriginalDocument } className="btn btn-info">Download original document</a>
                    </div>
                    <div className="flexColCenter datatableContent">
                        <p>Document name : { this.state.documentTitle }</p>
                        <p>Document Status : { this.state.documentStatus }</p>
                        <div className="datatable">
                            <MDBDataTable
                                striped
                                bordered
                                hover
                                responsive
                                data={this.state.dataTable}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default DocumentPage;