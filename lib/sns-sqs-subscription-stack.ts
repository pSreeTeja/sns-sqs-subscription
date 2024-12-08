import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class SnsSqsSubscriptionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    const queue = new sqs.Queue(this, 'SnsSqsSubscriptionQueue', {
      queueName:"events-subscription-sqs",
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    const queuePolicy = new sqs.QueuePolicy(this, 'queuePolicy',{
      queues:[queue]
    })
    queuePolicy.document.addStatements(
      new iam.PolicyStatement({
        sid:"Access Policy for SNS",
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('sns.amazonaws.com')],
        actions: ['sqs:SendMessage'],
        resources: ['*'],
        conditions: {
          ArnEquals: {
            'aws:SourceArn': 'arn:aws:sns:ap-south-1:471112655072:MyFirstTopic',
          }
        }
      })
    )
    new cdk.CfnOutput(this, 'SQSQueueArn', {
      value: queue.queueArn,
      exportName: 'SQSQueueArn',
    });
  }
}
