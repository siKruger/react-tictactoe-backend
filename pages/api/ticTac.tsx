import {NextApiRequest, NextApiResponse} from "next";
import {escapeJson} from "@hapi/hoek";



let history = [{squares: Array(9).fill(undefined), player: "X", winner: undefined}];

export default function foo(req: NextApiRequest, res: NextApiResponse) {

    return new Promise(resolve => {
        //Get latest Field
        // @ts-ignore
        if (req.method == 'GET') {
            const squares = history[history.length - 1];
            res.json({squares})
        }

        if(req.method == 'DELETE') {
            history = [{squares: Array(9).fill(undefined), player: "X", winner: undefined}];
        }

        //Send newest Field
        // @ts-ignore
        if (req.method == 'POST') {

            saveNewHistory(req.body.board, req.body.player);
            res.status(200).end()
            return resolve();
        }
        return resolve();
    })
}


function saveNewHistory(clientBoard, clientPlayer) {
    let newNextPlayer;
    if(clientPlayer == "X") {newNextPlayer = "O"} else {newNextPlayer = "X"}

    const win = calculateWinner(clientBoard);

    history.push({squares: clientBoard, player: newNextPlayer, winner: win});

    console.log(history);
}


function calculateWinner(squares) {
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
