const mapper = {
    rock: 0,
    paper: 1,
    scissors: 2
};
const revMapper = {
    0: "Rock",
    1: "Paper",
    2: "Scissors"
};

let matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];
let freq = [0, 0, 0];
let history = [];
let score = [0, 0, 0];

const initiate = () => {
    matrix = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    freq = [0, 0, 0];
    history = [];
    score = [0, 0, 0];
};

const getMove = () => {
    if (history.length < 2) {
        return Math.floor(Math.random() * 3);
    }
    const last = history[history.length - 1];
    const arr = matrix[last];
    const arrSum = arr[0] + arr[1] + arr[2];
    const freqSum = freq[0] + freq[1] + freq[2];
    const prob = [
        5 * (arr[0] / arrSum) + 3 * ((freqSum - freq[0]) / freqSum) + 2 * Math.random(),
        5 * (arr[1] / arrSum) + 3 * ((freqSum - freq[1]) / freqSum) + 2 * Math.random(),
        5 * (arr[2] / arrSum) + 3 * ((freqSum - freq[2]) / freqSum) + 2 * Math.random()
    ];
    return (prob.indexOf(Math.max(...prob)) + 1) % 3;
};

const updateMatrix = () => {
    if (history.length < 2) {
        return;
    }
    matrix = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    for (let i = 1; i < history.length; i++) {
        matrix[history[i - 1]][history[i]]++;
    }
};

const won = (player, ai) => {
    if (player === ai) {
        score[2]++;
        return 0;
    } else if (ai - player === 1 || ai - player === -2) {
        score[1]++;
        return -1;
    }
    score[0]++;
    return 1;
};

const aiOutput = (move) => {
    const aiMove = getMove();
    const aiMove1 = revMapper[aiMove];
    const move1 = mapper[move];
    freq[move1]++;
    history.push(move1);
    if (history.length > 12) {
        history.shift();
    }
    updateMatrix();
    return [aiMove1, won(move1, aiMove), score];
};

// Exporting the necessary functions
export { initiate, aiOutput };
