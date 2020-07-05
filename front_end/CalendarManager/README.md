
# react-native-calendar-manager

## Getting started

`$ npm install react-native-calendar-manager --save`

### Mostly automatic installation

`$ react-native link react-native-calendar-manager`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-calendar-manager` and add `RNCalendarManager.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNCalendarManager.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNCalendarManagerPackage;` to the imports at the top of the file
  - Add `new RNCalendarManagerPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-calendar-manager'
  	project(':react-native-calendar-manager').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-calendar-manager/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-calendar-manager')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNCalendarManager.sln` in `node_modules/react-native-calendar-manager/windows/RNCalendarManager.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using Calendar.Manager.RNCalendarManager;` to the usings at the top of the file
  - Add `new RNCalendarManagerPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNCalendarManager from 'react-native-calendar-manager';

// TODO: What to do with the module?
RNCalendarManager;
```
  