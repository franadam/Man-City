import React, { Component } from 'react';
import FileUploader from 'react-firebase-file-uploader';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';

import { firebase } from '../../firebase';
import Spinner from '../Spinner/Spinner'

import classes from './uploader.module.css';
import classesForm from '../formField/forrmField.module.css'

class Uploader extends Component {
  state = {
    name: '',
    isUploading: false,
    fileURL: ''
  }

  static getDerivedStateFromProps(props, state) {
    if (props.defaultImage) {
      return state = {
        name: props.defaultImageName,
        fileURL: props.defaultImage
      }
    }
    return null;
  }

  uploadStartHandler = () => {
    this.setState({
      isUploading: true
    })
  }

  UploadErrorHandler = () => {
    this.setState({
      isUploading: false
    })
  }

  UploadSuccessHandler = async (filename) => {
    this.setState({
      name: filename,
      isUploading: false
    });
    console.log(filename);
    const url = await firebase.storage().ref(this.props.dir)
                        .child(filename).getDownloadURL();
    this.setState({
      fileURL: url
    });
    console.log(url);
    this.props.fileName(filename);
  }

  uploadAgain = () => {
    this.setState({
      name: '',
      isUploading: false,
      fileURL: ''
    });

    this.props.resetImage();
  }

  removeImage = () => {
    firebase.storage().ref(this.props.dir)
      .child(this.state.name).delete().then(() => {
        console.log('File deleted successfully');
      }).catch((error) => {
        console.log('Uh-oh, an error occurred!', error);
      });
    
    this.uploadAgain();
  }

  render() {

    let upload = (
      <CustomUploadButton 
        accept='image/*'
        name='image'
        randomizeFilename
        storageRef={firebase.storage().ref(this.props.dir)}
        onUploadStart={this.uploadStartHandler}
        onUploadError={this.UploadErrorHandler}
        onUploadSuccess={this.UploadSuccessHandler}
        className={classes.btn}
        >
          Choose a file
      </CustomUploadButton>
    )

    if (this.state.isUploading) {
      upload = <Spinner />
    };

    if (this.state.fileURL) {
      upload = (
        <div className={classes.imageContainer}>
          <img src={this.state.fileURL} alt={this.state.name} className=""/>
          <div className={`${classes.btn} ${classes.btnImage}`} onClick={() => this.removeImage()}>Remove</div>
        </div>
      )
    };

    return (
      <React.Fragment>
        <label className={classes.label}>{this.props.tag}</label>
        {upload}
      </React.Fragment>
    )
  }
}

export default Uploader;