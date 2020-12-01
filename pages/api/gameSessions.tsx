import {v4 as uuidv4} from 'uuid';

export const sessions = {}

export default function gameSession(req, res) {
    if (!(req.method === "POST")) {
        res.status(405).end();
        return;
    }

    const sessionName = req.body.sessionName


    const sessionId = uuidv4()
    const session = sessions[sessionId] = {name: sessionName}

    res.json({...session, id: sessionId})
    res.status(201).end()
}
