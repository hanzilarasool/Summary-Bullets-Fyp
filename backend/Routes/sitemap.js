const express = require("express");
const router = express.Router();
const generateSitemap = require("../generateSiteMap");

router.get("/sitemap.xml", async (req, res) => {
  try {
    const hostname = process.env.CORS_ORIGIN;
    const sitemap = await generateSitemap(hostname);
    //res.json({ sitemapData: sitemap.toString() });
    res.type("application/xml").send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).json({ error: "Error generating sitemap" });
  }
});

module.exports = router;
