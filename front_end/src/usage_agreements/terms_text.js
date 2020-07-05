import React,{Component} from 'react'
import {View, Text} from 'react-native'
 
export default class TermText extends Component {
 render() {
   return (
     <View style={{  }}>
        <Text>      
            {"\n"}
            Eigenuity Inc. is a corporation formed pursuant to the Canada Business Corporations Act (R.S.C., 1985, c. C-44) in Canada. In consideration for permitting your access to our website and online services and other good and valuable consideration, you agree as follows:
            {"\n"}{"\n"}{"\n"}
        </Text>    

        <Text>
            These terms and conditions (the "Terms") form a legally binding agreement which govern your access to and use of Eigenuity 
            Inc.'s, ("we", "us" or "our") website ("Website") and our MadLipz mobile application (the "App"). 
            Our Website is hosted at http://madlipz.com and other domains and sub-domains. 
            Our App is available for official download on the Apple iOS App Store (here) and the Google Play store (here). 
            You are not permitted to download or use our App from any other third parties.
            {"\n"}{"\n"}{"\n"}

            There are provisions in these Terms which limit our liability and impose obligations on you. You must review these Terms, 
            along with any policies incorporated by reference, before using the Website or the App.
            {"\n"}{"\n"}{"\n"}

            If you are using the Website and/or App on behalf of, or in the employ of, an organization 
            (corporation, trust, partnership, etc.), you are agreeing to these Terms for that organization and representing and 
            warranting that you have the authority to bind that organization to these Terms. In such a case, "you" and "your" 
            will also refer to that organization and yourself individually. For greater clarity, both you as an individual and 
            your organization are legally bound by these Terms which form an agreement between you and Eigenuity Inc.
            {"\n"}{"\n"}{"\n"}
        </Text>

        <Text style={{fontWeight: "bold"}}>
            Privacy
        </Text>
        <Text>
            {"\n"}{"\n"}{"\n"}
            We collect and use personal information in accordance with these Terms and our privacy policy which is 
            incorporated by reference and available for your review, as amended, at https://www.madlipz.com/privacy. By using our Website and App, 
            you consent to such processing and you warrant that all information provided by you is accurate.
            {"\n"}{"\n"}{"\n"}
        </Text>            
        <Text style={{fontWeight: "bold"}}>
            About Our App
        </Text>
        <Text> 
            {"\n"}{"\n"}{"\n"}
            Our App allows you to make instant voiceover parodies whether by uploading video clips of your own, 
            or using clips hosted via the App and uploaded by other users. When creating content via the App, 
            you agree to do so in accordance with these Terms and our Acceptable Use Policy, 
            which is incorporated by reference.
            {"\n"}{"\n"}{"\n"}
        </Text>

        <Text style={{fontWeight: "bold"}}>        
            Establishing an Account
        </Text>
        
        <Text>
            {"\n"}{"\n"}{"\n"}
            You may browse the public facing sections of our Website and App without establishing an account or
            providing us with any personal information. However, in order to create your own content using our App, 
            you are required to establish an account. To establish an account:

            {"\n"}{"\n"}
            You must be at least eighteen (18) years old, or have the consent of your parent or guardian to create the account;
            {"\n"}
            You must provide an email address;
            {"\n"}
            You must provide an password;

            {"\n"}{"\n"}
            You agree that access to your account constitutes good and valuable consideration in exchange for agreeing 
            to these Terms, our Privacy Policy and all other documents or policies incorporated by reference.
            {"\n"}{"\n"}{"\n"}

            Third-Party Login Providers. We also permit you to create your account via third-party login providers including Google and Facebook. If you elect to establish your account via a third- party provider, you permit us to collect such personal information the third party sends to us in order to establish your account, including for example, your profile photo, email address and other information.
            {"\n"}{"\n"}{"\n"}

            Account Non-Transferable. Access to your account is not transferable and is only intended for the individual that established the account. You are responsible for safeguarding the password you create and use to access the Website and App and you agree not to disclose your password to any third party. You are responsible for any activity on your account, whether or not you authorized that activity and you agree to immediately notify us of any unauthorized use of your account.
            {"\n"}{"\n"}{"\n"}

            Account Security. You agree and understand that the technical processing and transmission of the Website, the App and the data, content and information you provide in or to the Website or App, may be transferred unencrypted and involve transmissions over various networks and devices. For your own protection and security, you should not use a password on our service which you use to login to any other accounts or services.
            {"\n"}{"\n"}{"\n"}
        </Text>
     </View>
   );
 }
}