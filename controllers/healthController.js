const healthControler = {
    check: (req, res) => {
        try {
            res.status(200).json({msg: 'health check pass.'})
        } catch (e) {
            console.error(e)
        }        
    } 
}

module.exports = healthControler