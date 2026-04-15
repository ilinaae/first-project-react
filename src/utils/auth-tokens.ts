const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

type TokenPayload = {
  expiresAt: number
  issuedAt: number
  nonce: string
  type: 'access' | 'refresh'
  userId: number
}

function encodeToken(payload: TokenPayload) {
  return `fb.${window.btoa(JSON.stringify(payload))}`
}

export function decodeToken(token: string) {
  const [, encodedPayload] = token.split('.')

  if (!encodedPayload) {
    throw new Error('Invalid token format')
  }

  return JSON.parse(window.atob(encodedPayload)) as TokenPayload
}

export function isTokenExpired(token: string) {
  return Date.now() > decodeToken(token).expiresAt
}

export function issueAccessToken(userId: number) {
  const issuedAt = Date.now()

  return encodeToken({
    expiresAt: issuedAt + ACCESS_TOKEN_TTL_MS,
    issuedAt,
    nonce: globalThis.crypto.randomUUID(),
    type: 'access',
    userId,
  })
}

export function issueRefreshToken(userId: number) {
  const issuedAt = Date.now()

  return encodeToken({
    expiresAt: issuedAt + REFRESH_TOKEN_TTL_MS,
    issuedAt,
    nonce: globalThis.crypto.randomUUID(),
    type: 'refresh',
    userId,
  })
}

export function getUserIdFromToken(token: string, expectedType: 'access' | 'refresh') {
  const payload = decodeToken(token)

  if (payload.type !== expectedType) {
    throw new Error('Token type is invalid')
  }

  if (isTokenExpired(token)) {
    throw new Error('Token expired')
  }

  return payload.userId
}

export function refreshAccessTokenByRefreshToken(refreshToken: string) {
  const userId = getUserIdFromToken(refreshToken, 'refresh')
  return issueAccessToken(userId)
}
