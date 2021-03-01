import React, { Component } from 'react';
import Nav from './nav';

export default class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoId: this.props.match.params.id,
            videoData: {}
        };
    }
    async componentDidMount() {
        try {
            const res = await fetch(`http://localhost:3000/movies/${this.state.videoId}`);
            const data = await res.json();
            this.setState({ videoData: data });
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <video controls muted autoPlay>
                        <source src={`http://localhost:3000/movies/${this.state.videoId}`} type="video/mp4"></source>
                    </video>
                    <h1>{ this.state.videoData.name }</h1>
                </header>
            </div>
        )
    }
}
