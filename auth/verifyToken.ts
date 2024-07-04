// import jwt, { JwtHeader, SigningKeyCallback } from 'jsonwebtoken';
// import jwksClient, { JwksClient } from 'jwks-rsa';
// // get the config details from the environment variables
// interface Config {
//     region: string | undefined;
//     userPoolId: string | undefined;
//     };

// const config : Config = {
//   region: process.env.REGION || "us-east-2",
//   userPoolId: process.env.USER_POOL_ID || "uh-oh-env-var-not-set"
// };

// const client: JwksClient = jwksClient({
//   jwksUri: `https://cognito-idp.${config.region}.amazonaws.com/${config.userPoolId}/.well-known/jwks.json`
// });

// function getKey(header: JwtHeader, callback: SigningKeyCallback): void {
//   client.getSigningKey(header.kid, (err, key) => {
//     if (err) {
//       callback(err, undefined);
//     } else {
//       const signingKey = key?.getPublicKey();
//       callback(null, signingKey);
//     }
//   });
// }

// export const verifyToken = (token: string): Promise<object> => {
//   return new Promise((resolve, reject) => {
//     jwt.verify(
//       token,
//       getKey,
//       {
//         algorithms: ['RS256'],
//         issuer: `https://cognito-idp.${config.region}.amazonaws.com/${config.userPoolId}`
//       },
//       (err, decoded) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(decoded as object);
//         }
//       }
//     );
//   });
// };