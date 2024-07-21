const { Given, When, Then } = require('@cucumber/cucumber');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/app');

chai.use(chaiHttp);
const { expect } = chai;

let response;
let product;

Given('I have the following product', function (dataTable) {
    product = dataTable.rowsHash();
});

When('I send a POST request to /products', async function () {
    response = await chai.request(app).post('/products').send(product);
});

Then('the response status should be {int}', function (statusCode) {
    expect(response).to.have.status(statusCode);
});

Then('the response body should contain the product', function () {
    expect(response.body).to.deep.equal(product);
});

When('I send a GET request to /products', async function () {
    response = await chai.request(app).get('/products');
});

Then('the response status should be {int}', function (statusCode) {
    expect(response).to.have.status(statusCode);
});

Then('the response body should contain the following products', function (dataTable) {
    const expectedProducts = dataTable.hashes().map(product => {
        product.price = parseFloat(product.price); // Convert price to number
        product.quantity = parseInt(product.quantity); // Convert quantity to number
        return product;
    });
    expect(response.body).to.deep.equal(expectedProducts);
});
