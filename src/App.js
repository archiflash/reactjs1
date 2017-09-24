import React, { Component } from 'react';
import './App.css';

const storage_name = "users";

function readData() {

    let users = JSON.parse(localStorage.getItem(storage_name));
    if(!users){
      users = [];
    }
    return users;
}

function storeData(users) {

    let serialObj = JSON.stringify(users);

    try {
      localStorage.setItem(storage_name, serialObj);
    } catch (e) {
      if (e.name === "QUOTA_EXCEEDED_ERR") {
        alert("QUOTA EXCEEDED!");
      }
    }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {showForm: false, edituser: '', step: 0}
    this.update = this.update.bind(this);
  }

  getUser(users,nickname) {
      let k = false;
      for (let i=0;i<users.length;i++) {
         if (users[i].nickname===nickname) {
            k = i;
         }
      }
      return k;
  }

  update(action, name = null, age = null, nickname = null){
    let users;
    let exists;
    let userindex;

    if(action==="Save" || action==="Edit"){
      if (name==="") {
         alert("Input name!");
         return;
      }
      if (nickname==="") {
         alert("Input nickname!");
         return;
      }
    }
    
    if (action==="Add") {    

      this.setState({edituser: ""});
      this.setState({showForm: true});

    } else if(action==="Cancel") {

      this.setState({edituser: ""});
      this.setState({showForm: false});
      
    } else if(action==="Save") {

      users = readData();
      exists = this.getUser(users,nickname);

      if (exists!==false && this.state.edituser!=="") {
        userindex = this.getUser(users,this.state.edituser);
       
        if (exists===userindex) {
          exists = false;
        }
      }

      if (exists!==false) {
        alert('Nickname already exists!');
        return;
      }

      if (this.state.edituser==="") {

        let newuser = {
          name: name,
          age: age,
          nickname: nickname
        };
        users.push(newuser);

      } else {

        userindex = this.getUser(users,this.state.edituser);

        if (userindex!==false) {
          users[userindex].name = name;
          users[userindex].age = age;
          users[userindex].nickname = nickname;
        }
        this.setState({edituser: ""});

      }

      storeData(users);
      this.setState({showForm: false});
      
    } else if(action==="Delete") {

      users = readData();
      exists = this.getUser(users,nickname);
      if(exists!==false) users.splice(exists,1);
      storeData(users);
      this.setState({step: this.state.step+1});
      
    } else if(action==="Edit") {

      this.setState({edituser: nickname});

    }  
  }

  render() {
    return (
      <div className="App">
        <Header />
        <UserList clickHandler={this.update} edituser={this.state.edituser}/>
        <NewUser show_form={this.state.showForm} clickHandler={this.update} />
        <div className="space" />
        <Button name="Add" clickHandler={this.update}/>
      </div>
    );
  }
}

class UserList extends Component {

  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
  }

  listUsers() {
    let users = readData();
    let k = 1;
    return users.map((user) => 
                    <User clickHandler={this.update} 
                     key={user.nickname} data={user} index={k++} edit={user.nickname===this.props.edituser} />
                    );
  }

  update(action, name = null, age = null, nickname = null) {
    if(action==="Delete"){
      if (window.confirm('Are You sure?')) {
        this.props.clickHandler(action, name, age, nickname);
      } 
    } else {
      this.props.clickHandler(action, name, age, nickname);
    }
  }

  render() {
    return (
        <div>{this.listUsers()}</div>
    );
  }
} 
class Button extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
     this.props.clickHandler(this.props.name);
  };

  render() {
    return (
        <button name="add" onClick={this.handleClick}>{this.props.name}</button>
    );
  }
}

class Header extends Component {

  render() {
    return (
      <div className="header">
        <div className="hborder">Name</div>
        <div className="hborder">Age</div>
        <div className="hborder">Nickname</div>
        <div className="hborder">Action</div>
      </div>
   );
  }
} 


class User extends Component {
  
  constructor(props) {
    super(props);
    this.myclass = this.props.index%2 ? 'border' : 'border gray';
    this.update = this.update.bind(this);
  }

  update(action) {

    if (action==="Save") {

      let name = (this.nameInput.value).trim();
      let age = this.ageInput.value;
      let nickname = (this.nicknameInput.value).trim();
      this.props.clickHandler(action, name, age, nickname);

    } else {

      this.props.clickHandler(action, null, null, this.props.data.nickname);

    }
  }



  render() {
    return (
      <div>
        <div className={this.myclass}>
          {this.props.edit ?
          (
            <input type="text" defaultValue={this.props.data.name} ref={(input) => this.nameInput = input} />
          ) : (
            this.props.data.name
          )}
        </div>
        <div className={this.myclass}>
          {this.props.edit ?
          (
            <select name="age" defaultValue={this.props.data.age} ref={(input) => this.ageInput = input}>
              {getOptions()}
            </select>
          ) : (
            this.props.data.age
          )}
        </div>
        <div className={this.myclass}>
          {this.props.edit ?
          (
          <input type="text" defaultValue={this.props.data.nickname} ref={(input) => this.nicknameInput = input} />
          ) : (
            this.props.data.nickname
          )}
        </div>
        <div className={this.myclass}>
          <Button name={this.props.edit ? "Save" : "Edit"} clickHandler={this.update}/>
          <Button name={this.props.edit ? "Cancel" : "Delete"} clickHandler={this.update}/>
        </div>
      </div>
   );
  }
} 

class NewUser extends Component {

  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
  }

  update(action) {

    let name = (this.nameInput.value).trim();
    let age = this.ageInput.value;
    let nickname = (this.nicknameInput.value).trim();
    this.props.clickHandler(action, name, age, nickname);

  }

  render() {

    if (!this.props.show_form) {
       return null;
    }

    return (
      <div>
        <input type="text" ref={(input) => this.nameInput = input} />
        <select name="age" className="age" ref={(input) => this.ageInput = input}>
          {getOptions()}
        </select>
        <input type="text" ref={(input) => this.nicknameInput = input} />
          <Button name="Save" clickHandler={this.update}/>
          <Button name="Cancel" clickHandler={this.update}/>
      </div>
    );
  }
}

function  getOptions() {

    let rows = [];
    for (let i=10; i < 50; i++) {
       rows.push(<option key={i.toString()}>{i}</option>);
    }
    return rows;
}



export default App;
