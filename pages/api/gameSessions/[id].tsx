import {sessions} from "../gameSessions"
import {v4 as uuidv4} from 'uuid';


export default function joinSession(req, res) {
    if(!(req.method === "PUT")) {
        res.status(405).end();
        return;
    }

    const {
        query: { id },
    } = req


    if(sessions[id] == undefined) {
        res.status(404).end()
        return
    }


    const x = sessions[id]
    const playerId = uuidv4()


    if(!x.x) {
        sessions[id].x = playerId
        res.json({...x, id, you: playerId, youAre: "X"})
    } else if(!x.o) {
        sessions[id].o = playerId
        res.json({...x, id, you: playerId, youAre: "O"})
    } else {
        res.status(404).end()
    }
}
