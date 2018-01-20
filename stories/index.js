import React from 'react';

import {storiesOf} from '@storybook/react';
import Raket from './../src/Raket';

const TEST_URL_VALID = 'ws://demos.kaazing.com/echo';

storiesOf('Raket', module).add('without indicator', () => (
  <div>
    <h1>Raket without indicator</h1>
    <Raket url={TEST_URL_VALID} onEvent={e => {}}/>
  </div>
));

storiesOf('Raket', module).add('with default indicator', () => (
  <div>
    <h1>Raket with default indicator</h1>
    <Raket showIndicator url={TEST_URL_VALID} onEvent={e => {}}/>
  </div>
));

storiesOf('Raket', module).add('with indicator and custom status colors', () => (
  <div>
    <h1>Raket with indicator and custom status colors</h1>
    <Raket
      showIndicator
      url={TEST_URL_VALID}
      onEvent={e => {}}
      statusColors={{
      closed: 'orange',
      open: 'greenyellow',
      error: 'yellow'
    }}/>
  </div>
));

storiesOf('Raket', module).add('with custom indicator style', () => (
  <div>
    <h1>Raket with custom indicator style</h1>
    <Raket
      showIndicator
      url={TEST_URL_VALID}
      onEvent={e => {}}
      style={{
      backgroundColor: 'blue',
      borderRadius: 0,
      height: '50px',
      width: '50px'
    }}/>
  </div>
));
