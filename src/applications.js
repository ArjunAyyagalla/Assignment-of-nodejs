// 1. Make a api for phone number login

const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
app.use(bodyParser.json())

// MySQL connection configuration
const db_config = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
}

// Create a MySQL connection pool
const pool = mysql.createPool(db_config)

// Validate phone number
function validatePhoneNumber(phoneNumber) {
  // Add your phone number validation logic here
  return true
}

// Add a customer
function addCustomer(customerData, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      callback('Failed to establish database connection.', null)
      return
    }

    // Check for duplicate phone number
    connection.query(
      'SELECT COUNT(*) AS count FROM customers WHERE phone_number = ?',
      [customerData.phone_number],
      (err, results) => {
        if (err) {
          connection.release()
          callback('Failed to query the database.', null)
          return
        }

        const count = results[0].count
        if (count > 0) {
          connection.release()
          callback('Phone number already exists.', null)
          return
        }

        // Insert new customer
        connection.query(
          'INSERT INTO customers (name, phone_number) VALUES (?, ?)',
          [customerData.name, customerData.phone_number],
          (err, results) => {
            connection.release()
            if (err) {
              callback('Failed to add customer.', null)
            } else {
              callback(null, 'Customer added successfully.')
            }
          },
        )
      },
    )
  })
}

// API endpoint for adding a customer
app.post('/api/customers', (req, res) => {
  const customerData = req.body

  // Validate input parameters
  if (!customerData.name || !customerData.phone_number) {
    return res.status(400).json({error: 'Missing required parameters.'})
  }

  if (!validatePhoneNumber(customerData.phone_number)) {
    return res.status(400).json({error: 'Invalid phone number.'})
  }

  addCustomer(customerData, (error, message) => {
    if (error) {
      return res.status(500).json({error})
    } else {
      return res.json({message})
    }
  })
})

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
