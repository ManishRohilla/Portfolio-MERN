const nodemailer = require('nodemailer');
const ElasticEmail = require('@elasticemail/elasticemail-client');

// Set your Elastic Email API key
let defaultClient = ElasticEmail.ApiClient.instance;
let apikey = defaultClient.authentications['apikey'];
apikey.apiKey = process.env.API_SENDGRID; // Assuming API_SENDGRID is your Elastic Email API key

// Create Elastic Email client
let api = new ElasticEmail.EmailsApi();

const sendEmailController = async (req, res) => {
    try {
        const { name, email, msg } = req.body;

        // Validation
        if (!name || !email || !msg) {
            return res.status(500).send({
                success: false,
                message: 'Please provide all the fields',
            });
        } else {
            let emailMessage = ElasticEmail.EmailMessageData.constructFromObject({
                Recipients: [
                    new ElasticEmail.EmailRecipient("manish.rohilla14@yahoo.com")
                ],
                Content: {
                    Body: [
                        ElasticEmail.BodyPart.constructFromObject({
                            ContentType: "HTML",
                            Content: `
                            <h5 style="color: #4d4d4d; border-bottom: 2px solid #ff6f61; padding-bottom: 5px;">Detail Information</h5>
                            <ul style="list-style-type: none; padding: 0;">
                              <li style="margin-bottom: 15px;">
                                <p style="color: #3b5998; margin: 0;">Name: ${name}</p>
                              </li>
                              <li style="margin-bottom: 15px;">
                                <p style="color: #dd4b39; margin: 0;">Email: ${email}</p>
                              </li>
                              <li style="margin-bottom: 15px;">
                                <p style="color: #00aced; margin: 0;">Message: ${msg}</p>
                              </li>
                            </ul>
                            `
                        })
                    ],
                    Subject: "Regarding opportunity callout from Portfolio",
                    From: "kotamanishrohilla@gmail.com"
                }
            });

            // Wrap API call in a promise for better error handling
            const sendEmail = () => {
                return new Promise((resolve, reject) => {
                    var callback = function (error, data, response) {
                        if (error) {
                            console.error(error);
                            reject(error);
                        } else {
                            console.log('API called successfully.');
                            resolve(data);
                        }
                    };
                    api.emailsPost(emailMessage, callback);
                });
            };

            await sendEmail();

            return res.status(200).send({
                success: true,
                message: 'Your message sent successfully',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: 'Send Email API Error',
            error,
        });
    }
};

module.exports = { sendEmailController };
