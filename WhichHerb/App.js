import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  ImagePickerIOS,
  Image
} from "react-native";

// import axios from "axios";
// import { Constants } from "expo";
// const { manifest } = Constants;

// const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
//   ? manifest.debuggerHost.split(`:`).shift().concat(`:8000`)
//   : `api.example.com`;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: "https://picsum.photos/200/300/?random",
      prediction: "",
      loading: false
    };
  }

  checkimage = () => {
    this.setState({ loading: true });
    const formData = new FormData();
    formData.append('name', 'herbImage');
    formData.append('file', {
      uri: this.state.photos,
      type: 'image/jpeg',
      name: 'imageHerb',
    });
    fetch("https://whichherb.herokuapp.com/upload", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        // "Content-Type": "application/json",
        "Content-Type": "multipart/form-data",
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: formData,// body data type must match "Content-Type" header
    }).then(res => {
      res.json().then(resJson => {
        this.setState({ loading: false });
        console.log(resJson);
        this.setState({ prediction: resJson.predictions })
      })

    }).catch(err => {
      console.log("err", err);
    })
  }

  handlePress = () => {
    this.setState({ prediction: "" })
    ImagePickerIOS.openCameraDialog(
      {},
      image => {
        this.setState({ photos: image });
      },
      () => { }
    );
  };

  render() {
    const isLoading = this.state.loading;
    let indicator;
    if (isLoading) {
      indicator = <View style={styles.loading}><ActivityIndicator size="large" /></View>
    }
    return (
      <View style={styles.container}>

        {indicator}




        <Text>Which one is Parsley, Coriander or Mint?</Text>
        <Text>Take the picture and find out</Text>
        <Button title="Take A Picture" onPress={this.handlePress} />
        <Image source={{ uri: this.state.photos, width: 250, height: 250 }} />
        <Button title="Get answer" onPress={this.checkimage} />
        <Text style={{ fontSize: 40 }}>{this.state.prediction}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.8,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  }

});
