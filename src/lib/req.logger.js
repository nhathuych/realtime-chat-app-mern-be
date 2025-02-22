const reqLogger = (req, res, next) => {
  console.log('\n')
  console.log(`[${req.method}] ${req.url}`)
  console.log(`Body params: ${JSON.stringify(req.body) || '{}'}`)
  next() // Move to the next middleware
}

export default reqLogger
