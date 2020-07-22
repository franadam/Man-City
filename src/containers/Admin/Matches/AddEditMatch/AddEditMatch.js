import React, { Component } from 'react'
import { connect } from 'react-redux';

import AdminLayout from '../../../../hoc/admin/admin_layout'
import FormField from '../../../../UI/formField/formField';
import Spinner from '../../../../UI/Spinner/Spinner';

import classes from './AddEditMatch.module.css';

import {validate, firebaseLooper} from '../../../../shared/utils';
import { firebaseDB, firebaseTeams, firebaseMatches } from '../../../../firebase'

class AddEditMatche extends Component {
  state = {
    isLoading: true,
    matchId: '',
    formType: '',
    formError: false,
    formSuccess: '',
    teams: [],
    formData: {
      date: {
        element: 'input',
        value: '',
        config: {
          name: 'date',
          type: 'date',
          placeholder: 'Enter the date',
        },
        validation : {
          required: true,
        },
        valid: false,
        validationMessage: '',
        touched: false,
      },
      local: {
        element: 'select',
        value: '',
        config: {
          name: 'local',
          type: 'select',
          options: []
        },
        validation : {
          required: true,
        },
        valid: false,
        validationMessage: '',
        touched: false,
      },
      resultLocal: {
        element: 'input',
        value: '',
        config: {
          name: 'result_local',
          type: 'number',
        },
        validation : {
          required: true,
        },
        valid: false,
        validationMessage: '',
        touched: false,
      },
      away: {
        element: 'select',
        value: '',
        config: {
          name: 'away',
          type: 'select',
          options: []
        },
        validation : {
          required: true,
        },
        valid: false,
        validationMessage: '',
        touched: false,
      },
      resultAway: {
        element: 'input',
        value: '',
        config: {
          name: 'result_away',
          type: 'number',
        },
        validation : {
          required: true,
        },
        valid: false,
        validationMessage: '',
        touched: false,
      },
      referee: {
        element: 'input',
        value: '',
        config: {
          name: 'referee',
          type: 'text',
          placeholder: 'Enter the referee',
        },
        validation : {
          required: true,
        },
        valid: false,
        validationMessage: '',
        touched: false,
      },
      stadium: {
        element: 'input',
        value: '',
        config: {
          name: 'stadium',
          type: 'text',
          placeholder: 'Enter the stadium',
        },
        validation : {
          required: true,
        },
        valid: false,
        validationMessage: '',
        touched: false,
      },
      result: {
        element: 'select',
        value: '',
        config: {
          name: 'result',
          type: 'select',
          options: [
            {key: 'W', value: 'W'},
            {key: 'L', value: 'L'},
            {key: 'D', value: 'D'},
            {key: 'n/a', value: 'n/a'}
          ]
        },
        validation : {
          required: true,
        },
        valid: false,
        validationMessage: '',
        touched: false,
      },
      final: {
        element: 'select',
        value: '',
        config: {
          name: 'final',
          type: 'select',
          options: [
            {key: 'Yes', value: 'Yes'},
            {key: 'No', value: 'No'}
          ]
        },
        validation : {
          required: true,
        },
        valid: false,
        validationMessage: '',
        touched: false,
      },
    } 
  }

  componentDidMount() {
    this.matchHander();
  }
  
  matchHander = async () => {
    const matchId = this.props.match.params.id;
    const teams = await this.fecthTeams();
    const teamsOptions = [];
    teams.forEach(t => {
      teamsOptions.push({
        key: t.thmb,
        value: t.shortName,
        name: t.name
      })
    });

    if (!matchId) {
      console.log(matchId);
      this.addMatch(teams, teamsOptions);
    } else {
      this.fecthMatch(matchId, teams, teamsOptions);
    }

    this.setState({
      isLoading: false
    });
  }

  addMatch = async (teams, teamsOptions) => {
    const newFormData = {...this.state.formData};
    const match = {};
    for (let key in newFormData) {
      match[key] = newFormData[key].value;
    };
    console.log(match);
    const type = 'Add Match';
    this.updateFields(match, teams, teamsOptions, type);
  }

