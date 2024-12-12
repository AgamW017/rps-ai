movemap = {
    rock: 0,
    paper: 1,
    scissors: 2
}
movemap_rev = {
    0: "Rock",
    1: "Paper",
    2: "Scissors"
}

const ai_output = (move) => {
    let nmove = movemap[move]
    let aimove = getmove()
    storemove(nmove)
    let naimove = movemap_rev[aimove]
    if (nmove == aimove) {
        return [naimove,0]
    }
    else if ((nmove +1)%3 == aimove) {
        return [naimove, -1]
    }
    else{
        return [naimove, 1]
    }
}