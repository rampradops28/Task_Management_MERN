export const validRegistartion = function(req, res, next) {
    const {username, email, password} = req.body;

        // Validation
        if(!username || !email || !password) {
            return res.status(400).send({
                success: false,
                message: "Please Provide All Fields"
            });
        };

    next(); // Move to the next middleware/controller if validation passes
};