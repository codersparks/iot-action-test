import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';``
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iot from '@aws-cdk/aws-iot-alpha';
import * as actions from '@aws-cdk/aws-iot-actions';

export class IotActionTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'IotActionTestQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const func = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
    exports.handler = (event) => {
      console.log("It is test for lambda action of AWS IoT Rule.", event);
    };`
      ),
    });

    new iot.TopicRule(this, 'TopicRule', {
      sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id, timestamp() as timestamp, temperature FROM 'device/+/data'"),
      actions: [new actions.LambdaFunctionAction(func)],
    });
  }
}
