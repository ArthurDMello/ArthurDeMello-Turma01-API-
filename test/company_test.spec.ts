const pactum = require('pactum');

describe('Company API Tests', () => {
  const baseUrl = 'https://api-desafio-qa.onrender.com/company';

  const validCompanyData = {
    name: 'Empresa Teste',
    cnpj: '12345678000195',
    state: 'SC',
    city: 'Criciuma',
    address: 'Rua Teste, 123',
    sector: 'Tecnologia'
  };

  const invalidCompanyData = {
    name: '',
    cnpj: '12345678000195',
    state: 'SC',
    city: 'Criciuma',
    address: 'Rua Teste, 123',
    sector: 'Tecnologia'
  };

  let companyId;

  // 1. Teste de criação de empresa com dados válidos
  it('POST /company - Successful creation', async () => {
    const response = await pactum
      .spec()
      .post(baseUrl)
      .withJson(validCompanyData)
      .expectStatus(201);

    companyId = response.json.id; // Salva o ID da empresa criada
    expect(response.json.name).toEqual(validCompanyData.name);
  });

  // 2. Teste de criação de empresa com CNPJ inválido
  it('POST /company - Error with invalid CNPJ', async () => {
    const response = await pactum
      .spec()
      .post(baseUrl)
      .withJson({ ...validCompanyData, cnpj: '123' }) // CNPJ inválido
      .expectStatus(400);
  });

  // 3. Teste de listagem de empresas
  it('GET /company - List of companies', async () => {
    await pactum
      .spec()
      .get(baseUrl)
      .expectStatus(200)
      .expectJsonLike([
        {
          id: companyId,
          name: validCompanyData.name,
          cnpj: validCompanyData.cnpj,
          state: validCompanyData.state,
          city: validCompanyData.city,
          address: validCompanyData.address,
          sector: validCompanyData.sector
        }
      ]);
  });

  // 4. Teste de busca por ID de empresa existente
  it('GET /company/:id - Get existing company', async () => {
    await pactum
      .spec()
      .get(`${baseUrl}/${companyId}`)
      .expectStatus(200)
      .expectJsonLike({
        id: companyId,
        name: validCompanyData.name
      });
  });

  // 5. Teste de busca por ID de empresa não existente
  it('GET /company/:id - Error for non-existing company', async () => {
    await pactum
      .spec()
      .get(`${baseUrl}/99999`) // ID que não existe
      .expectStatus(404);
  });

  // 6. Teste de atualização de empresa com dados válidos
  it('PUT /company - Update existing company', async () => {
    const updatedData = {
      ...validCompanyData,
      name: 'Empresa Teste Atualizada'
    };

    await pactum
      .spec()
      .put(`${baseUrl}/${companyId}`)
      .withJson(updatedData)
      .expectStatus(200)
      .expectJsonLike({
        id: companyId,
        name: updatedData.name
      });
  });

  // 7. Teste de erro ao atualizar empresa não existente
  it('PUT /company - Error for updating non-existing company', async () => {
    await pactum
      .spec()
      .put(`${baseUrl}/99999`) // ID que não existe
      .withJson(validCompanyData)
      .expectStatus(404);
  });

  // 8. Teste de erro de validação ao atualizar com dados inválidos
  it('PUT /company - Validation error when updating with invalid data', async () => {
    await pactum
      .spec()
      .put(`${baseUrl}/${companyId}`)
      .withJson(invalidCompanyData)
      .expectStatus(400); // Espera um erro de validação
  });

  // 9. Teste de exclusão de empresa
  it('DELETE /company - Successful deletion', async () => {
    await pactum.spec().delete(`${baseUrl}/${companyId}`).expectStatus(204); // Espera status 204 No Content
  });

  // 10. Teste de erro ao buscar empresa excluída
  it('GET /company/:id - Error for deleted company', async () => {
    await pactum.spec().get(`${baseUrl}/${companyId}`).expectStatus(404); // Espera status 404 Not Found
  });

  // 11. Teste de criação de empresa com nome vazio
  it('POST /company - Error with empty name', async () => {
    await pactum
      .spec()
      .post(baseUrl)
      .withJson({ ...validCompanyData, name: '' })
      .expectStatus(400);
  });

  // 12. Teste de criação de empresa com estado vazio
  it('POST /company - Error with empty state', async () => {
    await pactum
      .spec()
      .post(baseUrl)
      .withJson({ ...validCompanyData, state: '' })
      .expectStatus(400);
  });

  // 13. Teste de criação de empresa com cidade vazia
  it('POST /company - Error with empty city', async () => {
    await pactum
      .spec()
      .post(baseUrl)
      .withJson({ ...validCompanyData, city: '' })
      .expectStatus(400);
  });

  // 14. Teste de criação de empresa com endereço vazio
  it('POST /company - Error with empty address', async () => {
    await pactum
      .spec()
      .post(baseUrl)
      .withJson({ ...validCompanyData, address: '' })
      .expectStatus(400);
  });

  // 15. Teste de atualização de empresa com ID inválido
  it('PUT /company - Error with invalid ID', async () => {
    await pactum
      .spec()
      .put(`${baseUrl}/invalid-id`)
      .withJson(validCompanyData)
      .expectStatus(400);
  });
});
