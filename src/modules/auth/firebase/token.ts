const claimKeyUserId = "custom_user_id"

type CustomClaims = {
    userId?: string
}

type Claims = {
    displayName?: string
    email?: string
    phone?: string
    avatarUrl?: string
    custom: CustomClaims
}

class VerifiedToken {
    claims: Claims
    subjectId: string

    constructor(claims: Claims, subjectId: string) {
        this.claims = claims
        this.subjectId = subjectId
    }

    hasUserId(): boolean {
        return this.claims.custom.userId !== undefined
    }
}

export {
    claimKeyUserId,
    Claims,
    CustomClaims,
    VerifiedToken
}
