const reqLogger = (req, res, next) => {
  console.log(`\n${new Date().toLocaleString('en-CA', { hour12: false }).replace(',', '')} [${req.method}] ${req.originalUrl}`)
  console.log(`Body params: ${JSON.stringify(req.body) || '{}'}`)
  next() // Move to the next middleware
}

export default reqLogger
