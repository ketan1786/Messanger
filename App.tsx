import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StreamChat } from 'stream-chat';
import { OverlayProvider, Chat, ChannelList, Channel } from "stream-chat-expo"
import { Text } from 'react-native';


import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';


const API_KEY = "pratvm5p2vjm"
const client = StreamChat.getInstance(API_KEY)

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [isReady, setIsReady] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<any> (null)

  useEffect(() => {
    const connectUser = async () => {
      await client.connectUser(
        {
          id: 'ketan',
          name: 'ketan pathak',
          image: 'https://i.imgur.com/fR9Jz14.png',
        },
        client.devToken('ketan'),
      )

      // Create a Channel 
      const channel = client.channel("messaging", "Public", { 
        name: 'Public Chat Room' 
      })
      await channel.watch()

      setIsReady(true)
     
    }

    connectUser()

    return () => client.disconnectUser()
  }, [])
  
  const onChannelPressed = (channel) => {
    setSelectedChannel(channel)
  }

  if (!isLoadingComplete || !isReady) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <OverlayProvider>
        <Chat client={client}>

        {selectedChannel ? (
          <Channel channel={selectedChannel}>
          <Text
           style={{ marginTop: 50 }}
           onPress={() => setSelectedChannel(null)}>
             Go Back
          </Text>
          </Channel>
        ) : (
          <ChannelList onSelect={onChannelPressed} />
        )}

        
        {/* <Navigation colorScheme={colorScheme} /> */}
        </Chat>
        </OverlayProvider>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
