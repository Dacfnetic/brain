import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import { Component } from 'react';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    };
  }

  calculateFaceLocation = (data) =>{
    console.log(data);
    const clarifaiFace = data;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return{
      leftCol:clarifaiFace.left_col*width,
      topRow:clarifaiFace.top_row*height,
      rightCol:width-(clarifaiFace.right_col*width),
      bottomRow:height - (clarifaiFace.bottom_row*height)
    }
  }
  
  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    console.log("click");
    this.setState({imageUrl: this.state.input});

    const USER_ID = 'dacfnetic';
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '428c787d5bdf4566bfce039c7f2be49b';
    const APP_ID = 'my-first-application';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
    const IMAGE_URL = this.state.input;

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id
   
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => response.json())
        .then(result => this.displayFaceBox(this.calculateFaceLocation(result.outputs[0].data.regions[0].region_info.bounding_box)))
        .catch(error => console.log('error', error));
    
  }

  onRouteChange = (ruta) => {
    this.setState({isSignedIn: false})
    if(ruta === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route : ruta})
  }

  render(){
    return (
      <div className="App">
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
  	    <ParticlesBg className="particles" color="#FFFFFF" num={100} type="cobweb" bg={true} />
        {this.state.route === 'home' ?
        <>
          <Logo />
          <Rank />
          <ImageLinkForm 
            onButtonSubmit={this.onButtonSubmit} 
            onInputChange={this.onInputChange}
            />
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </>
          : 
          (
            this.state.route === 'signin' 
            ? <Signin onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange}/>
          )
        }    
      </div>
    );
  }
}

export default App;
