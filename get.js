import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";
import _ from 'lodash';

export async function main(event, context, callback) {
  const valuesObj = {};
  console.log(event.categories);
  
  const values = event.categories
    .forEach((cat, i) => {
      valuesObj[`:cat${i}`] = cat;
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
    console.log(params.ExpressionAttributeValues);
    
    const result = await dynamoDbLib.call("scan", params);
    console.log(Object.keys(result));
    
    if (result.Items) {
      // Return the retrieved item
      callback(null, success(result.Items));
    } else {
      callback(null, failure({ status: false, error: "Item not found." }));
    }
  } catch (e) {
    console.log(e);
    
    callback(null, failure({ status: false }));
  }
}