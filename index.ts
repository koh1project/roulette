type Data = {
  number: number;
  selected: boolean;
  flashing: boolean;
};

const getUnselectedIndices = (rouletteData: Data[]):number[] => {
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
}

const colorList: ColorList = {
  selected: Color.ORANGE,
  flashing: Color.RED,
}

type State = {
  rouletteData : Data[];
  unSelectedIndices: number[];
  rouletteTimerId: number | null;
}

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
}
const shuffleArray = (arr: number[]) => {
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

const createRouletteItem = (data: Data) => {
  const node = document.createElement('div');
  node.textContent = data.number.toString();
  node.className = `roulette__number`
  node.style.backgroundColor = data.selected ? colorList.selected : data.flashing ?  colorList.flashing : '';
  return node;
};

const buildNewNode = (newRouletteData: Data[]) => {
  const newNode = document.createElement('div');
  newNode.className = 'roulette';
  for (const data of newRouletteData) {
    newNode.appendChild(createRouletteItem(data));
  }

  return newNode;
}

const flushRoulette = (newRouletteData: Data[]) => {
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

const resetRoulette = () => {
  state.rouletteData = state.rouletteData.map(data =>{ return{...data, flashing: false, selected: false}});
  state.unSelectedIndices = buildShuffledUnselectedIndices();
}

const rouletteObserver = () => {
  let prevRouletteData = state.rouletteData;
  setInterval(() => {
    if(prevRouletteData === state.rouletteData) {
      return;
    }
    const newRouletteData = flushRoulette(state.rouletteData);
    prevRouletteData = newRouletteData;
    state.rouletteData = newRouletteData;
  }, 10);
}
rouletteObserver();


const startButton = document.getElementsByClassName('start-button')[0];
const resetButton = document.getElementsByClassName('reset-button')[0];
const stopButton = document.getElementsByClassName('stop-button')[0];

const onClickStartButton = () => {
  state.rouletteData = state.rouletteData.map(data => {
    return {...data, selected: (data.selected || data.flashing), flashing: false}
  });
  return startRoulette();
};

const startRoulette = (unselectedIndex = 0) => {
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

const onClickStopButton = (timerId: number) => {
  clearInterval(timerId);
  state.unSelectedIndices = buildShuffledUnselectedIndices();
  return null;
};

startButton.addEventListener('click', () => {
  onClickStartButton();
})

resetButton.addEventListener('click', () => {
  resetRoulette();
});

stopButton.addEventListener('click', () => {
  const timerId = state.rouletteTimerId;
  if (timerId) {
    state.rouletteTimerId = onClickStopButton(timerId);
  }
});
