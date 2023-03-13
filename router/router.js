const url = require("url");
const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const needle = require("needle");
const apicache = require("apicache");
const { API_BASE_URL, API_KEY_NAME, API_KEY } = process.env;

const Limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
});
router.use(Limiter);
const cache = apicache.middleware;

const onlyStatus200 = (req, res) => res.statusCode === 200;

const cacheSuccesses = cache("5 minutes", onlyStatus200);
router.get("/", cacheSuccesses, async (req, res) => {
    try {
        const params = new URLSearchParams({
            appid: API_KEY,
            ...req.query,
        });
        if (process.env.NODE_ENV !== "production")
            console.log(`${API_BASE_URL}${params}`);
        const respond = await needle("get", `${API_BASE_URL}${params}`);
        res.json(respond.body);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
});
module.exports = router;
