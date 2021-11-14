const config = {
    production: {
        SMTP_USER: process.env.SERVER_USER,
        SMTP_PASS: process.env.SERVER_PASS,
        PORT: process.env.PORT,
    },
    default: {
        SMTP_USER: process.env.SERVER_USER,
        SMTP_PASS: process.env.SERVER_PASS,
        PORT: process.env.PORT,
    }
}


exports.get = function get(env) {
    return config[env] || config.default
}
