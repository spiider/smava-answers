import React, { Component } from 'react';
import IBAN from 'iban';
import './App.css';

const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
        firstName: '',
        lastName: '',
        firstNameInvalid: false,
        lastNameInvalid: false,
        email: '',
        emailInvalid: false,
        bankAccounts: [ ],
        bankAccountMissing: false
      };

      this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
      this.handleChangeLastName = this.handleChangeLastName.bind(this);
      this.handleChangeEmail = this.handleChangeEmail.bind(this);
      this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

handleChangeFirstName(evt) {
  this.setState({
    firstName: evt.target.value,
    firstNameInvalid: !(/^[a-zA-Z]+$/.test(evt.target.value))
   });
}

handleChangeLastName(evt) {
  this.setState({
    lastName: evt.target.value,
    lastNameInvalid: !(/^[a-zA-Z]+$/.test(evt.target.value))
   });
}

handleChangeEmail(evt) {
  this.setState({
    email: evt.target.value,
    emailInvalid: !(pattern.test(evt.target.value)),
  })
}

handleBankNameChange = (idx) => (evt) => {
  const newBankAccounts = this.state.bankAccounts.map((bank, sidx) => {
  if (idx !== sidx) return bank;
    return { ...bank, name: evt.target.value, nameInvalid: (evt.target.value.length === 0) };
  });

  this.setState({ bankAccounts: newBankAccounts });
}

handleAddBank = () => {
  this.setState({ bankAccounts: this.state.bankAccounts.concat([{ name: '' }]) });
}

handleRemoveBank = (idx) => () => {
  this.setState({ bankAccounts: this.state.bankAccounts.filter((s, sidx) => idx !== sidx) });
}

handleBankIbanChange = (idx) => (evt) => {
  const newBankAccounts = this.state.bankAccounts.map((bank, sidx) => {
  if (idx !== sidx) return bank;
    return { ...bank, iban: evt.target.value, ibanInvalid: !IBAN.isValid(evt.target.value)};
  });

  this.setState({ bankAccounts: newBankAccounts });
}

handleOnSubmit(evt) {
  evt.preventDefault();
  if (this.state.bankAccounts.length < 1) {
    this.setState({ bankAccountMissing: true });
  } else {
    this.setState({ bankAccountMissing: false });

    if(!(/^[a-zA-Z]+$/.test(this.state.firstName))) {
      this.setState({ firstNameInvalid: true });
    }

    if(!(/^[a-zA-Z]+$/.test(this.state.lastName))) {
      this.setState({ lastNameInvalid: true });
    }

    if(!(pattern.test(this.state.email))){
      this.setState({ emailInvalid: true })
    }

    if(!this.state.firstNameInvalid && !this.state.lastNameInvalid &&
      !this.state.emailInvalid) {

        // fast workarround to create a pretty output
        let formatOutput = JSON.parse(JSON.stringify(this.state));
        delete formatOutput.emailInvalid;
        delete formatOutput.firstNameInvalid;
        delete formatOutput.lastNameInvalid;
        delete formatOutput.bankAccountMissing;
        for(let i = 0; i < formatOutput.bankAccounts.length; i+= 1) {
          delete formatOutput.bankAccounts[i].ibanInvalid;
          delete formatOutput.bankAccounts[i].nameInvalid;
        }

        alert(`From data: ${JSON.stringify(formatOutput, null, 2)}`);
      }

  }
}

  render() {
    return (
      <div className="container">
        <h1>Register account</h1>
        <form className="styled-form" onSubmit={this.handleSubmit}>
          <label htmlFor="firstName">First name</label>
          <input type="text" name="firstName" value={this.state.firstName}
            onChange={this.handleChangeFirstName} required />
          {this.state.firstNameInvalid && <p className="error">Invalid first name</p>}
          <label htmlFor="lastName">Last name</label>
          <input type="text" name="lastName" value={this.state.lastName}
            onChange={this.handleChangeLastName} required />
          {this.state.lastNameInvalid && <p className="error">Invalid last name</p>}
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={this.state.email}
            onChange={this.handleChangeEmail} required />
            {this.state.emailInvalid && <p className="error">Invalid email</p>}

          <h2>Bank accounts</h2>
          {this.state.bankAccountMissing && <p className="error-bank">You should provide at least one bank account</p>}
          {this.state.bankAccounts.map((bank, idx) => (
            <div className="bank-account">
              <label htmlFor="iban">IBAN</label>
              <input type="text" name="iban" value={bank.iban}
                onChange={this.handleBankIbanChange(idx)} />
                <i className="fa fa-trash remove-btn" aria-hidden="true" onClick={this.handleRemoveBank(idx)}></i>
                {bank.ibanInvalid && <p className="error">Invalid IBAN</p>}
              <label htmlFor="bankName">Bank name</label>
              <input type="text" name="bankName" value={bank.name}
                onChange={this.handleBankNameChange(idx)} required />
                {bank.nameInvalid && <p className="error">Bank name can't be empty</p>}

            </div>
          ))}

          <div className="add-account" onClick={this.handleAddBank}>+ Add bank account</div>

          <button type="submit" onClick={this.handleOnSubmit}>Submit!</button>
        </form>
      </div>
    );
  }
}

export default App;
