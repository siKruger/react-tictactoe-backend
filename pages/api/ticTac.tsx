import {fieldValue} from "../../Types";
import {sessions} from "./gameSessions"


let sessionBoards = {}
let nextPlayerInSession = {}


async function tic(req, res) {


    //Board kriegen
    if (req.method === 'POST') {
        const reqSessionId = req.body.id

        if (sessionBoards[reqSessionId] === undefined) {
            sessionBoards[reqSessionId] = [{squares: Array(9).fill(undefined), player: "X", winner: undefined}];
            nextPlayerInSession[reqSessionId] = {nextPlayerIs: "X"}

        }

        const boardInThisSession = sessionBoards[req.body.id]
        const squares = boardInThisSession[boardInThisSession.length - 1]

        res.json({squares})
        res.status(200).end();
    }


    if (req.method === 'PUT') {
        const reqSessionId = req.body.id
        const requestedPlayer = req.body.myPlayer;
        const newBoard = req.body.board;
        const correspondingSession = sessions[reqSessionId];

        let clientIs;


        if (correspondingSession.x != undefined && correspondingSession.x === requestedPlayer) {
            clientIs = "X"
        } else if (correspondingSession.o != undefined && correspondingSession.o === requestedPlayer) {
            clientIs = "O"
        } else {
            res.status(404).end();
            return
        }


        if (nextPlayerInSession[reqSessionId].nextPlayerIs === clientIs) {
            if (nextPlayerInSession[reqSessionId].nextPlayerIs === "O") {
                nextPlayerInSession[reqSessionId] = {nextPlayerIs: "X"}
            } else {
                nextPlayerInSession[reqSessionId] = {nextPlayerIs: "O"}
            }
            saveNewStep(reqSessionId, newBoard)
            res.status(202).end();
        } else {
            res.status(404).end();
            return
        }
    }



    if (req.method === 'DELETE') {
        const sessionId = req.body.id

        nextPlayerInSession[sessionId] = {nextPlayerIs: "X"}
        sessionBoards[sessionId] = [{squares: Array(9).fill(undefined), player: "X", winner: undefined}];
        res.status(202).end();
        return;
    }

}


function saveNewStep(sessionId, clientBoard): void {

    const win = calculateWinner(clientBoard);


    sessionBoards[sessionId].push({
        squares: clientBoard,
        player: nextPlayerInSession[sessionId].nextPlayerIs,
        winner: win
    })



    if (win === undefined && isFieldFull(clientBoard)) {
        nextPlayerInSession[sessionId] = {nextPlayerIs: "X"}
        sessionBoards[sessionId] = [{squares: Array(9).fill(undefined), player: "X", winner: undefined}];
    }
}


function isFieldFull(squares: fieldValue[]): boolean {
    let fullFields = 0;
    squares.forEach(element => {
        if (element == "X" || element == "O") {
            fullFields++;
        }
    })

    return (fullFields == 9)
}


function calculateWinner(squares: fieldValue[]) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return undefined;
}

export default tic;
