import express from 'express';
import Product from '../models/products.model.js';

const viewsRouter = express.Router();

viewsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, category, status, sort } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status === "true";

    const sortOptions = {};
    if (sort === "asc") sortOptions.price = 1;
    if (sort === "desc") sortOptions.price = -1;

    const data = await Product.paginate(filter, { limit, page, sort: sortOptions, lean: true });

    const products = data.docs;
    delete data.docs;

    const links = [];

    for(let i = 1; i <= data.totalPages; i++){
      links.push({ page: i, link: `?limit=${limit}&page=${i}` }); 
    }

    res.render("home", { products, links });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

export default viewsRouter;