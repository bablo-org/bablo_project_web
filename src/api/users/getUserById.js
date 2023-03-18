import { Users } from "../../mockeddata/Users";

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const user = Users.find(user => user.id === id)
    if (user) {
      resolve(user);
    } else {
      reject("User not found");
    }
  });
};

export default getUserById;
