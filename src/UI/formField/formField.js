import React from 'react'
import classes from './forrmField.module.css';

export default function formField({formData, id, change}) {

  const renderTemplate = () => {
    let formTemplate = null;

    const showError = () => {
      let errorMessage = <div className={classes.error}>
        {
          formData.validation && !formData.valid 
            ? formData.validationMessage
            : null
        }
      </div>

      return errorMessage;
    };

    switch (formData.element) {
      case ('input'):
        formTemplate = (
          <>
          <input className={classes.fInput}
            {...formData.config}
            value={formData.value}
            onChange={(event) => change({event, id})}
          />
          {showError()}
          </>
        )
        break;
          
      case 'select':
        formTemplate = (
          <>
          <select className={classes.fInput}
            value={formData.value}
            onChange={(event) => change({event, id})}
          >
            <option>Select One</option>
            {
              formData.config.options.map(e => (
                <option key={e.key} value={e.value} >{e.name ? e.name : e.value}</option>
              ))
            }
          </select>
          {showError()}
          </>
        )
          break;
      default:
        formTemplate = null;
    }

    return formTemplate;
  }

  return (
    <div className={classes.main}>
      {renderTemplate()}
    </div>
  )
}
