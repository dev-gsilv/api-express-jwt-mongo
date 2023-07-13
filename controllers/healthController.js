export const check = (req, res) => {
    try {
        res.status(200).send('Health check: PASS! Github Actions online! Now for sure!')
    } catch (e) {
        res.status(400).send(e)
    }
}