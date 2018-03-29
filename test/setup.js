/* eslint-disable import/no-extraneous-dependencies */
import 'babel-polyfill';
import { shallow, render, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallowWithStore, mountWithStore } from 'enzyme-redux';
import { createMockStore } from 'redux-test-utils';

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.shallowWithStore = shallowWithStore;
global.mountWithStore = mountWithStore;
global.createMockStore = createMockStore;
