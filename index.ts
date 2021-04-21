type RouletteData = {
  number: number;
  selected: boolean;
  flashing: boolean;
};

const getUnselectedIndices = (rouletteData: RouletteData[]): number[] => {
  const newIndices =  rouletteData.map((data, index) => {
    return (!data.selected && !data.flashing) ? index : null
  })
    .filter(index => {
      if (index !== null) {
        return true;
      }
      return false;
      }) as number[];
  return newIndices;
};

type ValueOf<T> = T[keyof T];

const Color = {
  ORANGE: 'ORANGE',
  RED: 'RED',
} as const;

type ColorList = {
  selected: ValueOf<typeof Color>;
  flashing: ValueOf<typeof Color>;
};

const colorList: ColorList = {
  selected: Color.ORANGE,
  flashing: Color.RED,
};

type State = {
  rouletteData : RouletteData[];
  unSelectedIndices: number[];
  rouletteTimerId: number | null;
};

let state: State = {
  rouletteData: [
    { number: 1, selected: false, flashing: false},
    { number: 2, selected: false, flashing: false},
    { number: 3, selected: false, flashing: false},
    { number: 4, selected: false, flashing: false},
    { number: 5, selected: false, flashing: false},
    { number: 6, selected: false, flashing: false},
    { number: 7, selected: false, flashing: false},
    { number: 8, selected: false, flashing: false},
    { number: 9, selected: false, flashing: false},
    { number: 10, selected: false, flashing: false},
    { number: 11, selected: false, flashing: false},
    { number: 12, selected: false, flashing: false},
    { number: 13, selected: false, flashing: false},
    { number: 14, selected: false, flashing: false},
    { number: 15, selected: false, flashing: false},
    { number: 16, selected: false, flashing: false},],
  unSelectedIndices: [],
  rouletteTimerId : null,
};

const shuffleArray = (arr: number[]): number[] => {
  let counter = arr.length;
  while (counter > 0) {
      const index = Math.floor((Math.random() * counter));
      counter--;
      // Swap two values
      [arr[counter], arr[index]] = [arr[index], arr[counter]];
  }
  return arr;
};

const buildShuffledUnselectedIndices = () => shuffleArray(getUnselectedIndices(state.rouletteData));

state.unSelectedIndices = buildShuffledUnselectedIndices();

const createRouletteItem = (data: RouletteData) => {
  const node = document.createElement('div');
  node.textContent = data.number.toString();
  node.className = `roulette__number`
  node.style.backgroundColor = data.selected ? colorList.selected : data.flashing ?  colorList.flashing : '';
  return node;
};

const buildNewNode = (newRouletteData: RouletteData[]): HTMLDivElement => {
  const newNode = document.createElement('div');
  newNode.className = 'roulette';
  for (const data of newRouletteData) {
    newNode.appendChild(createRouletteItem(data));
  }

  return newNode;
}

const flushRoulette = (newRouletteData: RouletteData[]): RouletteData[] => {
  const newNode = buildNewNode(newRouletteData);
  let parentNode;
  try {
    const currentNode = document.body.querySelector('.roulette');
    parentNode = currentNode! as Node;
    parentNode.parentNode!.replaceChild(newNode, parentNode);

  } catch (error) {
    console.log('error: ', error);
  }

  return newRouletteData;
}

const resetRoulette = (): void => {
  state.rouletteData = state.rouletteData.map(data =>{ return{...data, flashing: false, selected: false}});
  state.unSelectedIndices = buildShuffledUnselectedIndices();
}

const rouletteObserver = (): void => {
  let lastModifiedRouletteData = state.rouletteData;
  setInterval(() => {
    if(lastModifiedRouletteData === state.rouletteData) {
      return;
    }
    const newRouletteData = flushRoulette(state.rouletteData);
    lastModifiedRouletteData = newRouletteData;
    state.rouletteData = newRouletteData;
  }, 10);
}
flushRoulette(state.rouletteData); // First flush
rouletteObserver();


/*
 *******************************
 * Button Block
 *******************************
*/

const ButtonActionTypes = {
  START: 'START',
  STOP: 'STOP',
  RESET: 'RESET',
} as const;

type ActionStatus =  ValueOf<typeof ButtonActionTypes>;

type StateButton = {
  actionStatus: ActionStatus;
  startButton: HTMLButtonElement;
  resetButton: HTMLButtonElement;
  stopButton: HTMLButtonElement;
};

const stateButton: StateButton = {
  actionStatus: ButtonActionTypes.RESET,
  startButton: document.getElementsByClassName('start-button')[0] as HTMLButtonElement,
  resetButton: document.getElementsByClassName('reset-button')[0] as HTMLButtonElement,
  stopButton:  document.getElementsByClassName('stop-button')[0] as HTMLButtonElement,
};

const startRoulette = (unselectedIndex = 0): void => {
  state.rouletteTimerId = setTimeout(() => {
    const changedRouletteData = state.rouletteData.map(data => {
      // Make a copy data which all flashing properties are false
      return {...data,flashing: false}}
    );

  if (state.unSelectedIndices.length !== 0){
    changedRouletteData[state.unSelectedIndices[unselectedIndex]].flashing = true;
  }
    state.rouletteData = changedRouletteData;
    const nextUnselectedIndex = (++unselectedIndex >= state.unSelectedIndices.length) ? 0 : unselectedIndex;
    startRoulette(nextUnselectedIndex);
  }, 100);
};

const onClickStartButton = (): void => {
  state.rouletteData = state.rouletteData.map(data => {
    return {...data, selected: (data.selected || data.flashing), flashing: false}
  });
  return startRoulette();
};

const onClickStopButton = (timerId: number): null => {
  clearInterval(timerId);
  state.unSelectedIndices = buildShuffledUnselectedIndices();
  return null;
};

const startButtonClicked = (): void => {
  stateButton.startButton.disabled = true;
  stateButton.stopButton.disabled = false;
  stateButton.resetButton.disabled = true;
}

const stopButtonClicked = (): void => {
  stateButton.startButton.disabled = state.unSelectedIndices.length === 0;
  stateButton.stopButton.disabled = true;
  stateButton.resetButton.disabled = false;
}

const resetButtonClicked = (): void => {
  stateButton.startButton.disabled = false;
  stateButton.stopButton.disabled = true;
  stateButton.resetButton.disabled = true;
}

const changeButtonAttribute = (actionStatus: ActionStatus): void => {
  switch (actionStatus) {
    case ButtonActionTypes.START:
      startButtonClicked();
      break;
    case ButtonActionTypes.STOP:
      stopButtonClicked();
      break;
    case ButtonActionTypes.RESET:
      resetButtonClicked();
      break;
    default: break;
  }
}

stateButton.startButton.addEventListener('click', () => {
  stateButton.actionStatus = ButtonActionTypes.START;
  onClickStartButton();
})

stateButton.resetButton.addEventListener('click', () => {
  stateButton.actionStatus = ButtonActionTypes.RESET;
  resetRoulette();
});

stateButton.stopButton.addEventListener('click', () => {
  stateButton.actionStatus = ButtonActionTypes.STOP;
  const timerId = state.rouletteTimerId;
  if (timerId) {
    state.rouletteTimerId = onClickStopButton(timerId);
  }
});

const buttonObserver = (): void => {
  let storedStatus = stateButton.actionStatus;
  console.log('stateButton.actionStatus: ', stateButton.actionStatus);

  setInterval(() => {
    if (storedStatus === stateButton.actionStatus){
      return;
    }
    changeButtonAttribute(stateButton.actionStatus);
    storedStatus = stateButton.actionStatus;
  }, 10);
}
buttonObserver();