export const check = (req, res) => {
    try {
        res.status(200).send('Health check: PASS! Github Actions online!')
    } catch (e) {
        res.status(400).send(e)
    }
}