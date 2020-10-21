// const ah = require('albert-heijn')
import fetch from "node-fetch";

class Product {
  constructor(product_id) {
    this.product_id = product_id;

    this.get_product_info = async () => {
      const response = await fetch(
        `https://www.ah.nl/service/rest/delegate?url=producten/product/${this.product_id}`
      );
      const data = await response.json();
      this.structure_data(data);
    };
    this.structure_data = (raw_data) => {
      const data = raw_data._embedded.lanes.filter((data) => {
        if (data.type == "ProductDetailLane") {
          return data;
        }
      })[0]._embedded.items[0];
      this.discount = data._embedded.product.discount;
      this.id = data._embedded.product.id;
      this.price = data._embedded.product.priceLabel;
      this.description = data._embedded.product.description;
      this.image = data._embedded.product.images[0].link.href;
    };
  }
}
const all_products = [
  "wi210145/heineken-premium-pilsener",
  "wi479884/sun-vaatwaspoeder-normaal",
  "wi58053/ah-olijfolie-mild",
  "wi65764/drogheria-4-seizoenen-peper",
  "wi65765/drogheria-middellandse-zeezout",
  "wi33693/ah-halfvolle-melk",
  "wi2770/karvan-cevitam-aardbei-siroop",
  "wi125035/ah-les-pains-boulogne-meergranen-heel",
];

const func = async (event, context) => {
  const response = await Promise.all(
    all_products.map(async (item) => {
      const new_product = new Product(item);
      await new_product.get_product_info();
      return {
        id: new_product.id,
        price: new_product.price,
        discount: new_product.discount,
        description: new_product.description,
        image: new_product.image,
      };
    })
  );

  return {
    body: JSON.stringify(response),
    statusCode: 200,
  };
};

exports.handler = func;
