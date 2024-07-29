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
    return [true, user];
  };
  
  export const findUser = (emailorUserName: string) => {
    const user = users.find(user => (user.email === emailorUserName || user.userName === emailorUserName));
    return user?.isActive ? [true, user] : [false, null];
  };

  export const passwordCorrect = (emailorUserName: string, password: string) => {
    const user = users.find(user => (user.email === emailorUserName || user.userName === emailorUserName));
    return (user?.password === password && user?.isActive) ? [true, user] : [false, null];
  };
  
  export const getUsers = () => {
    if(users.length>0) {
      return [true, users];
    }
    return [false, users];
  };

  export const deleteUser = (userName: string) => {
    const indexOfUser = users.findIndex(user => (user.userName === userName));
    if(indexOfUser !== -1) {
      users.splice(indexOfUser,1);
      return [true, "User Deleted Successfully"];
    }
    return [false, "User not found"];
  };

  export const deactivateUser = (userName: string) => {
    const user = users.find(user => user.userName === userName);
    if (user && user.isActive === true) {
      user.isActive = false;
      return [true, "User Deactivated Successfully"];
    }
    return [false, "User not Found"];
  };
  
  export const activateUser = (userName: string) => {
    const user = users.find(user => user.userName === userName);
    if (user && user.isActive === false) {
      user.isActive = true;
      return [true, "User Activated Successfully"];
    }
    return [false, "User not Found"];
  };
  
  export const updateUser = (userName: string, action : string) => {
    switch(action){
      case 'activateUser':
        var [isActionPerformed, message] = activateUser(userName);
        return [isActionPerformed, message];
      
      case 'deactivateUser':
        var [isActionPerformed, message] = deactivateUser(userName);
        return [isActionPerformed, message];
      
      case 'deleteUser':
        var [isActionPerformed, message] = deleteUser(userName);
        return [isActionPerformed, message];

      default:
        return [false, "Invalid Action"];
    }

  }