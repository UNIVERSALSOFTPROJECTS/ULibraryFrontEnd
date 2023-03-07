import { action } from '@storybook/addon-actions';
import { Notifier } from '../src/index';
import EventManager from './../src/js/EventManager'
import { notify } from '../src/index';

export default {
  title: 'Notifier',
  component: Notifier,
};

export const Notify = () => ({
  Component: Notifier,
  props: { EventManager }
});

