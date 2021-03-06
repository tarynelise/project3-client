import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { Redirect } from 'react-router';
import axios from "axios";
import jwtDecoder from "jwt-decode";
import CircularProgress from "material-ui/CircularProgress";
import pug from './images/Pug/Pug_neutral.png';
import rat from './images/Rat/Rat_neutral.png';
import kitty from './images/Kitty/Kitty_neutral.png';
import axolotl from './images/Axolotl/Axolotl_neutral.png';
import './Pet.css'

const style = {
  margin: 15
};


class Adopt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      species: "Click a pet to select",
      hunger: 10,
      happiness: 10,
      fun: 10,
      energy: 40,
      success: "",
      redirect: false
    }
  }

  componentDidMount = () => {
    this.fetchUser();
  };

  fetchUser = () => {
    const user = jwtDecoder(window.localStorage.jwtToken);
    axios({
      url: `https://cheesepets-db.herokuapp.com/users/${user.sub}.json`,
      method: "get",
      headers: {
        authorization: `Bearer ${window.localStorage.jwtToken}`
      }
    }).then(res => this.setState({
      user: res.data,
      username: res.data.username,
      location: res.data.location,
      bio: res.data.bio,
      email: res.data.email
      }));
  };

  _handleSubmit = e => {
    e.preventDefault();
    const user = jwtDecoder(window.localStorage.jwtToken);
    let url = `https://cheesepets-db.herokuapp.com/pets.json`;
    axios({
      url: url,
      method: "post",
      headers: {
        authorization: `Bearer ${window.localStorage.jwtToken}`
      },
      data: {
        name: this.state.name,
        species: this.state.species,
        hunger: this.state.hunger,
        happiness: this.state.happiness,
        fun: this.state.fun,
        energy: this.state.energy,
        user_id: user.sub
      }
    }).then(res => {
      if (res.status === 201) {
        this.setState({redirect: true})
      }
    });
  };

  _handleChange = event => {
    if (event.target.id === "name-field") {
      this.setState({
        name: event.target.value
      });
    }
  };

  _imageClick = event => {
   this.setState({
     species: event.target.name
   })
 }

  render() {
    if (!this.state.user) {
      return <CircularProgress size={60} thickness={7} />;
    }

    return (
      <div className="container adopt-container">
        <div className="pet-container">
          <form onSubmit={this._handleSubmit}>
            <div className="venuesHeader">
              <h1>CheesePets Adoption Center</h1>
            </div>

            <h4>Choose a Pet</h4>
            <img src={pug} name="Pug" alt="Pug Puppy" className="adopt-pet"onClick={this._imageClick} />
            <img src={axolotl} name="Axolotl" alt="Axolotl"className="adopt-pet" onClick={this._imageClick} />
            <img src={rat} name="Rat" alt="Rat"className="adopt-pet"onClick={this._imageClick} />
            <img src={kitty} name="Kitty" alt="UnicornKitty"className="adopt-pet" onClick={this._imageClick} />


            <p><strong>Species:</strong> {this.state.species}</p>
            <h4 id="name-pet">Name your Pet:</h4>
            <TextField
              id="name-field"
              hintText="name"
              floatingLabelText="Name"
              onChange={this._handleChange}
            />
            <br />

            <br />
            <RaisedButton
              label="Submit"
              type="submit"
              primary={true}
              style={style}
            />
          </form>
        </div>
        {this.state.redirect ? <Redirect to='/petprofile'/>:null}
      </div>
    );
  }
}

export default Adopt;
