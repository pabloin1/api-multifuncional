const { Router } = require("express");
const { buscar } = require("../controllers/buscar.controller");

const router = Router();

router.get("/:col/:ter", buscar);

module.exports = router;
