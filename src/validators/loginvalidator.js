const isEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const loginValidator = ({ email, password }) => {
    const errors = {
        email: "",
        password: "",
    }

    if (!email) {
        errors.email = "Email is required";
    } else if (!isEmail(email)) {
        errors.email = "Email is invalid";
    }

    if (!password) {
        errors.password = "Password is required";
    }

    return errors;
}

export default loginValidator;
