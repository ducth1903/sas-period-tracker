import React, { Component } from 'react';
import { Button, Text, View, Linking } from 'react-native';
import { TextInput } from 'react-native-paper';
import CryptoJS from "react-native-crypto-js";

// in Class, do not need to pass "props" as it is built in Class component
// "props" are immutable -> i.e. cannot change value of this.props.email
export class ClassA extends Component {
    state = {
        name: "DT",
        email: "",
        password: "",
        encryptedPassword: ""
    }

    handleEmail = (text) => {
        this.setState({ email: text })
    }
    handlePassword = (text) => {
        let encryptedText = CryptoJS.AES.encrypt(text+text, 'secret key 123').toString();
        this.setState({ password: text })
        // this.setState({ encryptedPassword: encryptedText })
        this.setState({ encryptedText: text })
    }
    login = (email, pass) => {
        // let decrypted = CryptoJS.AES.decrypt(this.state.encryptedPassword, 'secret key 123').toString(CryptoJS.enc.Utf8);
        // alert('email: ' + email + ' password: ' + pass)
        // Linking.openURL('https://google.com')
        fetch('http://192.168.0.43:8000/api/user/', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                encryptedPassword: this.state.encryptedPassword
            })
        })
        .then(resp => {
            // console.log("post resp = ", resp)
            resp.json()
            // resp.text()
        })
        .then(data => { 
            console.log(data) 
        })
        .catch((error) => {
            console.log(error)
        })
    }

    get = () => {
        fetch('http://192.168.0.43:8000/api/user/')
        .then(resp => resp.json())
        .then(data => { 
            console.log(data) 
        })
        .catch((error) => {
            console.log(error)
        })
    }

    render() {
        return (
            <View>
                <Text style={{fontSize:18}}>Hello from Class: {this.props.email} - {this.state.name}</Text>
                <TextInput
                    label="Email"
                    value={this.state.email}
                    onChangeText={this.handleEmail} />
                <TextInput
                    label="Password"
                    secureTextEntry={true}
                    value={this.state.password}
                    onChangeText={this.handlePassword} />
                {/* <Button title="Click me" onPress={()=> this.setState({name: "Name changed"})}></Button> */}
                <Button title="Sign In" onPress={() => this.login(this.state.email, this.state.password)}></Button>
                <Button title="GET" onPress={() => this.get()}></Button>
            </View>
        )
    }
}

export default ClassA