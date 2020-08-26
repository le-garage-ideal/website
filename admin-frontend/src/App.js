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
    Promise.all([fetch(BASE_URL+'/cars').then(res => res.json()),
      fetch(BASE_URL+'/brands').then(res => res.json()),
      fetch(BASE_URL+'/models').then(res => res.json())])
    .then(([cars, brands, models]) => {
      const modelMap = {};
      const brandMap = {};
      for (const car of cars) {
        
        const brand = brands.find(brand => brand.name === car.model.brand.name);
        if (!brand) {
          console.log(`brand not found for car`, car);
        } else {
          if (!brandMap[brand._id]) brandMap[brand._id] = { totalCount: 0, okCount: 0 };
          brandMap[brand._id].totalCount++;        
          if (car.selectedFavcarsUrl) {
            brandMap[brand._id].okCount++;
          }
        }

        const model = models.find(model => model.brand.name === car.model.brand.name && model.name === car.model.name);
        if (!model) {
          console.log(`model not found for car`, car);
        } else {
          if (!modelMap[model._id]) modelMap[model._id] = { totalCount: 0, okCount: 0 };
          modelMap[model._id].totalCount++;
          if (car.selectedFavcarsUrl) {
            modelMap[model._id].okCount++;
          }
        }
      }
      this.setState({ cars, models, brands, brandMap, modelMap });
    });
  }

  unselect(carId) {
    const indexCars = this.state.cars.findIndex(car => car._id === carId);
    const newCars = [...this.state.cars];
    newCars[indexCars].selectedFavcarsVariant = null;
    newCars[indexCars].selectedFavcarsImage = null;

    const indexSelectedCars = this.state.selectedCars.findIndex(car => car._id === carId);
    const newSelectedCars = [...this.state.selectedCars];
    newSelectedCars[indexSelectedCars].selectedFavcarsVariant = null;
    newSelectedCars[indexSelectedCars].selectedFavcarsImage = null;

    this.setState({cars: newCars, selectedCars: newSelectedCars})
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

  addVariant(car) {
    fetch(BASE_URL + '/cars', {
      method: 'post',
      headers: {
        'accept': 'application/json'
      }
    }).then(response => response.json())
    .then(addedCar => console.log(addedCar));
     
  }

  removeVariant(carId) {
    fetch(BASE_URL + '/cars/' + carId, {
      method: 'delete',
      headers: {
        'accept': 'application/json'
      }
    }).then(response => response.json())
    .then(deletedCar => console.log(deletedCar));
     
  }

  menuSelect(selectedMenu) {
    this.setState({selectedMenu});
  }

  render() {

    const brandElements = this.state.brands.map(brand => {
      const okCount = this.state.brandMap[brand._id].okCount;
      const totalCount = this.state.brandMap[brand._id].totalCount;
      return (
        <button key={ brand._id } onClick={() => {
            const selectedModels = this.state.models.filter(model => model.brand.name === brand.name);
            this.setState({selectedBrand: brand, selectedModels, selectedCars: [], selectedModel: null});
          }}
          style={{ borderColor: this.state.selectedBrand && this.state.selectedBrand._id === brand._id ? 'yellow' : 'auto',
                   backgroundColor: okCount === 0 ? 'red' : okCount === totalCount ? 'lightgreen' : 'orange'}}>
          { brand.name }
        </button>
      );
    });

    const modelElements = this.state.selectedModels.map(model => {
      if (!this.state.modelMap[model._id]) { console.log(model._id); return <div>{model.name}</div> }
      const okCount = this.state.modelMap[model._id].okCount;
      const totalCount = this.state.modelMap[model._id].totalCount;
      return (
        <button key={ model._id } title={ model.favcarsName } onClick={() => {
            const selectedCars = this.state.cars
              .filter(car => car.model.brand.name === this.state.selectedBrand.name && car.model.name === model.name)
              .sort((e1, e2) => (1 * e1.startYear) - (1 * e2.startYear) === 0 ? (e1.variant > e2.variant ? 1 : e1.variant < e2.variant ? -1 : 0) : (1 * e1.startYear) - (1 * e2.startYear));
            this.setState({selectedModel: model, selectedCars});
          }}
          style={{ borderColor: this.state.selectedModel && this.state.selectedModel._id === model._id ? 'yellow' : 'auto', 
                   backgroundColor: okCount === 0 ? 'red' : okCount === totalCount ? 'lightgreen' : 'orange'}}>
          { model.name }
        </button>
      );
    });


    const menuElements = <select onChange={event => this.menuSelect(event.target.value)}>
      <option value="">--select--</option>
      <option value="pickimages">Pick images</option>
      <option value="correctvariants">Correct variants</option>
    </select>;

    let selectedMenuElement = null;
    switch(this.state.selectedMenu) {
      case 'pickimages':
        selectedMenuElement = <PickImages
            selectedBrand={this.state.selectedBrand}
            selectedModel={this.state.selectedModel}
            selectedCars={this.state.selectedCars}
            nomatch={carId => this.nomatch(carId)} 
            select={(carId, variantName, url) => this.select(carId, variantName, url)}
            unselect={carId => this.unselect(carId)}>
          </PickImages>;
        break;
      case 'correctvariants':
        if (this.state.selectedModel) {
          selectedMenuElement = <CorrectVariants 
            selectedModel={this.state.selectedModel}
            selectedCars={this.state.selectedCars}
            removeVariant={carId => this.removeVariant(carId)}>
          </CorrectVariants>;
        }
        break;
      default:
        selectedMenuElement = '';
    }
    
    return (
      <div className="App">
        <header className="App-header">
          <section><div>Admin Site</div>{ menuElements }</section>
          <section>{ brandElements }</section>
          <hr style={{color: 'white'}} />
          <section>{ modelElements }</section>
        </header>
        <main>
          { selectedMenuElement }
        </main>
      </div>
    );
  }
}

export default App;
