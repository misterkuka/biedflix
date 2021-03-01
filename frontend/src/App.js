import React, { Component } from 'react';
import Player from './Player';
import axios from 'axios';
import {
    Route,
    BrowserRouter as Router,
    Switch,
} from "react-router-dom";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile:null,
      movies: [],
      loaded:0,
      title: ""
    }
  }


  componentDidMount() {
    const url = "http://localhost:3000/movies";
    fetch(url)
    .then(response => response.json())
    .then(json => this.setState({ movies: json }))
  }

onChangeHandler = event => {
  console.log(event.target.files[0])
  this.setState({
    selectedFile: event.target.files[0],
    loaded: 0,
  })
}

onClickHandler = () => {
  const data = new FormData();
  data.append('file', this.state.selectedFile);
  data.append('name', this.state.title);
  console.log(this.state.title);
  axios.post('http://localhost:3000/movies', data, {
    onUploadProgress:ProgressEvent => {
      this.setState({
        loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
      })
    },

  })
  .then(res => {
    console.log(res)

  })
}


handleTitleChange = (e) => {
   this.setState({title: e.target.value});
   console.log(this.state.title);
}

  render() {
      const { movies } = this.state;
      return (

        <div className="container">
        <form>
          <input type="text" value={this.state.title} onChange={this.handleTitleChange} name="title" required placeholder="Podaj tytuł filmu"/>
          <div className="file-field input-field">
            <div className="btn red">
            <span>File</span>
            <input type="file" className="red" name="file" onChange={this.onChangeHandler}/>
            </div>
          <div class="file-path-wrapper">
            <input class="file-path validate white-text" type="text"/>
          </div>
        </div>
          <input type="submit" class="btn red btn-success btn-block" onClick={this.onClickHandler}/>
        </form>
          {movies.map((movie) => (
            <div className="card black center">
              <div className="card-header">
                #{movie.name}
              </div>
              <div className="card-body ">
                <p className="card-text">{movie.Created_date}</p>
              </div>
              <img height="200px" src={"http://localhost:3000/movies/"+ movie.filename + "/thumb"}/><br/>
              <button class="btn red"><a className = "white-text" href={"http://localhost:3001/player/"+ movie.filename}>watch</a></button>
            </div>
          ))}
        </div>
      );
    }
  }
export default function Routes() {
  return (
    <Router>
            <Switch>
            <Route exact path="/" component={App}></Route>
            <Route path="/player/:id" component={Player}></Route>
            </Switch>
        </Router>
  );
};
