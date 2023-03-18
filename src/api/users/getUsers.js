import { Users } from "../../mockeddata/Users";

const getUsers = () => {
  return new Promise((resolve, reject) => {
    resolve(Users);
  });
};

export default getUsers;
