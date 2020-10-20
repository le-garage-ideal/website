import React from 'react';
import { filter, } from 'rxjs/operators';
import { PickImages } from './components/PickImages';
import { CrudCars } from './components/CrudCars';
import { Menu, CHOOSE_IMAGES_MENU, CREATE_UPDATE_DELETE_VARIANTS } from './components/Menu';
import { sortBrands, sortModels } from './functions/sort';
import { fetchInitData, noCarImageMatch, selectCarImage, createCar, removeCar, computeSelectedCars } from './functions/car';
import { authenticate, currentUserObservable } from './functions/api';
import { Login } from './components/Login';
import './App.css';

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
      user: null,
      cars: [],
      brands: [],
      selectedBrand: null,
      selectedModels: [],
      selectedModel: null,
      selectedCars: [],
      selectedMenu: null,
      errorMessage: null,
    };

    this.loginProcess = this.loginProcess.bind(this);
    this.unselect = this.unselect.bind(this);
    this.refreshState = this.refreshState.bind(this);
    this.refreshState = this.refreshState.bind(this);
    this.refreshStateRemove = this.refreshStateRemove.bind(this);
  }

  componentDidMount() {
    currentUserObservable.pipe(
      filter(currentUser => !!currentUser),
    ).subscribe(user => {
      fetchInitData().then(initData => {
        this.setState({ ...initData, user });
      })
    });
  }

  loginProcess(authFields) {
    authenticate(authFields)
      .then(success => {
        currentUserObservable.next({
          username: success.username,
          token: success.token
        });
      })
      .catch(error => {
        this.setState({
          errorMessage: error.errorMessage
        });
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

    const {
      user,
      selectedMenu,
      brands,
      brandMap,
      selectedBrand,
      models,
      modelMap,
      selectedModels,
      selectedModel,
      cars,
      selectedCars,
      errorMessage,
    } = this.state;

    const brandElements = brands.sort(sortBrands).map(brand => {
      const brandStats = brandMap[brand._id];
      const okCount = brandStats && brandStats.okCount ? brandStats.okCount : 0;
      const totalCount = brandStats && brandStats.totalCount ? brandStats.totalCount : 0;
      const isSelected = selectedBrand && selectedBrand._id === brand._id;
      const buttonClassNames = computeButtonClassNames(isSelected, okCount, totalCount);
      return (
        <button key={ brand._id } onClick={() => {
          const selectedModels = models.filter(model => model.brand.name === brand.name);
            this.setState({selectedBrand: brand, selectedModels, selectedCars: [], selectedModel: null});
          }}
          className={buttonClassNames.join(' ')}>
          { brand.name }
        </button>
      );
    });

    const modelElements = selectedModels.sort(sortModels).map(model => {
      const modelStats = modelMap[model._id];
      const okCount = modelStats && modelStats.okCount ? modelStats.okCount : 0;
      const totalCount = modelStats && modelStats.totalCount ? modelStats.totalCount : 0;
      const isSelected = selectedModel && selectedModel._id === model._id;
      const buttonClassNames = computeButtonClassNames(isSelected, okCount, totalCount);
      return (
        <button key={ model._id } title={ model.favcarsName } onClick={() => {
          const selectedCars = computeSelectedCars(cars, model);
            this.setState({selectedModel: model, selectedCars});
          }}
          className={buttonClassNames.join(' ')}>
          { model.name }
        </button>
      );
    });

    let selectedMenuElement = null;
    switch (selectedMenu) {
      case CHOOSE_IMAGES_MENU:
        selectedMenuElement = (
          <PickImages
            selectedBrand={selectedBrand}
            selectedModel={selectedModel}
            selectedCars={selectedCars}
            nomatch={carId => noCarImageMatch(carId).then(updatedCar => this.refreshState(updatedCar))}
            select={(carId, variantName, url) => selectCarImage(carId, variantName, url).then(updatedCar => this.refreshState(updatedCar))}
            unselect={this.unselect}>
          </PickImages>
        );
        break;
      case CREATE_UPDATE_DELETE_VARIANTS:
        if (selectedModel) {
          selectedMenuElement = (
            <CrudCars 
              selectedModel={selectedModel}
              selectedCars={selectedCars}
              removeCar={carId => { removeCar(carId); this.refreshStateRemove(carId); }}
              createCar={car => { createCar(car); this.refreshState(car); }}>
            </CrudCars>
          );
        }
        break;
      default:
        selectedMenuElement = '';
    }

    const headerBrandModelElements = (
      <>
        { !!selectedMenu && <hr className="separator" />}
        <section>{selectedMenu && brandElements}</section>
        { selectedModels.length > 0 && <hr className="separator" />}
        <section>{modelElements}</section>
      </>
    );

    return (
      <div className="App">
        <header className="App-header">
          <section className="top">
            <section className="title-logo">
              <img alt="logo" src="logo.png" />
              <h1>
                Admin
                App
              </h1>
              {user && <div style={{ marginLeft: '10px' }}>👤{` ${user.username}`}</div>}
            </section>
            {user && <Menu menuSelect={selectedMenu => this.setState({ selectedMenu })} />}
          </section>
          {user && headerBrandModelElements}
        </header>
        <main className="App-main">
          {user && selectedMenuElement}
          {!user && <Login onSubmit={this.loginProcess} errorMessage={errorMessage} />}
        </main>
      </div>
    );
  }
}

export default App;
