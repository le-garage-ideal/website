import React from 'react';
import './App.css';
import { PickImages } from './components/PickImages';
import { CrudCars } from './components/CrudCars';
import { Menu, CHOOSE_IMAGES_MENU, CREATE_UPDATE_DELETE_VARIANTS } from './components/Menu';
import { fetchInitData } from './functions/api';
import { sortBrands, sortModels } from './functions/sort';
import { noCarImageMatch, selectCarImage, createCar, removeCar, computeSelectedCars } from './functions/car';

const computeButtonClassNames = (selected, okCount, totalCount) => {
  const buttonClassNames = [];
  if (selected) {
    buttonClassNames.push('selected-button');
  }
  if (okCount === 0) {
    buttonClassNames.push('group-incomplete-button');
  }
  if (okCount < totalCount) {
    buttonClassNames.push('group-empty-button');
  }
  return buttonClassNames;
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cars: [],
      brands: [],
      selectedBrand: null,
      selectedModels: [],
      selectedModel: null,
      selectedCars: [],
      selectedMenu: null,
    };
  }

  componentDidMount() {
    fetchInitData().then(initData => this.setState(initData));
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

  refreshState(updatedCar) {
    const updatedCarIndex = this.state.cars.findIndex(c => c._id === updatedCar._id);
    const updatedCars = [...this.state.cars];
    if (updatedCarIndex >= 0) {
      updatedCars[updatedCarIndex] = updatedCar;
    } else {
      updatedCars.push(updatedCar);
    }
    const updatedSelectedCars = this.state.selectedModel ? computeSelectedCars(updatedCars, this.state.selectedModel) : [];
    this.setState({selectedCars: updatedSelectedCars, cars: updatedCars});
  }

  refreshStateRemove(carId) {
    const updatedCarIndex = this.state.cars.findIndex(c => c._id === carId);
    if (updatedCarIndex >= 0) {
      const updatedCars = [...this.state.cars];
      updatedCars.splice(updatedCarIndex, 1);
      const updatedSelectedCars = this.state.selectedModel ? computeSelectedCars(updatedCars, this.state.selectedModel) : [];
      this.setState({ selectedCars: updatedSelectedCars, cars: updatedCars });
    }
  }

  render() {

    const brandElements = this.state.brands.sort(sortBrands).map(brand => {
      const brandStats = this.state.brandMap[brand._id];
      const okCount = brandStats && brandStats.okCount ? brandStats.okCount : 0;
      const totalCount = brandStats && brandStats.totalCount ? brandStats.totalCount : 0;
      const isSelected = this.state.selectedBrand && this.state.selectedBrand._id === brand._id;
      const buttonClassNames = computeButtonClassNames(isSelected, okCount, totalCount);
      return (
        <button key={ brand._id } onClick={() => {
            const selectedModels = this.state.models.filter(model => model.brand.name === brand.name);
            this.setState({selectedBrand: brand, selectedModels, selectedCars: [], selectedModel: null});
          }}
          className={buttonClassNames.join(' ')}>
          { brand.name }
        </button>
      );
    });

    const modelElements = this.state.selectedModels.sort(sortModels).map(model => {
      const modelStats = this.state.modelMap[model._id];
      const okCount = modelStats && modelStats.okCount ? modelStats.okCount : 0;
      const totalCount = modelStats && modelStats.totalCount ? modelStats.totalCount : 0;
      const isSelected = this.state.selectedModel && this.state.selectedModel._id === model._id;
      const buttonClassNames = computeButtonClassNames(isSelected, okCount, totalCount);
      return (
        <button key={ model._id } title={ model.favcarsName } onClick={() => {
          const selectedCars = computeSelectedCars(this.state.cars, model);
            this.setState({selectedModel: model, selectedCars});
          }}
          className={buttonClassNames.join(' ')}>
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
            nomatch={carId => noCarImageMatch(carId).then(updatedCar => this.refreshState(updatedCar))}
            select={(carId, variantName, url) => selectCarImage(carId, variantName, url).then(updatedCar => this.refreshState(updatedCar))}
            unselect={carId => this.unselect(carId)}>
          </PickImages>
        );
        break;
      case CREATE_UPDATE_DELETE_VARIANTS:
        if (this.state.selectedModel) {
          selectedMenuElement = (
            <CrudCars 
              selectedModel={this.state.selectedModel}
              selectedCars={this.state.selectedCars}
              removeCar={carId => { removeCar(carId); this.refreshStateRemove(carId); }}
              createCar={car => { createCar(car); this.refreshState(car); }}>
            </CrudCars>
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
          <hr style={{ color: 'white', width: '100%' }} />
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
