export const check = (req, res) => {
    try {
        res.status(200).send('Health check: PASS!')
    } catch (e) {
        res.status(400).send(e)
    }
}