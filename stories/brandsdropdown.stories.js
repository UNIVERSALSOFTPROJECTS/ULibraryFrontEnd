import { action } from '@storybook/addon-actions';
import { BrandsDropDown } from '../src/index';
import ServerConnection from '../src/js/server'

let items = ServerConnection;
let name = "";
let onSelectItem = {};

export default {
  title: 'Notifier',
  component: BrandsDropDown,
};

export const Notify = () => ({
  Component: Notifier,
  props: { name, items,onSelectItem }
});
