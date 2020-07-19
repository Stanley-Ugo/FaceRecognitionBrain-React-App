import React, { Component } from "react";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import Navigation from "./components/Navigation/Navigation";
import Register from "./components/Register/Register";
import SignIn from "./components/SignIn/SignIn";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import "./App.css";

const app = new Clarifai.App({
  apiKey: "b514d7b4548a4865bbfd8dcd8fb166dc",
});

const particlesOptions = {
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
    };
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftcol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFacebox = (box) => {
    this.setState({ box: box });
  };

  oninputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) =>
        this.displayFacebox(this.calculateFaceLocation(response))
      )
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    this.setState({ route: route});
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation onRouteChange={this.onRouteChange}/>
        {this.state.route === "home" ? 
          ( <div>
          <Logo />
          <Rank />
          <ImageLinkForm
            oninputChange={this.oninputChange}
            onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition
            box={this.state.box}
            imageUrl={this.state.imageUrl}
          />
        </div> )
         : this.state.route ==='signin' ?
          (<div>
            <SignIn onRouteChange={this.onRouteChange}/>
          </div>) 
          :
           ( <Register onRouteChange={this.onRouteChange}/> )
          
        }
      </div>
    );
  }
}

export default App;
