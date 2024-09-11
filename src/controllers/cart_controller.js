import Cart from '../models/Cart';

const cart = new Cart();

export const addToCart = (req, res) => {
    const { productId, quantity } = req.body;
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    cart.addProduct(product, quantity);
    res.json(cart.items);
};

export const removeFromCart = (req, res) => {
    const { productId } = req.params;
    cart.removeProduct(parseInt(productId));
    res.json(cart.items);
};

export const viewCart = (req, res) => {
    res.json({
        items: cart.items,
        totalPrice: cart.getTotalPrice(),
    });
};
