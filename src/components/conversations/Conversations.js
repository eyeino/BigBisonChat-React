import React from 'react';

import ConversationCell from './ConversationCell';
import { fetcher } from '../../utils/api.js';

import useSWR from 'swr';
import { useRouteMatch } from 'react-router-dom';

export default function Conversations(props) {
  document.title = props.title;

  const match = useRouteMatch('/conversations/:otherUsername');
  const { data, error } = useSWR(`/conversations`, fetcher);

  return (
    <section className="flex-grow-0 sm:max-w-xs flex-shrink-0 sm:border-r-2 sm:border-gray-100 overflow-y-auto sm:ml-2 flex flex-col">
      { data && data
          .reduce((unique, item) => {
            return unique.includes(item.other_username) ? unique : [...unique, item, item.other_username]
          }, [])
          .filter(item => typeof item === 'object')
          .map(convo => {
          return (
            <ConversationCell
              key={convo.other_username}
              username={convo.other_username}
              body={convo.body}
              avatarUrl={convo.avatar_url}
              createdAt={convo.created_at}
              selected={match && match.params.otherUsername === convo.other_username}
            />
          );
        })}
      { error && <div className="p-4 bg-red-100 text-red-700">Failure to load.</div> }
      { (!data && !error) && <div className="p-4 bg-yellow-100 text-yellow-700">Give them a minute, the Heroku server is awakening...</div> }
      { data && data.length === 0 && (
        <div className="p-4 bg-yellow-100 text-yellow-700">
          <p>Welcome! You don't have any conversations yet! </p>
          <p>Press 'New' above and start talking!</p>
        </div>
      )}
    </section>
  );
}