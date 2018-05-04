import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import _ from 'lodash';

export async function main(event, context, callback) {
  
  const valuesObj = {};
  console.log(`categories: ${event.headers.categories}`);
  const catArray = event.headers.categories.split(',');
  _.forEach(catArray, (cat, i) => {
    valuesObj[`:cat${i}`] = cat;
    console.log(`cat is ${cat}, i is ${i}`);
  });

  const filter = Object.keys(valuesObj)
    .reduce((val, cat, i, arr) => {
      const or = i === arr.length - 1 ? '' : ' OR '
      return val + `contains(categories, ${cat})${or}`;
    }, '');

  const params = {
    TableName: "lines",
    FilterExpression : filter,
    ExpressionAttributeValues : valuesObj
  };

  try {
    const keys = Object.keys(valuesObj);
    const result = await dynamoDbLib.call("scan", params);
    
    if (result.Items) {
      // Return the retrieved item
      callback(null, success(result.Items));
    } else {
      callback(null, failure({ status: false, error: "Item not found." }));
    }
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}