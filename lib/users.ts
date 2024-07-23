interface User {
    email: string;
    userName: string;
    password: string;
    dob: Date;
    firstName: string;
    lastName: string;
    isActive: boolean;
  }
  
  let users: User[] = [];
  
  export const addUser = (user: User) => {
    users.push(user);
  };
  
  export const findUser = (emailorUserName: string) => {
    return users.find(user => (user.email === emailorUserName || user.userName === emailorUserName));
  };
  
  export const getUsers = () => {
    return users;
  };

  export const deleteUser = (userName: string) => {
    const indexOfUser = users.findIndex(user => (user.userName === userName));
    if(indexOfUser !== -1) {
      users.splice(indexOfUser,1);
    }
  };

  export const deactivateUser = (userName: string) => {
    const user = users.find(user => user.userName === userName);
    if (user) {
      user.isActive = false;
    }
  };
  
  export const activateUser = (userName: string) => {
    const user = users.find(user => user.userName === userName);
    if (user) {
      user.isActive = true;
    }
  };
  