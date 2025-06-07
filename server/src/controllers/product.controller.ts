import { Request, Response } from 'express';
import { AppDataSource } from '../index';
import { Product } from '../models/Product';
import { Producer } from '../models/Producer';

// Get all products (for customers)
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find({
      relations: ['producer'],
      where: { isAvailable: true }
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get a single product by ID (for customers and public access)
export const getProductById = async (req: Request, res: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const { id } = req.params;

    const product = await productRepository.findOne({
      where: { id },
      relations: ['producer'],
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Get products by producer (for producer's admin panel)
export const getProducerProducts = async (req: Request, res: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const producerId = req.user?.userId;
    const products = await productRepository.find({
      where: { producer: { user: { id: producerId } } }
    });

    // Ensure price is a number for frontend consumption
    const productsResponse = products.map(product => ({
      ...product,
      price: parseFloat(product.price.toString()),
    }));

    res.json(productsResponse);
  } catch (error) {
    console.error('Error fetching producer products:', error);
    res.status(500).json({ message: 'Error fetching producer products' });
  }
};

// Create new product (for producers)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const producerRepository = AppDataSource.getRepository(Producer);
    const producerId = req.user?.userId;

    console.log("Attempting to create product for producerId:", producerId);

    const producer = await producerRepository.findOne({
      where: { user: { id: producerId } }
    });

    console.log("Found producer:", producer);

    if (!producer) {
      return res.status(404).json({ message: 'Producer not found' });
    }

    // Extract product data from form data
    const { name, price, stock, category, unit, description } = req.body;
    
    // Validate required fields
    if (!name || !price || !stock || !category || !unit) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['name', 'price', 'stock', 'category', 'unit']
      });
    }

    console.log("Received req.file:", req.file);

    const product = new Product();
    product.name = name;
    product.price = parseFloat(price);
    product.stock = parseInt(stock);
    product.category = category;
    product.unit = unit;
    product.description = description || '';
    product.producer = producer;

    // Handle uploaded image
    if (req.file) {
      product.images = [req.file.filename];
    } else {
      product.images = [];
    }

    console.log("Creating product with data:", product);

    await productRepository.save(product);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// Update product (for producers)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const { id } = req.params;
    const producerId = req.user?.userId;

    const product = await productRepository.findOne({
      where: { 
        id,
        producer: { user: { id: producerId } }
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    Object.assign(product, req.body);
    await productRepository.save(product);
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete product (for producers)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const { id } = req.params;
    const producerId = req.user?.userId;

    const product = await productRepository.findOne({
      where: { 
        id,
        producer: { user: { id: producerId } }
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await productRepository.remove(product);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
}; 