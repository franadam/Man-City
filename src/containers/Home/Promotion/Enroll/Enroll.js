import React, { Component } from 'react'
import classes from './Enroll.module.css';
import FormField from '../../../../UI/formField/formField';
import {validate} from '../../../../shared/utils';
import {firebasePromotions} from '../../../../firebase';

export default class Enroll extends Component {
  state = {
    formError: false,
    formSuccess: '',
    formData: {
      email: {
        element: 'input',
        value: '',
        config: {
          name: 'email',
          type: 'email',
          placeholder: 'Enter your email'
        },
        validation : {
          required: true,
          email: true
        },
        valid: false,
        validationMessage: '',
        touched: false
      }
    }
  }

  formfieldHandler = element => {
    const newFormData = {...this.state.formData};
    const newElement = {...newFormData[element.id]};

    newElement.value = element.event.target.value;

    const [valid, validationMessage] = validate(newElement);
    newElement.valid = valid;
    newElement.validationMessage = validationMessage;

    newFormData[element.id] = newElement;

    this.setState({
      formData: newFormData,
      formError: false
    })
    console.log(newFormData[element.id])
  }

  formSuccesManager = type => {
    const newFormData = {...this.state.formData};

    for (let key in newFormData) {
      newFormData[key].value = '';
      newFormData[key].valid = false;
      newFormData[key].validationMessage = '';
    }

    this.setState({
      formData: newFormData,
      formError: false,
      formSuccess: type ? 'Congratulation' : 'This user already exists'
    })

    this.clearSuccesMessage();
  }

  clearSuccesMessage = () => {
    setTimeout(() => {
      this.setState({formSuccess: ''})
    }, 2000)
  }

  formHandler = (event) => {
    event.preventDefault();

    const dataToSubmit = {};
    let isValid = true;
    
    for (let key in this.state.formData) {
      dataToSubmit[key] = this.state.formData[key].value;
      isValid = isValid && this.state.formData[key].valid;
    }

    if (isValid) {
      console.log(dataToSubmit);
      //this.setState({formError: !isValid});
      firebasePromotions.orderByChild('email').equalTo(dataToSubmit.email).once('value')
        .then(snapshot => {
          if (snapshot.val() === null) {
            firebasePromotions.push(dataToSubmit);
            this.formSuccesManager(true);
          }
          else {
            this.formSuccesManager(false);
          }
        })
        .catch(error => console.log(error))
    }
    else {
      this.setState({formError: !isValid})
      console.log('ERROR');
    }
    
  }

  render() {

    let errorMessage = <div className={classes.error}>
      {
        this.state.formError 
          ? 'Someting went wrong'
          : null
      }

    </div>
    return (
      <div className={classes.main}>
        <form className={classes.form} onSubmit={(event) => this.formHandler(event)}>
          <h2 className={classes.title}>Enter your email</h2>
          <div className={classes.form}>
            <FormField 
              id={'email'}
              formData={this.state.formData.email}
              change = {(element) => this.formfieldHandler(element)}
            />
            <div className={classes.success_label}>{this.state.formSuccess}</div>
            <button className={classes.btn} onClick={(event) => this.formHandler(event)}>Enroll</button>
            {errorMessage}
            <div className={classes.disclosure}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
          </div>
        </form>
      </div>
    )
  }
}
