import CryptoJS from 'crypto-js'

// AWS Signature Version 4 implementation
export const signRequest = (method, url, headers, body, credentials) => {
  const { accessKeyId, secretAccessKey, sessionToken, region } = credentials

  const urlObj = new URL(url)
  const host = urlObj.hostname
  const pathname = urlObj.pathname
  const search = urlObj.search

  const service = 'bedrock-agentcore'
  const algorithm = 'AWS4-HMAC-SHA256'
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, '')
  const dateStamp = amzDate.substring(0, 8)

  // Create payload hash
  const payloadHash = CryptoJS.SHA256(body || '').toString()

  // Prepare headers (must be lowercase for canonical headers)
  const requestHeaders = {
    'host': host,
    'x-amz-date': amzDate,
    'x-amz-content-sha256': payloadHash,
    'content-type': 'application/json'
  }

  if (sessionToken) {
    requestHeaders['x-amz-security-token'] = sessionToken
  }

  // Add any additional headers
  Object.keys(headers || {}).forEach(key => {
    requestHeaders[key.toLowerCase()] = headers[key]
  })

  // Create canonical URI (encode path)
  const canonicalUri = encodeURI(pathname).replace(/\+/g, '%20')

  // Create canonical query string
  const canonicalQuerystring = search.slice(1) || ''

  // Sort headers and create canonical headers string
  const sortedHeaderNames = Object.keys(requestHeaders).sort()
  const canonicalHeaders = sortedHeaderNames
    .map(name => `${name}:${requestHeaders[name].toString().trim()}\n`)
    .join('')

  const signedHeadersString = sortedHeaderNames.join(';')

  // Create canonical request
  const canonicalRequest = [
    method.toUpperCase(),
    canonicalUri,
    canonicalQuerystring,
    canonicalHeaders,
    signedHeadersString,
    payloadHash
  ].join('\n')

  // Create string to sign
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    CryptoJS.SHA256(canonicalRequest).toString()
  ].join('\n')

  // Calculate signature
  const kDate = CryptoJS.HmacSHA256(dateStamp, `AWS4${secretAccessKey}`)
  const kRegion = CryptoJS.HmacSHA256(region, kDate)
  const kService = CryptoJS.HmacSHA256(service, kRegion)
  const kSigning = CryptoJS.HmacSHA256('aws4_request', kService)
  const signature = CryptoJS.HmacSHA256(stringToSign, kSigning).toString()

  // Create authorization header
  const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeadersString}, Signature=${signature}`

  // Return signed headers (convert back to original case for actual request)
  const finalHeaders = {}
  Object.keys(requestHeaders).forEach(key => {
    // Convert back to proper case for HTTP headers
    if (key === 'host') finalHeaders['Host'] = requestHeaders[key]
    else if (key === 'content-type') finalHeaders['Content-Type'] = requestHeaders[key]
    else if (key.startsWith('x-amz-')) finalHeaders[key] = requestHeaders[key]
    else finalHeaders[key] = requestHeaders[key]
  })

  finalHeaders['Authorization'] = authorizationHeader

  return finalHeaders
}
