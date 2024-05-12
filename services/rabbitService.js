const amqp = require('amqplib');
const crypto = require('crypto');

async function produceMessageOfRequestRegistration(email, confirmationCode) {
  const queueName = process.env.REQUEST_REGISTRATION_QUEUE_NAME || 'REGISTRATION_REQUEST';
  try {
    const connectToQueue = await amqp.connect(process.env.RABBITMQ_ADDRESS);
    const channel = await connectToQueue.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify({
      message: 'New user register request',
      email: `${email}`,
      confirmationCode: `${confirmationCode}`
    })));
  } catch (err) {
    console.log('Error in produce message of REGISTRATION_REQUEST to queue', err);
    throw new Error(err);
  }
}

module.exports = {
  produceMessageOfRequestRegistration
};
