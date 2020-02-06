import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import Initial from '../screens/AuthScreens/Initial';
import AuthNavigation from './AuthNavigation';
import AppNavigation from './AppNavigation/AppNavigation';

const SwitchNavigator = createSwitchNavigator(
  {
    Initial: Initial,
    Auth: AuthNavigation,
    App: AppNavigation,
  },
  {
    initialRouteName: 'Initial',
  },
);

const AppContainer = createAppContainer(SwitchNavigator);

export default AppContainer;
