import React from 'react';
import {
  BrowserRouter as Router,
  Route, Switch, Redirect
} from 'react-router-dom';

import Nav from './Nav'; // navigation bar
import Home from './Home'; // login page
import Conversations from './Conversations'; // list of convos
import Chat from './ChatWindow'; // list of messages in a convo
import Callback from './Callback'; // callback url for Auth0
import NewChat from './NewChat'; // create chat with a user
import ChatInput from './ChatInput'; // input bar for chat window

function App(props) {
  const { auth } = props;
  const loggedIn = auth.isAuthenticated()
  
  return (
    <Router>
      {/* Wrapper for header, content, footer */}
      <div className='wrapper'>
        
        <Nav className='header' auth={props.auth} />
        
        <div className='content'>
          <Switch>
            {/* Redirect to list of conversations if logged in, otherwise show login button */}
            <Route exact path="/" render={() => (
                loggedIn ? <Redirect to="/conversations" /> : <Home auth={props.auth} />
            )}
            />
            {/* Callback: to handle authentication flow with Auth0 */}
            <Route path="/callback" render={() => (<Callback auth={props.auth} />)} />
            {/* Redirect from all routes to homepage if not logged in */}
            {!loggedIn && <Redirect from="*" to="/" />}
            
            {/* Chat functions, only accessible if logged in */}
            <Route path="/new" component={NewChat} />
            <Route path="/conversations" component={Conversations} />
            <Route path="/chat" component={Chat} />

            <Route render={() => <p>Not found!</p>} />
          </Switch>
        </div>
        {/* Footer: renders only if viewing a chat */}
        <div className='footer'>
          <Switch>
            <Route path='/chat' component={ChatInput} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;