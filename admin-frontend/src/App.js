import React from 'react';
import './App.css';
import { BASE_URL } from './config';
import { PickImages } from './components/PickImages';
import { CorrectVariants } from './components/CorrectVariants';
import { Menu, CHOOSE_IMAGES_MENU, CREATE_UPDATE_DELETE_VARIANTS } from './components/Menu';
import { sortBrands, sortModels } from './functions/sort';
import { noCarImageMatch, selectCarImage, createCar, removeCar } from './functions/car';


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

  refreshCar(updatedCar) {
    const updatedCars = this.state.cars.map(c => c._id === updatedCar._id ? updatedCar : c);
    const updatedSelectedCars = this.state.selectedCars.map(c => c._id === updatedCar._id ? updatedCar : c);
    console.log('updatedCar', updatedCar);
    this.setState({selectedCars: updatedSelectedCars, cars: updatedCars});
  }


  render() {

    const brandElements = this.state.brands.sort(sortBrands).map(brand => {
      const brandStats = this.state.brandMap[brand._id];
      const okCount = brandStats && brandStats.okCount ? brandStats.okCount : 0;
      const totalCount = brandStats && brandStats.totalCount ? brandStats.totalCount : 0;
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

    const modelElements = this.state.selectedModels.sort(sortModels).map(model => {
      const modelStats = this.state.modelMap[model._id];
      const okCount = modelStats && modelStats.okCount ? modelStats.okCount : 0;
      const totalCount = modelStats && modelStats.totalCount ? modelStats.totalCount : 0;;
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

    let selectedMenuElement = null;
    switch(this.state.selectedMenu) {
      case CHOOSE_IMAGES_MENU:
        selectedMenuElement = (
          <PickImages
            selectedBrand={this.state.selectedBrand}
            selectedModel={this.state.selectedModel}
            selectedCars={this.state.selectedCars}
            nomatch={carId => noCarImageMatch(carId).then(updatedCar => this.refreshCar(updatedCar))} 
            select={(carId, variantName, url) => selectCarImage(carId, variantName, url).then(updatedCar => this.refreshCar(updatedCar))}
            unselect={carId => this.unselect(carId)}>
          </PickImages>
        );
        break;
      case CREATE_UPDATE_DELETE_VARIANTS:
        if (this.state.selectedModel) {
          selectedMenuElement = (
            <CorrectVariants 
              selectedModel={this.state.selectedModel}
              selectedCars={this.state.selectedCars}
              removeVariant={carId => removeCar(carId)}
              createVariant={car => createCar(car)}>
            </CorrectVariants>
          );
        }
        break;
      default:
        selectedMenuElement = '';
    }
    
    return (
      <div className="App">
        <header className="App-header">
          <section>
            <h1>Admin Site</h1>
            <Menu menuSelect={selectedMenu => this.setState({selectedMenu})} />
          </section>
          <section>{ this.state.selectedMenu && brandElements }</section>
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
