import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BASE_URL } from './config';
import { PickImages } from './components/PickImages';
import { CorrectVariants } from './components/CorrectVariants';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { cars: [], brands: [], selectedBrand: null, selectedModels: [], selectedModel: null, selectedCars:[], selectedMenu: null };
  }

  componentDidMount() {
    fetch(BASE_URL+'/cars').then(res => res.json()).then(cars => this.setState({ cars }));
    fetch(BASE_URL+'/brands').then(res => res.json()).then(brands => this.setState({ brands }));
    fetch(BASE_URL+'/models').then(res => res.json()).then(models => this.setState({ models }));
  }

  unselect(carId) {
    const index = this.state.cars.findIndex(car => car._id === carId);
    const newCars = [...this.state.cars];
    newCars[index].selectedFavcarsVariant = null;
    newCars[index].selectedFavcarsImage = null;
  }

  nomatch(carId) {
    fetch(BASE_URL + '/cars/favcars/' + carId, {
      method: 'delete',
      headers: {
        'accept': 'application/json'
      }
    }).then(response => response.json())
    .then(updatedCar => this.refreshCarState(updatedCar));
  }

  select(carId, variantName, url) {
    fetch(BASE_URL + '/cars', {
      method: 'put',
      body: JSON.stringify({ carId, variantName, url }),
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    }).then(response => response.json())
    .then(updatedCar => this.refreshCarState(updatedCar));
  };

  refreshCarState(updatedCar) {
    const updatedCars = this.state.cars.map(c => c._id === updatedCar._id ? updatedCar : c);
    const updatedSelectedCars = this.state.selectedCars.map(c => c._id === updatedCar._id ? updatedCar : c);
    console.log('updatedCar', updatedCar);
    this.setState({selectedCars: updatedSelectedCars, cars: updatedCars});
  }

  menuSelect(selectedMenu) {
    this.setState({selectedMenu});
  }

  render() {

    const brandElements = this.state.brands.map(brand => (<button key={ brand._id } onClick={() => {
      const selectedModels = this.state.models.filter(model => model.brand.name === brand.name);
      this.setState({selectedBrand: brand, selectedModels, selectedCars: [], selectedModel: null});
    }}>{ brand.name }</button>));

    const modelElements = this.state.selectedModels.map(model => (<button key={ model._id } onClick={() => {
      const selectedCars = this.state.cars.filter(car => car.model.brand.name === this.state.selectedBrand.name && car.model.name === model.name);
      this.setState({selectedModel: model, selectedCars});
    }}>{ model.name }</button>));

    const selectedBrandElement = this.state.selectedBrand ? (<div><hr />
      <h2>{this.state.selectedBrand.name} {this.state.selectedModel ? this.state.selectedModel.name : ''}</h2>
      <hr /></div>) : '';

    const menuElements = <select onChange={event => this.menuSelect(event.target.value)}>
      <option value="">--select--</option>
      <option value="pickimages">Pick images</option>
      <option value="correctvariants">Correct variants</option>
    </select>;

    let selectedMenuElement = null;
    switch(this.state.selectedMenu) {
      case 'pickimages':
        selectedMenuElement = <PickImages selectedBrand={this.state.selectedBrand} selectedModel={this.state.selectedModel}
          selectedCars={this.state.selectedCars} nomatch={carId => this.nomatch(carId)} 
          select={(carId, variantName, url) => this.select(carId, variantName, url)}
          unselect={carId => this.unselect(carId)}></PickImages>;
        break;
      case 'correctvariants':
        selectedMenuElement = <CorrectVariants selectedCars={this.state.selectedCars} removeVariant={carId => console.log('remove '+carId)}></CorrectVariants>;
        break;
      default:
        selectedMenuElement = '';
    }
    
    return (
      <div className="App">
        <header className="App-header">
          <section><div>Admin Site</div>{ menuElements }</section>
          <section>{ brandElements }</section>
          <hr />
          <section>{ modelElements }</section>
          { selectedBrandElement }
          
        </header>
        <main>
          { selectedMenuElement }
        </main>
      </div>
    );
  }
}

export default App;
