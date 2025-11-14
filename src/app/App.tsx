import { MIDIProvider } from '@react-midi/hooks';

import LiveMIDIInput from 'src/features/InputOutput/LiveMIDIInput';

import Router from './Router/Router';
import SoundManager from './SoundManager';

const App = () => (
  <div className="App">
    <MIDIProvider>
      <Router />
      <SoundManager />
      <LiveMIDIInput />
    </MIDIProvider>
  </div>
);

export default App;
