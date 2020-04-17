import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {PricingCard, ListItem, Text} from 'react-native-elements';
import Colors from '../../../constants/Colors';

import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../../components/Buttons/HeaderButton';

const Licences = props => {
  const licences = [
    {
      name: 'Professional A/B/C...',
      expire: 'Not issued',
    },
    {
      name: 'Amateur by boat',
      expire: 'Not issued',
    },
    {
      name: 'Amateur with Speargun',
      expire: '12/07/2020',
    },
    {
      name: 'Amateur at Water Reservoirs',
      expire: '12/07/2020',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text h4 h4Style={{padding: 20, color: Colors.primary}}>
        Licences Status (Expires On):
      </Text>
      <View>
        {licences.map((l, i) => (
          <ListItem
            key={i}
            titleStyle={{fontSize: 18, color: "#4f9deb"}}
            rightTitle={l.expire}
            title={l.name}
            subtitle={l.subtitle}
            bottomDivider
          />
        ))}
      </View>
      <Text h4 h4Style={{padding: 20, color: Colors.primary}}>
        Renew your Licences:
      </Text>
      <PricingCard
        color="#4f9deb"
        titleStyle={{fontSize: 25}}
        infoStyle={{fontSize: 20}}
        pricingStyle={{height: 0}}
        title="Professional Fisheries License"
        info={['Categories A-B-C ...', 'Polyvalent -Trawls']}
        button={{title: '  RENEW LICENCE', icon: 'replay'}}
      />
      <PricingCard
        color="#4f9deb"
        titleStyle={{fontSize: 25}}
        infoStyle={{fontSize: 20}}
        pricingStyle={{height: 0}}
        title="Amateur Fishing License by boat"
        info={['Cost €35']}
        button={{title: '  RENEW LICENCE', icon: 'replay'}}
      />
      <PricingCard
        color="#4f9deb"
        titleStyle={{fontSize: 25}}
        infoStyle={{fontSize: 20}}
        pricingStyle={{height: 0}}
        title="Amateur Fishing License with Speargun"
        info={['Cost €35']}
        button={{title: '  RENEW LICENCE', icon: 'replay'}}
      />
      <PricingCard
        color="#4f9deb"
        titleStyle={{fontSize: 25}}
        infoStyle={{fontSize: 20}}
        pricingStyle={{height: 0}}
        title="Amateur Fishing License at Water Reservoirs (Dams)"
        info={['Cost €35']}
        button={{title: '  RENEW LICENCE', icon: 'replay'}}
      />
    </ScrollView>
  );
}; //Amateur Fishing License with Boat

Licences.navigationOptions = navData => {
  return {
    headerTitle: 'Licences',
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  signOut: {
    color: '#F57C00',
  },
});

export default Licences;
