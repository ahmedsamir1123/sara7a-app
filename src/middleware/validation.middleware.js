export const isValid = (schema)=>{


    return (req, res, next) => {

        const { value, error } = schema.validate(req.body, { abortEarly: false })
        if (error) {
            let errmessage = error.details.map(({ message }) => message).join(", ");
            console.log(errmessage);
    
            throw new Error("joi valdate error", { cause: 400 });
        }
    
        next()
    }
}