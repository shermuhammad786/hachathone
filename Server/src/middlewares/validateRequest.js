export const validateRequest = (schema) => {
    const options = {
      errors: {
        wrap: {
          label: false,
        },
      },
    };
      return (req, res, next) => {
        const { error, value } = schema.validate(req.body, options);
        if (error) {
          let result;
          if (error.details && error.details[0].type === "phoneNumber.invalid") {
            result =
              "Invalid phone number. Please provide a valid international phone number.";
          } else {
            result = error.details[0].message;
          }
  
          return res.status(400).json({ message: result });
        }
  
        req.validatedBody = value;
        next();
      };
  };
  