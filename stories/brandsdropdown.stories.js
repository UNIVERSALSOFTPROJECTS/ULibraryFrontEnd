import { action } from '@storybook/addon-actions';
import { BrandsDropDown } from '../src/index';
import ServerConnection from '../src/js/server'

//ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"FORT2023FORTUNEUSOFFORTUNEBET12",CLIENT_CODE:"FORT", org:"FO"})
ServerConnection.setConfig({API:"https://lobby-bff.apiusoft.com",CLIENT_AUTH:"GOLD21GOLDENBET4A19028GOLDENBET1",CLIENT_CODE:"GOLD", domain:"goldenbet.pe", currency:"PEN", org:"GB"})
let items=[]
const onDepositOK=async ()=>{
  let data = await ServerConnection.game.getBrandList('all');
  items = data.filter(e=>e.name!='Proveedores');
}

let name = "";
let onSelectItem = {};

export default {
  title: 'BrandsDropDown',
  component: BrandsDropDown,
};

export const ShowBrands = () => ({
  Component: BrandsDropDown,
  props: { name, items,onSelectItem }
});
