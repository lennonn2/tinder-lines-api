import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  
  const params = {
    TableName: "lines",
    Key: {
      'lineId': data.id
    },
    ExpressionAttributeValues:{
      ":val":1
    },
    UpdateExpression: 'SET numViews = numViews + :val',
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    await dynamoDbLib.call("update", params);
    callback(null, success(params.Item));
  } catch (e) {
    console.log(`error: ${e}`);
    
    callback(null, failure({ status: false }));
  }
}