import { Toaster } from 'react-hot-toast';

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
<<<<<<< HEAD
      <Toaster />
=======
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#ffffff'
          }
        }}
      />
>>>>>>> d39fdf3 (added toast and zod)
    </MIDIProvider>
  </div>
);

export default App;
