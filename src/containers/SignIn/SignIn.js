import React, { Component } from 'react'
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';
import FormField from '../../UI/formField/formField';
import { validate } from '../../shared/utils';
import * as actions from '../../store/actions/auth';

import Spinner from '../../UI/Spinner/Spinner';
import classes from './SignIn.module.css';

class SignIn extends Component {
  
  state = {
    formError: false,
    formSuccess: '',
    isSignup: true,
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
      },
      password: {
        element: 'input',
        value: '',
        config: {
          name: 'password',
          type: 'password',
          placeholder: 'Enter your password'
        },
        validation : {
          required: true,
          minLength: 8
        },
        valid: false,
        validationMessage: '',
        touched: false
      }
    }
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
			this.props.history.push('/dashboard');
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
  
  switchAuthModeHandler = (event) => {
    event.preventDefault();
    this.setState(prevState => {
        return {isSignup: !prevState.isSignup}
    });
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
      this.props.onAuth(dataToSubmit.email, dataToSubmit.password, this.state.isSignup);
      this.props.onSetAuthRedirectPath();
      //console.log('isAuthenticated', this.props.isAuthenticated);
    }

    else {
      this.setState({formError: true})
    }
    
  }

  render() {

    let formErrorMessage = (<div className={classes.error}>
      {
        this.state.formError 
          ? `${this.props.error.message} Someting went wrong`
          : null
      }
      </div>);

    let errorMessage = (<div className={classes.error}>
      {
        !this.props.isAuthenticated && this.props.error
          ? `${this.props.error.message}`
          : null
      }
      </div>);
    
    const formElementsArray = [];
    for (let key in this.state.formData) {
      formElementsArray.push({
        id: key,
        config: this.state.formData[key]
      });
    };

    const formularField = formElementsArray.map(elem => (
      <React.Fragment key={elem.id}>
        <label htmlFor={elem.id} className={classes.label}>{elem.id}</label>
        <FormField 
          id={elem.id}
          formData={this.state.formData[elem.id]}
          change = {(event) => this.formfieldHandler(event)}
        />
      </React.Fragment>
    ));

    let form = (      
      <form className={classes.form} onSubmit={(event) => this.formHandler(event)}>
        {formularField}
        <button type='submit' className={classes.btn} onClick={(event) => this.formHandler(event)}>{this.state.isSignup ? 'LOG IN': 'SIGN UP'}</button>
        <button className={`${classes.btn} ${classes.btnSwitch}`} onClick = {(event) => this.switchAuthModeHandler(event)}>
            SWITCH TO {!this.state.isSignup ? 'LOG IN': 'SIGN UP'}
          </button>
        {formErrorMessage}
        <div className={classes.success_label}>{this.state.formSuccess}</div>
      </form>
    );

    let authRedirect =  this.props.isAuthenticated 
      ? <Redirect to={'/dashboard'} />
      : null;

    if (this.props.loading) {
      form = <Spinner />
    };

    return (
      <div className={classes.main}>
      {authRedirect}
        <div className={classes.wrapper}>
          <h2 className={classes.title}>Please {this.state.isSignup ? 'LOG IN': 'SIGN UP'}</h2>
          {form}
          {errorMessage}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
      loading: state.auth.loading,
      error: state.auth.error,
      isAuthenticated: state.auth.token !== null,
      authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
      onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
      onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/dashboard'))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);