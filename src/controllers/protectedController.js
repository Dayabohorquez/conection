// path/to/controllers.js
export const clientPage = (req, res) => {
    // Aquí puedes agregar lógica adicional para verificar el rol si es necesario
    res.status(200).json({ message: 'Página del cliente' });
  };
  
  export const sellerPage = (req, res) => {
    // Aquí puedes agregar lógica adicional para verificar el rol si es necesario
    res.status(200).json({ message: 'Página del vendedor' });
  };
  
  export const deliveryPage = (req, res) => {
    // Aquí puedes agregar lógica adicional para verificar el rol si es necesario
    res.status(200).json({ message: 'Página del domiciliario' });
  };
  
  export const adminPage = (req, res) => {
    // Aquí puedes agregar lógica adicional para verificar el rol si es necesario
    res.status(200).json({ message: 'Página del administrador' });
  };
  