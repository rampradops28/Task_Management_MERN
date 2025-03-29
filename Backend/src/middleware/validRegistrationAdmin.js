export const validRegistartionAdmin = function(req, res, next) {
    const {username, email, password, usertype} = req.body;

        // Validation
        if(!username || !email || !password || usertype !== 'admin') {
            return res.status(400).send({
                success: false,
                message: "Please Provide All Fields and User Should be Admin"
            });
        };

    next(); // Move to the next middleware/controller if validation passes
};