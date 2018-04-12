import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  console.log('************************************');
  
  const params = {
    TableName: "lines",
    // 'Item' contains the attributes of the item to be created
    // - 'lineId': a unique uuid
    // - 'messages': parsed from request body
    // - 'categories': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      lineId: uuid.v1(),
      messages: data.messages,
      categories: data.categories,
      createdAt: new Date().getTime()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    callback(null, success(params.Item));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}