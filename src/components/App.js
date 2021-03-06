import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Nav from './main/Nav'; // navigation bar
import Home from './main/Home'; // login page
import ConversationList from './conversations/Conversations'; // list of convos
import { MessageList } from './chat/MessageList'; // list of messages in a convo
import Callback from './auth/Callback'; // callback url for Auth0
import { MessageInput } from './chat/MessageInput'; // input bar for messages in chat window
import { RecipientInput } from './chat/RecipientInput'; // input bar for recipient in new message
import { ReactComponent as Logo } from "./assets/bison.svg";
import { useWindowSize } from './hooks/useWindowSize';

function App(props) {
  const { auth } = props;
  const loggedIn = auth.isAuthenticated();

  const [recipient, setRecipient] = useState(null);
  const windowSize = useWindowSize();

  return (
    <>
      <div className="flex flex-col justify-start sm:h-screen">
        <header className="block sticky top-0 w-full bg-white mb-0 z-50 border-b-2 border-gray-100">
          <Nav auth={auth} />
          <Switch>
            <Route path='/new'>
              <RecipientInput setRecipient={setRecipient} />
            </Route>
          </Switch>
        </header>
        <main className="sm:overflow-hidden flex flex-col h-full">
          <Switch>
            <Route exact path="/">
              { loggedIn
              ? <Redirect to="/conversations" />
              : <Home auth={auth} /> }
            </Route>

            <Route path="/callback">
              <Callback auth={auth} />
            </Route>
            
            { !loggedIn && <Redirect from="*" to="/" /> }
            
            <Route path="/new">
              <Logo className="mx-auto sm:m-auto mt-20 h-48 w-48 fill-current text-gray-200" />
            </Route>

            <Route path="/conversations/:username">
                {/* wide screens get conversations and detailview */}
                { windowSize.width >= 640 &&
                  <div className="flex w-full sm:h-full justify-between">
                    <ConversationList />
                    <section className="flex flex-col flex-grow">
                      <MessageList />
                      <div className="p-4 bg-gray-100">
                        <MessageInput recipient={recipient} />
                      </div>
                    </section>
                  </div>
                }
                {/* small screen only gets specific conversation */}
                { windowSize.width < 640 &&
                  <div className="flex-grow flex flex-col h-full">
                    <MessageList />
                    <div className="w-full p-4 bg-gray-100 bg-opacity-75 rounded-lg fixed bottom-0">
                      <MessageInput recipient={recipient} />
                    </div>
                  </div>
                }
            </Route>

            <Route exact path="/conversations">
                { windowSize.width >= 640 &&
                  <div className="flex w-full h-full justify-between space-x-2">
                    <ConversationList />
                    <section className="flex-grow flex flex-col justify-around self-center">
                      <Logo className="self-center my-auto text-gray-200 fill-current h-48 w-48" />
                    </section>
                  </div>
                }
                { windowSize.width < 640 &&
                  <ConversationList />
                }
            </Route>

            <Route render={() => <p>Not found!</p>} />
          </Switch>
        </main>
      </div>
      <Switch>
        <Route path='/new'>
          <div className="w-full p-4 fixed bottom-0">
            <MessageInput recipient={recipient} />
          </div>
        </Route>
      </Switch>
    </>
  );
}

export default App;