import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import * as DocumentPicker from 'expo-document-picker';

export default function TabTwoScreen() {

  const [URI, SetURI] = useState("");
  const [disorder, setDisorder] = useState(null);
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({copyToCacheDirectory: false,});
    console.log(result.uri);
    SetURI(result.uri);
  }
  const SendFile = async () => {
    let blob = await fetch(URI).then(r => r.blob());
    console.log(JSON.stringify(blob));
    fetch('http://6bab-106-215-93-145.ngrok.io/api/feature_extraction/', {
          method: 'POST',
          body: blob
    }).then(response => response.json().then(data => setDisorder(data['Disorder'])));
    console.log(disorder);
  }
  return (
    <View >
      <Text>Upload MP3 File</Text>
      <View>
        <TouchableOpacity>
          <Button
            title="upload your file"
            color="orange"
            onPress={pickDocument}
          />
        </TouchableOpacity>
      </View>
      <View>
        <Button
          title="Check Disorder"
          onPress={SendFile}
        />
      </View>
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