  fecthMatch = async (id, teams, teamsOptions) => {
    const snapshot = await firebaseDB.ref(`matches/${id}`).once('value');
    const match = snapshot.val();
    const type = 'Edit Match';
    this.updateFields(match, teams, teamsOptions, type, id);
  }

  fecthTeams = async () => {
    const snapshot = await firebaseTeams.once('value');
    const teams = await firebaseLooper(snapshot);
    return teams;
  }

  updateFields = (match, teams, teamsOptions, type, matchId) => {
    const newFormData = {...this.state.formData};

    for (let key in newFormData) {
      if (match) {
        newFormData[key].value = match[key];
        newFormData[key].valid = true;
      }
      if (key === 'local' || key === 'away') {
        newFormData[key].config.options = teamsOptions;
      }
    }

    this.setState({
      formData: newFormData,
      teams,
      formType: type,
      matchId
    })
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

  formHandler = (event) => {
    event.preventDefault();

    const dataToSubmit = {};
    let isValid = true;
    
    for (let key in this.state.formData) {
      dataToSubmit[key] = this.state.formData[key].value;
      isValid = isValid && this.state.formData[key].valid;
    };

    this.state.teams.forEach(t => {
      if (t.shortName === dataToSubmit.local) {
        dataToSubmit['localThmb'] = t.thmb
      }
      if (t.shortName === dataToSubmit.away) {
        dataToSubmit['awayThmb'] = t.thmb
      }
    });

    if (isValid) {
      console.log(dataToSubmit);
      console.log(this.state.formType);
      if (this.state.formType === 'Edit Match') {
        firebaseDB.ref(`matches/${this.state.matchId}`)
          .update(dataToSubmit)
          .then(() => {
            this.formSuccesManager();
            this.props.history.push('/admin_matches')
          })
          .catch(error => {
            this.setState({
              formError: true
            })
          })
      }
      else {
        firebaseMatches
          .push()
          .set(dataToSubmit)
          .then(() => {
            this.formSuccesManager()
          })
          .catch(error => {
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

  render() {

    let errorMessage = (<div className={classes.error}>
      {
        !this.props.isAuthenticated && this.props.error
          ? `${this.props.error.message}`
          : null
      }
      </div>);
    
    let formErrorMessage = (<div className={classes.error}>
      {
        this.state.formError 
          ? `${this.props.error.message} Someting went wrong`
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
        <label htmlFor={elem.id} className={classes.label}>{elem.config.config.name.split('_').join(' ')}</label>
        <FormField 
          id={elem.id}
          formData={this.state.formData[elem.id]}
          change = {(event) => this.formfieldHandler(event)}
        /> 
      </React.Fragment>));

    let form = (      
      <form className={classes.form} onSubmit={(event) => this.formHandler(event)}>
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
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated 
})

export default  connect(mapStateToProps)(AddEditMatche);

/*

    const formularField = formElementsArray.map(elem => 
        { if (elem.id === 'resultLocal' || elem.id === 'resultAway') 
          return (<div key={elem.id} className={classes.right}>
              <FormField 
                id={elem.id}
                formData={this.state.formData[elem.id]}
                change = {(event) => this.formfieldHandler(event)}
              /> 
            </div>)
        else if (elem.id === 'away' || elem.id === 'away') 
          return (
          <div key={elem.id} className={classes.left}>
            <label htmlFor={elem.id} className={classes.label}>{elem.config.config.name.split('_').join(' ')}</label>
            <FormField 
              id={elem.id}
              formData={this.state.formData[elem.id]}
              change = {(event) => this.formfieldHandler(event)}
            /> 
          </div>)
          else 
            return (<React.Fragment key={elem.id}>
            <label htmlFor={elem.id} className={classes.label}>{elem.config.config.name.split('_').join(' ')}</label>
            <FormField 
              id={elem.id}
              formData={this.state.formData[elem.id]}
              change = {(event) => this.formfieldHandler(event)}
            /> 
          </React.Fragment>)
        }
    );
 */