import { Toaster } from 'react-hot-toast';
import Router from './Router/Router';
import SoundManager from './SoundManager';
import { MIDIProvider } from '@react-midi/hooks';
import LiveMIDIInput from 'src/features/InputOutput/LiveMIDIInput';

const App = () => (
  <div className="App">
    <MIDIProvider>
      <Router />
      <SoundManager />
      <LiveMIDIInput />
      <Toaster />
    </MIDIProvider>
  </div>
);

export default App;
