module.exports = ({ emailFrom, downloadLink, size, expires, filename }) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>File Sharing Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
    }

    .header {
      background-color: #007BFF;
      color: #fff;
      padding: 20px;
      text-align: center;
    }

    .content {
      padding: 20px;
    }

    .footer {
      background-color: #f5f5f5;
      padding: 10px;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>File Sharing Notification</h1>
    </div>

    <div class="content">
      <p>Hello,</p>

      <p>We wanted to let you know that a file has been shared with you. Below are the details:</p>

      <ul>
        <li><strong>File Name:</strong> ${filename}</li>
        <li><strong>File Size:</strong> ${size}</li>
      </ul>

      <p>You can download the file using the link below:</p>
      <p><a href="${downloadLink}" target="_blank">Download File</a></p>

      <p>Please note that the link expires in 24 hours.</p>

      <p>Sender's Email: ${emailFrom}</p>

      <p>Thank you!</p>
    </div>

    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>

</html>
`;
};
