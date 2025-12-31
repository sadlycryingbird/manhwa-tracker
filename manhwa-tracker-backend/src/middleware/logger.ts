const logger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        console.log(
            `Timestamp: ${new Date().toISOString()} | Request Type: ${req.method} | Request URL: ${req.url} | Status Code: ${res.statusCode} | Time Took: ${duration}ms`
        );
    });

    next();
};

export default logger;
