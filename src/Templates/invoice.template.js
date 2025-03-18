import dotenv from "dotenv";
dotenv.config();
import { LOGO_PATH } from "../constants.js";

export const invoiceTemplate = ({
  invoiceNo,
  customerId,
  date,
  agentName,
  customerName,
  customerPhone,
  customerEmail,
  customerCompany,
  customerAddress,
  customerCity,
  customerState,
  customerZipCode,
  customerStr,
  tr,
  subTotal,
  discount,
  discountAmount,
  shippingFee,
  total,
}) => {
  const formattedDate = new Date(date).toISOString().split("T")[0];
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
    }

    .invoice-container {
      max-width: 800px;
      margin: auto;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header img {
      width: 120px;
    }

    .invoice-details {
      border: 1px solid #000;
      border-radius: 10px;
      padding: 15px;
      width: 250px;
      margin: 20px 0px 0px 40px;
    }



    .bold-text {
      font-weight: bold;
    }

    .billing-section {
      margin: 20px 0px 0px 0px;
      display: flex;
    }

    .billing-section div {
      width: 45%;
    }

    .table-container {
      margin-top: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      border: 1px solid #000;
      padding: 10px;
      text-align: left;
    }

    th {
      background-color: black;
      color: white;
    }

    .total-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-top: 20px;
    }

    .total-section p {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      width: 250px;
      margin: 3px 0;
    }

    #top {
      margin: 0px 0px 0px 70px;
    }

    #logo {
      width: 280px;
    }

    #imag {
      width: 350px;

    }

    div p {
      margin: 2px 0;
      padding: 0;
    }

    div h1 {
      margin: 2px 0;
      padding: 0;
    }

     .colo{
      color: blue;
      font-size: 40px;
    }
  </style>
</head>

<body>
  <div class="invoice-container">
    <div class="header">
      <h1 class="colo">7-O-MOONS</h1>
      <div class="invoice-details">
        <p><span>Invoice #:</span> ${invoiceNo}</p>
        <p><span>Customer #:</span> ${customerId}</p>
        <p><span>Date:</span> ${formattedDate}</p>
        <p><span>Agent Name:</span> ${agentName}</p>
      </div>
    </div>


    <div class="billing-section">
      <div>
        <h1>Ship To</h1>
        <p>${customerName}</p>
        <p>${customerPhone}</p>
        <p>${customerEmail}</p>
        <p>${customerCompany}</p>
        <p>${customerAddress}, ${customerStr}</p>
        <p>${customerState}, ${customerCity}, ${customerZipCode}</p>
      </div>
      <div id="top">
        <h1>Bill To</h1>
        <p>${customerName}</p>
        <p>${customerPhone}</p>
        <p>${customerEmail}</p>
        <p>${customerCompany}</p>
        <p>${customerAddress}, ${customerStr}</p>
        <p>${customerState}, ${customerCity}, ${customerZipCode}</p>
      </div>
    </div>

    <div class="table-container">
      <table>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>Total Quantity</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
        ${tr}
      </table>
    </div>

    <div class="total-section">
      <p><span>Sub Total:</span> <span>$${subTotal}</span></p>
      ${
        parseFloat(discount) > 0
          ? `<p><span>Discount ${discount}:</span> <span> </span> $${discountAmount}</p>`
          : ""
      }
      <p><span>Shipping fee:</span> <span>$${shippingFee}</span></p>
      <p class="bold-text"><span>Total:</span> <span>$${total}</span></p>
    </div>


    <div style="text-align: center; margin-top: 100px; text-transform: capitalize;">
      <p> It is customer’s obligation to check local and state regulations of kratom products to ensure compliance
        before placing order. all sales are final. no exchange no returns <br><br>

        <strong>thank you for your business</strong></p>
    </div>
  </div>
</body>
</html>
`;
};
