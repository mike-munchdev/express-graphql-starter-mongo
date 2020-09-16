const asyncForEach = require('./asyncForEach');
const connectDatabase = require('../models/connectDatabase');
const { default: Bugsnag } = require('@bugsnag/js');
const Products = require('../models/Product');
const ProductType = require('../models/ProductType');
const Product = require('../models/Product');
const Company = require('../models/Company');
const Tag = require('../models/Tag');
const { getDomainNameBrandUrl } = require('./url');

const base = require('airtable').base('appzld4Ygp54RGwoG');

const bases = [
  'Personal Care & Beauty',
  // 'Health & Nutrition',
  // 'Pet Care',
  // 'Household Goods',
  // 'Baby & Kids',
  // 'Outdoors & Backyard',
  // 'Furniture, Home Appliances, Bed, & Bath',
  // 'Electronics',
  // 'Grocery',
];

// #4
module.exports.importProducts = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await connectDatabase();
      // Product Types
      await asyncForEach(bases, async (b, index, array) => {
        try {
          console.log('Getting products from base:', b);
          const records = await base(b).select({ view: 'Grid view' }).all();
          await asyncForEach(records, async (record, index, array) => {
            if (record.fields['Product Name']) {
              // create product
              const product = new Product({
                name: record.fields['Product Name'],
              });

              // get tags if any
              if (
                record.fields['Product Tags'] &&
                record.fields['Product Tags'].length > 0
              ) {
                const tags = await Tag.find({
                  name: { $in: record.fields['Product Tags'] },
                });
                product.tags = tags;
              }

              // get brand
              if (record.fields['Search by name (primary query)']) {
                const brand = await Company.findOne({
                  name: record.fields['Search by name (primary query)'],
                });
                product.brand = brand;
              }

              // get product type
              if (record.fields['Product Type']) {
                const productType = await ProductType.findOne({
                  name: record.fields['Product Type'],
                });

                product.productType = productType;
              }

              await product.save();
            }
          });
        } catch (error) {
          console.error(error);
        }
      });
      console.log('Done.');

      resolve();
    } catch (error) {
      Bugsnag.notify(error);
      reject(error);
    }
  });
};

// #1
module.exports.importParentCompanies = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await connectDatabase();
      // Parent Company(ies)
      let companies = [];
      await asyncForEach(bases, async (b, index, array) => {
        try {
          console.log('Getting brands from base:', b);
          const records = await base(b).select({ view: 'Grid view' }).all();
          records.forEach(async (record) => {
            // create company
            if (record.fields['Parent Company(ies)']) {
              const companiesFiltered = record.fields['Parent Company(ies)']
                .map((p) => {
                  return companies.findIndex((company) => company.name === p) <
                    0
                    ? {
                        name: p,
                      }
                    : null;
                })
                .filter((p) => p !== null);

              companies = [...companies, ...companiesFiltered];
            }
          });
        } catch (error) {
          console.error(error);
        }
      });
      const uniqueCompanies = companies.map((c) => ({
        name: c.name,
        brandUrl: c.brandUrl,
      }));
      await Company.insertMany(uniqueCompanies);
      console.log('Done.');

      resolve();
    } catch (error) {
      Bugsnag.notify(error);
      reject(error);
    }
  });
};
// #1
module.exports.importBrands = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await connectDatabase();
      // Search by name (primary query)
      let brands = [];
      await asyncForEach(bases, async (b, index, array) => {
        try {
          console.log('Getting companies from base:', b);
          const records = await base(b).select({ view: 'Grid view' }).all();
          await asyncForEach(records, async (record, index, array) => {
            // create brand
            if (record.fields['Search by name (primary query)']) {
              const existingCompany = await Company.findOne({
                name: record.fields['Search by name (primary query)'],
              });
              if (!existingCompany) {
                console.log(
                  `adding new company ${record.fields['Search by name (primary query)']}`
                );
                const company = new Company({
                  name: record.fields['Search by name (primary query)'],
                });

                // add brand url
                if (record.fields['Brand URL']) {
                  company.brandUrl = record.fields['Brand URL'];
                }

                // add parent companies
                if (
                  record.fields['Parent Company(ies)'] &&
                  record.fields['Parent Company(ies)'].length > 0
                ) {
                  const parentCompanies = await Company.find({
                    name: { $in: record.fields['Parent Company(ies)'] },
                  });
                  company.parentCompanies = parentCompanies;
                }
                await company.save();
              }
            }
          });
        } catch (error) {
          console.log('error adding company', error);
          // console.error(error);
        }
      });

      console.log('Done.');

      resolve();
    } catch (error) {
      console.log('importBrands: error', error);
      Bugsnag.notify(error);
      reject(error);
    }
  });
};
// #3
module.exports.importTags = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await connectDatabase();
      // Product Types
      let tags = [];
      await asyncForEach(bases, async (b, index, array) => {
        try {
          console.log('Getting tags from base:', b);
          const records = await base(b).select({ view: 'Grid view' }).all();
          records.forEach(async (record) => {
            // create company
            if (record.fields['Product Tags']) {
              tags = [...tags, ...record.fields['Product Tags']];
            }
          });
        } catch (error) {
          console.error(error);
        }
      });
      const uniqueTags = [...new Set(tags)].map((t) => ({ name: t }));
      await Tag.insertMany(uniqueTags);
      console.log('Done.');

      resolve();
    } catch (error) {
      Bugsnag.notify(error);
      reject(error);
    }
  });
};
// #2
module.exports.importProductTypes = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await connectDatabase();
      // Product Types
      let productTypes = [];
      await asyncForEach(bases, async (b, index, array) => {
        try {
          console.log('Getting product types from base:', b);
          const records = await base(b).select({ view: 'Grid view' }).all();
          records.forEach(async (record) => {
            // create company
            if (record.fields['Product Type']) {
              productTypes.push(record.fields['Product Type']);
            }
          });
        } catch (error) {
          console.error(error);
        }
      });
      const uniqueProductTypes = [...new Set(productTypes)].map((u) => ({
        name: u,
      }));
      await ProductType.insertMany(uniqueProductTypes);
      console.log('Done.');

      resolve();
    } catch (error) {
      Bugsnag.notify(error);
      reject(error);
    }
  });
};
