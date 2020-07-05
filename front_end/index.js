/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Platform } from "react-native";
import React from "react";


AppRegistry.registerComponent("mashtub", () => App);


/*
import { AppRegistry } from "react-native";
import App from "./App";
import { Platform } from "react-native";

if (Platform.OS == "ios") {
  AppRegistry.registerComponent("fiestago", () => App);
} else {
  AppRegistry.registerComponent("FiestaGo", () => App);
}
*/