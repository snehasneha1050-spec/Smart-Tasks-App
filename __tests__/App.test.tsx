/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

describe('App render', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('renders correctly', async () => {
    let app;

    await ReactTestRenderer.act(async () => {
      app = ReactTestRenderer.create(<App />);
      jest.advanceTimersByTime(2500);
      await Promise.resolve();
    });

    expect(app).toBeTruthy();
  });
});
