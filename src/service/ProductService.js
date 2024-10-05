export const ProductService = {
    getProductsMini() {
      // Simulação de dados de produtos
      return Promise.resolve([
        { code: 'P1001', name: 'Product 1', category: 'Category A', quantity: 100 },
        { code: 'P1002', name: 'Product 2', category: 'Category B', quantity: 150 },
        { code: 'P1003', name: 'Product 3', category: 'Category C', quantity: 200 },
        { code: 'P1004', name: 'Product 4', category: 'Category A', quantity: 90 },
      ]);
    }
  };
  