require('dotenv').config();
const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport'); 
const emailFrom = process.env.EMAIL_FROM;


const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.API_KEY
    }
}));

const File = require('../models/file')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const originalname= file.originalname;
      const extension = originalname.split('.').pop();
      const filename = `${uniqueSuffix}.${extension}`;
      cb(null, filename);
    }
  })

  const upload = multer({ 
    storage: storage ,
    limits: { fileSize: 100 * 1024 * 1024}
}).single('myfile');


router.get('/',(req,res) => {
  res.render('index');
})


router.post('/',(req,res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
            return res.status(500).send({error: err});
        } else if (!req.file){
            return res.status(500).send({error: 'File upload failed. No file provided.'}); 
        }
            // Store the file
           const file = new File({
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                uuid: uuidv4()
           }) 

           const response = await file.save();
           const fileLink = `${process.env.APP_BASE_URL}/files/${response.uuid}`; 
           return res.json({file: fileLink});
      })
})
router.get('/:uuid', async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });

    if (!file) {
      return res.render('show', { error: 'Link has been expired.' });
    }

    return res.render('show', {
      filename: file.filename,
      size: file.size / 1000,
      download: `/files/download/${file.uuid}`
    });
  } catch (err) {
    console.error(err);
    res.render('show', { error: 'Something went wrong' });
  }
});


router.get('/download/:uuid',async (req,res) => {
 await File.findOne({ uuid : req.params.uuid}).then((file) => {
    if(!file){
      return res.render('show', {error : 'Link has been expired.'});
    }

    res.download(`${__dirname}/../${file.path}`);
 })
})

router.post('/send', async (req, res) => {
  const { uuid, emailTo } = req.body;
  console.log(req.body);

  // validate request
  if (!uuid || !emailTo) {
    return res.status(422).send({ error: "All fields are required!" });
  }

  try {
    const file = await File.findOne({ uuid: uuid });

    if (!file) {
      return res.status(404).send({ error: "File not found!" });
    }

    file.receiver = emailTo;
    const response = await file.save();

    // Logging
    console.log('Sending email...');
    
    // Send mail
    await transporter.sendMail({
      to: emailTo,
      from: emailFrom,
      subject: "shareFile, easy sharing",
      html: require('../emailTemplate')({
        emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
        size: parseInt(file.size / 1000) + ' KB',
        expires: '24 hours',
        filename: file.filename
      })
    });

    // Logging
    console.log('Email sent successfully!');
    
    // Respond with success
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

