import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BASE_URL } from './config';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { cars: [] };
  }

  componentDidMount() {
    fetch(BASE_URL+'/550').then(res => res.json()).then(cars => this.setState({ cars: cars.slice(0, 10) }));
  }

  choose(carId, variantName) {
    fetch(BASE_URL, {
      method: 'put',
      body: JSON.stringify({ carId, variantName }),
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    }).then(response => response.json())
    .then(updatedCar => {
      const updatedCars = [...this.state.cars];
      const updatedCarIndex = updatedCars.findIndex(c => c._id === updatedCar._id);
      updatedCars[updatedCarIndex] = updatedCar;
      this.setState({cars: updatedCars});
    });
  };

  render() {

    const carElements = this.state.cars.map(car => {
    
      const carVariants = car.favcarsVariants.map(variant => {
    
        const images = variant.urls.map(url => (<img key={car._id + variant.name + url} src={ url } />));
    
        const button = car.selectedFavcarsVariant && car.selectedFavcarsVariant === variant.name ?
          <div>SELECTED</div> :
          <button onClick={ () => this.choose(car._id, variant.name) }>Select</button>
    
        return (<div key={car._id + variant.name }>
          <h4>{ variant.name } { button }</h4>
          <div style={ { display: 'flex' } }>{ images }</div>
        </div>);
      
      });
      
      if (carVariants && carVariants.length > 0) {
        return (<div key={car._id}>
          <h3>{ car.variant }</h3>
          <div>{ carVariants }</div>
        </div>);
      } else {
        return '';
      }
    });
    
    return (
      <div className="App">
        <header className="App-header">
          <p>Admin Site</p>
        </header>
        <main>
          { carElements }
        </main>
      </div>
    );
  }
}

export default App;
