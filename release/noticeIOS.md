# Build iOS app without signed code (no developper account)

## Required 

- Device jailbroken
- Tested on my iPhone 5 iOS 7.1.2
- Xcode 7 installed on OS X 10.9.5

## Step 1

> ionic build ios

And go to platforms/ios

## Step 2

Clean the project :

> xcodebuild clean -project MAideas.xcodeproj -configuration Release -alltargets

## Step 3

Generate an archive with the project : 

> xcodebuild archive -project MAideas.xcodeproj -scheme MAideas -archivePath MAideas.xcarchive CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO


## Step 4

Transform archive into ipa file :

> xcodebuild -exportArchive -archivePath MAideas.xcarchive -exportPath MAideas -exportFormat ipa
