/* eslint-disable no-underscore-dangle */
/* eslint-disable no-bitwise */
/* eslint-disable func-names */
const fm = {
  nameIdentifier: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  upn: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn',
  groups: 'http://schemas.xmlsoap.org/claims/Group',
}

/**
 *
 * Passport User Profile Mapper
 *
 * A class to map passport.js user profile to a wsfed claims based identity.
 *
 * Passport Profile:
 * http://passportjs.org/guide/profile/
 *
 * Claim Types:
 * http://msdn.microsoft.com/en-us/library/microsoft.identitymodel.claims.claimtypes_members.aspx
 *
 * @param  {Object} pu Passport.js user profile
 */
function PassportProfileMapper(pu) {
  if (!(this instanceof PassportProfileMapper)) {
    return new PassportProfileMapper(pu)
  }
  this._pu = pu
}

/**
 * map passport.js user profile to a wsfed claims based identity.
 *
 * @return {Object}    WsFederation claim identity
 */
PassportProfileMapper.prototype.getClaims = function () {
  const claims = {}
  claims[fm.nameIdentifier] = this._pu.id
  claims[fm.name] = this._pu.loginName

  // var dontRemapAttributes = ['emails', 'displayName', 'name', 'id', '_json'];
  const dontRemapAttributes = ['loginName', 'id', '_json']

  Object.keys(this._pu)
    .filter((k) => !~dontRemapAttributes.indexOf(k))
    .forEach(
      function (k) {
        claims[`http://schemas.passportjs.com/${k}`] = this._pu[k]
      }.bind(this),
    )

  return claims
}

/**
 * returns the nameidentifier for the saml token.
 *
 * @return {Object} object containing a nameIdentifier property and optional nameIdentifierFormat.
 */
PassportProfileMapper.prototype.getNameIdentifier = function () {
  const claims = this.getClaims()

  return {
    nameIdentifier: claims[fm.nameIdentifier] || claims[fm.name],
  }
}

/**
 * claims metadata used in the metadata endpoint.
 *
 * @param  {Object} pu Passport.js profile
 * @return {[type]}    WsFederation claim identity
 */
PassportProfileMapper.prototype.metadata = [
  {
    id: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
    optional: true,
    displayName: 'Name',
    description: 'The unique name of the user',
  },
  {
    id: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
    optional: true,
    displayName: 'Name ID',
    description: 'The SAML name identifier of the user',
  },
]

module.exports = PassportProfileMapper
