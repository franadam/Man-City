import React, { Component } from 'react'
import { connect } from 'react-redux';

import AdminLayout from '../../../../hoc/admin/admin_layout'
import FormField from '../../../../UI/formField/formField';
import Spinner from '../../../../UI/Spinner/Spinner';
import Uploader from '../../../../UI/Uploader/Uploader';

import classes from '../../Matches/AddEditMatch/AddEditMatch.module.css';

import {validate, firebaseLooper} from '../../../../shared/utils';
import { firebase, firebaseDB, firebasePlayers } from '../../../../firebase'

class AddEditPlayer extends Component {

  state = {
    isLoading: true,
    playerId: '',
    formType: '',
    formError: false,
    formSuccess: '',
    defaultImage : '',
    formData: {
      image: {
        element: 'image',
        value: '',
        validation : {
          required: true,
        },
        valid: false,
        validationMessage: '',
        touched: false,
      },
      name: {
        element: 'input',
        value: '',
        config: {
          name: 'player firstname',
          type: 'text',
          placeholder: 'Enter the player firstname',
        },
        validation : {
          required: true,
        },
        valid: false,
        validationMessage: '',
        touched: false,
      },
      lastname: {
        element: 'input',
        value: '',
        config: {
          name: 'player lastname',
          type: 'text',
          placeholder: 'Enter the player lastname',
        },
        validation : {
          required: true,
        },
        valid: false,
        validationMessage: '',
        touched: false,
      },
      number: {
        element: 'input',
        value: '',
        config: {
          name: 'player number',
          type: 'number',
          placeholder: 'Enter the player number',
        },
        validation : {
          required: true,
          positive: true
        },
        valid: false,
        validationMessage: '',
        touched: false,
      },
      position: {
        element: 'select',
        value: '',
        config: {
          name: 'position',
          type: 'select',
          options: [
            {key:'Keeper', value:'Keeper'},
            {key:'Defence', value:'Defence'},
            {key:'Midfield', value:'Midfield'},
            {key:'Striker', value:'Striker'}
          ]
        },
        validation : {
          required: true,
        },
        valid: false,
        validationMessage: '',
        touched: false,
      }
    }
  }

  componentDidMount() {
    this.playerHander();
    setTimeout(() => {
      console.log(this.state);
    }, 6000);
    this.setState({
      isLoading: false
    })
  }

  playerHander = async () => {
    const playerId = this.props.match.params.id;

    if (!playerId) {
      this.setState({
          formType:'Add player'
      })
      this.addPlayer(playerId)
    } else {
      this.fecthPlayer(playerId);
    }
  }

  fecthPlayer = async (id) => {
    const snapshot = await firebaseDB.ref(`players/${id}`).once('value');
    const player = snapshot.val();
    const type = 'Edit Player';
      try {
      const url = await firebase.storage().ref('players').child(player.image).getDownloadURL();
      this.updateFields(player, id, type, url)
    } catch (error) {
      this.updateFields({
          ...player,
          image:''
      },id, type,'')      
    } 
  }

  addPlayer = async (id) => {
    const newFormData = {...this.state.formData};
    const player = {};
    for (let key in newFormData) {
      player[key] = newFormData[key].value;
    };
    const type = 'Add Match';
    this.updateFields(player, id, type);
  }

  updateFields = (player, playerId, formType, defaultImage) => {
    const newFormData = {...this.state.formData};

    for (let key in newFormData) {
      newFormData[key].value = player[key];
      newFormData[key].valid = true;
    }

    this.setState({
      formData: newFormData,
      playerId,
      defaultImage,
      formType,
    })
  }

  formfieldHandler = (element, content='') => {
    const newFormData = {...this.state.formData};
    const newElement = {...newFormData[element.id]};
    if (content === '') {
      newElement.value = element.event.target.value;
    } else {
      newElement.value = content;
    }

    const [valid, validationMessage] = validate(newElement);
    newElement.valid = valid;
    newElement.validationMessage = validationMessage;

    newFormData[element.id] = newElement;

    this.setState({
      formData: newFormData,
      formError: false
    })
  }

  formHandler = (event) => {
    event.preventDefault();

    const dataToSubmit = {};
    let isValid = true;
    
    for (let key in this.state.formData) {
      dataToSubmit[key] = this.state.formData[key].value;
      isValid = isValid && this.state.formData[key].valid;
    };

    if (isValid) {
      if (this.state.formType === 'Edit Player') {
        firebaseDB.ref(`players/${this.state.playerId}`)
        .update(dataToSubmit).then(()=>{
          this.formSuccesManager('Update correctly');
          this.props.history.push('/admin_players')
          }).catch(e=>{
          this.setState({formError: true})
        })
      } else {
        firebasePlayers
          .push(dataToSubmit)
          .then(() => {
            this.props.history.push('/admin_players')
          })
          .catch(error => {
            console.log(error);
            this.setState({
              formError: true
            })
          })
      }
      
    }

    else {
      this.setState({formError: true})
      console.log('ERROR');
    }
    
  }
  
  formSuccesManager = message => {
    this.setState({
      formSuccess: message
    });

    this.clearSuccesMessage();
  }

  clearSuccesMessage = () => {
    setTimeout(() => {
      this.setState({formSuccess: ''})
    }, 2000)
  }
  
  resetImage = () => {
    const newFormData = {...this.state.formData};
    console.log(newFormData['image']);
    newFormData['image'].value = '';
    newFormData['image'].valid = false;
    this.setState({
      defaultImage: '',
      formData: newFormData
    })
  }

  storeFileName = fileName => {
    this.formfieldHandler({id: 'image'}, fileName)
  }
  
  render() {

    let errorMessage = (<div className={classes.error}>
      {
        !this.props.isAuthenticated && this.state.formError
          ? `${this.state.formError}`
          : null
      }
      </div>);
    
    let formErrorMessage = (<div className={classes.error}>
      {
        this.state.formError 
          ? `${this.state.formError} Someting went wrong`
          : null
      }
      </div>);

    const formElementsArray = [];
    for (let key in this.state.formData) {
      if (this.state.formData[key].config) {
        formElementsArray.push({
          id: key,
          config: this.state.formData[key]
        });
      }
    };

    const formularField = formElementsArray.map(elem => (
      <React.Fragment key={elem.id}>
        <label htmlFor={elem.id} className={classes.label}>{elem.config.config.name.split('_').join(' ')}</label>
        <FormField 
          id={elem.id}
          formData={this.state.formData[elem.id]}
          change = {(event) => this.formfieldHandler(event)}
        /> 
      </React.Fragment>));

    let image = (
      <Uploader
        dir="players"
        tag={'Player Image'}
        defaultImage={this.state.defaultImage}
        defaultImageName={this.state.formData.image.value}
        resetImage={()=>this.resetImage()}
        fileName={(fileName) => this.storeFileName(fileName)}
      />
    );

    let form = (      
      <form className={classes.form} onSubmit={(event) => this.formHandler(event)}>
        {image}
        {formularField}
        <button type='submit' className={classes.btn} onClick={(event) => this.formHandler(event)}>submit</button>
        {formErrorMessage}
        <div className={classes.success_label}>{this.state.formSuccess}</div>
      </form>
    );
    
    if (this.state.isLoading) {
      form = <Spinner />
    };

    return (
      <AdminLayout>
      <div className={classes.main}>
        <h2 className={classes.title}>{this.state.formType}</h2>
        {form}
        {errorMessage}
      </div>
      </AdminLayout>
    )
  }
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated 
});

export default  connect(mapStateToProps)(AddEditPlayer);