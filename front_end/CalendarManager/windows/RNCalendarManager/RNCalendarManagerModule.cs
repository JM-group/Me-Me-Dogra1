using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Calendar.Manager.RNCalendarManager
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNCalendarManagerModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNCalendarManagerModule"/>.
        /// </summary>
        internal RNCalendarManagerModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNCalendarManager";
            }
        }
    }
}
