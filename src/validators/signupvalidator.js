const isEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
const signupValidator = ({ name, dob, email, password, confirmPassword }) => {
    const errors = {
        name: "",
        dob: "",
        email: "",
        password: "",
        confirmPassword: "",
    }

    if (!name) {
        errors.name = "Name is required"
    }
    if (!dob) {
        errors.dob = "Date of Birth is required"
    }
    if (!email) {
        errors.email = "Email is required"
    } else if (!isEmail(email)) {
        errors.email = "Email is invalid"
    }
    if (!password) {
        errors.password = "Password is required"
    } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters long"
    }
    if (!confirmPassword) {
        errors.confirmPassword = "Confirm Password is required"
    }
    if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match"
    }
    return errors
}
export default signupValidator;