const mysql = require('mysql')

const customers = [
  {
    email: 'anurag11@yopmail.com',
    name: 'anurag',
  },
  {
    email: 'sameer11@yopmail.com',
    name: 'sameer',
  },
  {
    email: 'ravi11@yopmail.com',
    name: 'ravi',
  },
  {
    email: 'akash11@yopmail.com',
    name: 'akash',
  },
  {
    email: 'anjali11@yopmail.com',
    name: 'anjali',
  },
  {
    email: 'santosh11@yopmail.com',
    name: 'santosh',
  },
]

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
})

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err)
    return
  }
  console.log('Connected to MySQL successfully.')

  // Insert customers into the database
  insertCustomers(customers)
})

// Function to insert customers into the database
function insertCustomers(customers) {
  customers.forEach(customer => {
    const {email, name} = customer

    // Check if the email already exists in the database
    const selectQuery = 'SELECT * FROM customers WHERE email = ?'
    connection.query(selectQuery, [email], (err, results) => {
      if (err) {
        console.error('Error querying database:', err)
        return
      }

      if (results.length > 0) {
        // Update the customer's name if the email already exists
        const updateQuery = 'UPDATE customers SET name = ? WHERE email = ?'
        connection.query(updateQuery, [name, email], err => {
          if (err) {
            console.error('Error updating customer:', err)
          } else {
            console.log(`Updated customer name for email ${email}`)
          }
        })
      } else {
        // Insert a new customer if the email doesn't exist
        const insertQuery = 'INSERT INTO customers (name, email) VALUES (?, ?)'
        connection.query(insertQuery, [name, email], err => {
          if (err) {
            console.error('Error inserting customer:', err)
          } else {
            console.log(`Inserted new customer with email ${email}`)
          }
        })
      }
    })
  })
}
