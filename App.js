//import { StatusBar } from 'expo-status-bar';
//import { StyleSheet, Text, View } from 'react-native';
//import Search from './Components/Search'
import React from 'react';
import Navigation from './Navigation/Navigation';
import {Provider} from 'react-redux'
import Store from './Store/configurationStore'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <Navigation />
      </Provider>
    )
  }
}