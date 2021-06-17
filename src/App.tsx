import React, { useEffect, useContext, useState } from 'react';
import { Context } from './index';
import './App.css';
import LoginForm from './components/LoginForm';
import { observer } from 'mobx-react-lite';
import { IUser } from './models/IUser';
import UserService from './services/UserService';

function App() {
  const { store } = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, [store]);

  async function getUsers() {
    try {
      const res = await UserService.fetchUsers();
      setUsers(res.data);
    } catch (err) {
      console.log(err);
      
    }
  }

  if (store.isLoading) {
    return (<div>Loading in progress...</div>)
  }

  if (!store.isAuth) {    
    return (
      <div>
        <LoginForm />
        <button onClick={getUsers}>Users List</button>
      </div>
    )
  }

  return (
    <div className="App">
      <h1>{store.isAuth ? store.user.email : 'Login'}</h1>
      <h2>{store.user.isActivated ? 'Activted' : 'Need email activation'}</h2>
      <button onClick={() => store.logout()}>Logout</button>
      <div>
        <button onClick={getUsers}>Users List</button>
      </div>
      <div>User <span>isActivated</span></div>
      {
        users.map((user, i) => 
          <div key={i}>{user.email} <span>{user.isActivated ? 'Active' : 'Not Active'}</span></div>
        )
      }
    </div>
  );
}

export default observer(App);
