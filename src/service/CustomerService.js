export const CustomerService = {
    getCustomersLarge() {
      // Simulando dados de clientes
      return Promise.resolve([
        {
          id: 1,
          name: 'Yagoo Pereira',
          country: { name: 'Brasil', code: 'BR' },
          representative: { name: 'Amy Elsner', image: 'amyelsner.png' },
          date: '2023-10-01',
          balance: 2500,
          status: 1,
          activity: 60
        },
        {
          id: 2,
          name: 'Jane Roe',
          country: { name: 'Germany', code: 'DE' },
          representative: { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
          date: '2023-09-21',
          balance: 3200,
          status: 0,
          activity: 80
        }
      ]);
    }
  };
  