import Router from './Router/Router';
import SearchParamsManager from './SearchParamsManager';
import SoundManager from './SoundManager';

const App = () => (
  <div className="App">
    <Router />
    <SoundManager />
    <SearchParamsManager />
  </div>
);

export default App;
