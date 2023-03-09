import { action } from '@storybook/addon-actions';
import { Withdrawalx } from '../src/index';
import ServerConnection from '../src/js/server'

// ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT"})

let user = {token:"ajsbfjhsgfhjakugilusguwger",balance:12.21} ;
export default {
  title: 'Withdrawal-x',
  component: Withdrawalx,
};


export const withdrawal = () => ({
  Component: Withdrawalx,
  props: { user, open:true }
});

