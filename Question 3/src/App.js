import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="container">
        <h1>Register account</h1>
        <form className="styled-form">
          <label for="firstName">First name</label>
          <input type="text" name="firstName" value="Max" />
          <label for="lastName">Last name</label>
          <input type="text" name="lastName"/>
          <label for="email">Email</label>
          <input type="email" name="email" value="not-a-email" />

          <h2>Bank accounts</h2>

          <div className="add-account"> + Add bank account</div>

          <button type="submit">Submit!</button>
        </form>
      </div>
    );
  }
}

export default App;
