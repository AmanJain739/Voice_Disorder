import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Button } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { Audio } from 'expo-av';
import { identifier } from '@babel/types';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import axios from "axios";



let recording = new Audio.Recording();

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [RecordedURI, SetRecordedURI] = useState("");
  const [AudioPerm, SetAudioPerm] = useState(false);
  const [isRecording, SetisRecording] = useState(false);
  const [isPLaying, SetisPLaying] = useState(false);
  const [audioBlob, SetAudioBlob] = useState();
  const [disorder, setDisorder] = useState(null);
  const Player = useRef(new Audio.Sound());

  useEffect(() => {
    GetPermission();
  }, []);

  const GetPermission = async () => {
    const getAudioPerm = await Audio.requestPermissionsAsync();
    SetAudioPerm(getAudioPerm.granted);
  };

  const startRecording = async () => {
    if (AudioPerm === true) {
      try {
        await recording.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        await recording.startAsync();
        SetisRecording(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      GetPermission();
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const result = recording.getURI();
      let res="";
      if(result!=null)
        res=result;
      let blob = await fetch(res).then(r => r.blob());
      SetAudioBlob(blob);
      SetRecordedURI(res); // Here is the URI
      recording = new Audio.Recording();
      SetisRecording(false);
    } catch (error) {
      console.log(error);
    }
  };

  const playSound = async () => {
    try {
      if(isPLaying===true){
        await Player.current.unloadAsync();
      }
      const result = await Player.current.loadAsync(
        { uri: RecordedURI },
        {},
        true
      );
      Player.current.playAsync();
      SetisPLaying(true);
    } catch (error) {
      console.log(error);
    }
  };

  const stopSound = async () => {
    try {
      const checkLoading = await Player.current.getStatusAsync();
      if (checkLoading.isLoaded === true) {
        await Player.current.stopAsync();
        SetisPLaying(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadFile = async () => {
    console.log(JSON.stringify(audioBlob));
    let data={"blob":audioBlob};
    fetch('http://6bab-106-215-93-145.ngrok.io/api/feature_extraction/', {
          method: 'POST',
          body: audioBlob
    }).then(response => response.json().then(data => {setDisorder(data['Disorder']); console.log(data['Disorder']) }));
  }

  return (
    <View style={styles.container}>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? () => stopRecording() : () => startRecording()}
      />
      <Button
        title="Play Sound"
        onPress={()=>playSound()}
      />
      <Text>{RecordedURI}</Text>
      <Button
        title="Load FIle"
        onPress={()=>loadFile()}
      />
      <View>
        {disorder===1 && <Text>Disorder Is Present</Text>}
        {disorder===0 && <Text>Disorder Is Not Present</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
