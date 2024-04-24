declare module 'audiokeys' {
  interface Key {
    frequency: number;
    note: number;
  }

  interface Keyboard {
    rows: number;
  }

  export default class AudioKeys {
    Keyboard: Keyboard;

    constructor(Keyboard: Keyboard) {
      this.Keyboard = Keyboard;
    }

    /**
     * event handling when the user presses a keyboard key
     */
    public down(params: (key: Key) => void);

    /**
     * handling an event when the user releases a keyboard key
     */
    public up(params: (key: Key) => void);
  }
}
