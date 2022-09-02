const curd = require("../lib/curdOparations");
const utilites = require("./utilites");


/**
 *
 * @param {string} id
 * @param {Function} callback
 */
function tokenGenaretor(id, callback) {
   let length = 30;
   if (length) {
      const possiblecharacters = "abcdefghijklmnopqrstuvwxyz1234567890";
      let output = "";
      for (let i = 1; i <= length; i += 1) {
         const randomCharacter = possiblecharacters.charAt(
            Math.floor(Math.random() * possiblecharacters.length)
         );
         output += randomCharacter;
      }
      if (output.length >= length) {

         const token = {
            id: id, token: utilites.convartHash(output)
         }

         curd.create("token", token, (err, data) => {
            if (err) {
               callback(true, data.token)
            } else {
               callback(false, null)
            }
         });

      } else {
         callback(false, null)
      }
   } else {

      callback(false, null)
   }
}


/**
 *
 * @param {string} id
 * @param {Function} callback
 */
function tokenFind(reqToken, callback) {
   curd.read("token", (err, data) => {
      if (err) {
         const token = data.find((sToken) => sToken.token === reqToken) ?? false;
         callback(token);
      } else {
         callback(false);
      }
   });
}

/**
 *
 * @param {string} id
 * @param {Function} callback
 */
function tokenVerify(id, callback) {
   curd.read("token", (err, data) => {
      if (err) {
         const token = data.find((sToken) => sToken.id === id);
         const isToken = token ? token : false;
         callback(isToken);
      } else {
         callback(false);
      }
   });
}


/**
 *
 * @param {string} id
 * @param {Function} callback
 */
function tokenDestroy(id, callback) {
   curd.delete("token", id, (err, data) => {
      if (err) {
         callback(data);
      } else {
         callback(false);
      }
   });
}


/**
 * 
 * @param {object} req 
 * @param {Function} callback 
 */
function tokenToGetUser(req, callback) {

   const { headers } = req

   if (headers.authorization && headers.authorization.split(" ")[0] === "Bearer") {
      const token = headers.authorization.split(" ")[1]
      tokenFind(token, (token) => {
         if (token) {
            curd.read("token", (err, data) => {
               if (err) {
                  const findUserId = utilites.find(data, "token", token.token)
                  curd.read("user", (err, data) => {
                     if (err) {
                        const findUser = utilites.find(data, "id", findUserId.id)
                        if (findUser) {
                           callback(true, findUser)
                        } else {
                           callback(false, null)
                        }
                     } else {
                        callback(false, null)
                     }
                  })
               } else {
                  callback(false, null)
               }
            })
         } else {
            callback(false, null)
         }
      })
   } else {
      callback(false, null)
   }


}


module.exports = { tokenGenaretor, tokenFind, tokenVerify, tokenDestroy, tokenToGetUser }
