const Product = require('../models/Product');

// Simular una "base de datos" en memoria para productos
let products = [
    new Product(1, 'Laptop', 1000, 10, 'https://example.com/laptop.jpg'),
    new Product(2, 'Mouse', 20, 50, 'https://example.com/mouse.jpg'),
];

// Obtener todos los productos
exports.getAllProducts = (req, res) => {
    res.json(products);
};

// Crear un nuevo producto
exports.createProduct = (req, res) => {
    const { name, price, stock, imageUrl } = req.body;
    const newProduct = new Product(products.length + 1, name, price, stock, imageUrl);
    products.push(newProduct);
    res.status(201).json(newProduct);
};
